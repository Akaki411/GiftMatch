using System.Diagnostics;
using GiftMatch.Migrations;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace GiftMatch.api.Services
{
    public interface IBackupService
    {
        Task<string> CreateBackupAsync();
        Task<List<BackupInfo>> GetBackupsAsync();
        Task RestoreBackupAsync(string backupFileName);
        Task DeleteBackupAsync(string backupFileName);
        Task<BackupInfo?> GetLatestBackupAsync();
    }

    public class BackupInfo
    {
        public string FileName { get; set; } = null!;
        public long SizeBytes { get; set; }
        public DateTime CreatedAt { get; set; }
        public string SizeFormatted => FormatSize(SizeBytes);

        private static string FormatSize(long bytes)
        {
            string[] sizes = { "B", "KB", "MB", "GB" };
            double len = bytes;
            int order = 0;
            while (len >= 1024 && order < sizes.Length - 1)
            {
                order++;
                len = len / 1024;
            }
            return $"{len:0.##} {sizes[order]}";
        }
    }

    public class BackupService : IBackupService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<BackupService> _logger;
        private readonly string _backupDirectory;
        private readonly string _connectionString;

        public BackupService(IConfiguration configuration, ILogger<BackupService> logger)
        {
            Connection connection = new Connection("settings.json");
            _configuration = configuration;
            _logger = logger;

            _backupDirectory = _configuration["Backup:Directory"] ?? Path.Combine(Directory.GetCurrentDirectory(), "backups");

            _connectionString = connection.GetConnectionString();

            if (!Directory.Exists(_backupDirectory))
            {
                Directory.CreateDirectory(_backupDirectory);
                _logger.LogInformation($"Backup directory created: {_backupDirectory}");
            }
        }

        public async Task<string> CreateBackupAsync()
        {
            String timestamp = DateTime.UtcNow.ToString("yyyyMMdd_HHmmss");
            String fileName = $"backup_{timestamp}.sql";
            String filePath = Path.Combine(_backupDirectory, fileName);
            Connection connection = new Connection("settings.json");
            ConnectData  connectData = connection.GetConnectData();
            try
            {
                string arguments = $"-h {connectData.Host} " +
                               $"-p {connectData.Port} " +
                               $"-U {connectData.Username} " +
                               $"-d {connectData.Database} " +
                               $"-F p " +
                               $"-f \"{filePath}\"";

                ProcessStartInfo startInfo = new ProcessStartInfo
                {
                    FileName = "pg_dump",
                    Arguments = arguments,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                };
                
                startInfo.EnvironmentVariables["PGPASSWORD"] = connectData.Password;

                using Process? process = Process.Start(startInfo);
                if (process == null)
                {
                    throw new InvalidOperationException("Failed to start pg_dump process");
                }

                string output = await process.StandardOutput.ReadToEndAsync();
                string error = await process.StandardError.ReadToEndAsync();

                await process.WaitForExitAsync();

                if (process.ExitCode != 0)
                {
                    _logger.LogError($"Backup failed: {error}");
                    throw new InvalidOperationException($"Backup failed: {error}");
                }

                FileInfo fileInfo = new FileInfo(filePath);
                _logger.LogInformation($"Backup created successfully: {fileName} ({fileInfo.Length} bytes)");

                await CleanupOldBackupsAsync();

                return fileName;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating backup");
                if (File.Exists(filePath))
                {
                    File.Delete(filePath);
                }
                throw;
            }
        }

        public async Task<List<BackupInfo>> GetBackupsAsync()
        {
            return await Task.Run(() =>
            {
                List<BackupInfo> backups = new List<BackupInfo>();
                DirectoryInfo directory = new DirectoryInfo(_backupDirectory);

                foreach (FileInfo file in directory.GetFiles("backup_*.sql").OrderByDescending(f => f.CreationTime))
                {
                    backups.Add(new BackupInfo
                    {
                        FileName = file.Name,
                        SizeBytes = file.Length,
                        CreatedAt = file.CreationTime
                    });
                }
                return backups;
            });
        }

        public async Task RestoreBackupAsync(string backupFileName)
        {
            String filePath = Path.Combine(_backupDirectory, backupFileName);
            Connection connection = new Connection("settings.json");
            ConnectData  connectData = connection.GetConnectData();
            if (!File.Exists(filePath))
            {
                throw new FileNotFoundException($"Backup file not found: {backupFileName}");
            }

            try
            {
                string arguments = $"-h {connectData.Host} " +
                               $"-p {connectData.Port} " +
                               $"-U {connectData.Username} " +
                               $"-d {connectData.Database} " +
                               $"-f \"{filePath}\"";

                ProcessStartInfo startInfo = new ProcessStartInfo
                {
                    FileName = "psql",
                    Arguments = arguments,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                };

                startInfo.EnvironmentVariables["PGPASSWORD"] = connectData.Password;

                using Process? process = Process.Start(startInfo);
                if (process == null)
                {
                    throw new InvalidOperationException("Failed to start psql process");
                }

                string output = await process.StandardOutput.ReadToEndAsync();
                string error = await process.StandardError.ReadToEndAsync();

                await process.WaitForExitAsync();

                if (process.ExitCode != 0)
                {
                    _logger.LogError($"Restore failed: {error}");
                    throw new InvalidOperationException($"Restore failed: {error}");
                }

                _logger.LogInformation($"Database restored from backup: {backupFileName}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error restoring backup: {backupFileName}");
                throw;
            }
        }

        public async Task DeleteBackupAsync(string backupFileName)
        {
            string filePath = Path.Combine(_backupDirectory, backupFileName);

            if (!File.Exists(filePath))
            {
                throw new FileNotFoundException($"Backup file not found: {backupFileName}");
            }

            await Task.Run(() =>
            {
                File.Delete(filePath);
                _logger.LogInformation($"Backup deleted: {backupFileName}");
            });
        }

        public async Task<BackupInfo?> GetLatestBackupAsync()
        {
            List<BackupInfo> backups = await GetBackupsAsync();
            return backups.FirstOrDefault();
        }

        private async Task CleanupOldBackupsAsync()
        {
            int maxBackups = _configuration.GetValue<int>("Backup:MaxBackups", 10);
            var backups = await GetBackupsAsync();

            if (backups.Count > maxBackups)
            {
                IEnumerable<BackupInfo> toDelete = backups.Skip(maxBackups);
                foreach (BackupInfo backup in toDelete)
                {
                    try
                    {
                        await DeleteBackupAsync(backup.FileName);
                        _logger.LogInformation($"Old backup deleted: {backup.FileName}");
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, $"Failed to delete old backup: {backup.FileName}");
                    }
                }
            }
        }
    }
    public class AutoBackupService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<AutoBackupService> _logger;
        private readonly IConfiguration _configuration;

        public AutoBackupService(IServiceProvider serviceProvider, ILogger<AutoBackupService> logger, IConfiguration configuration)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
            _configuration = configuration;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            if (!_configuration.GetValue<bool>("Backup:AutoBackup:Enabled", false))
            {
                _logger.LogInformation("Auto backup is disabled");
                return;
            }

            int intervalHours = _configuration.GetValue<int>("Backup:AutoBackup:IntervalHours", 24);
            _logger.LogInformation($"Auto backup enabled. Interval: {intervalHours} hours");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await Task.Delay(TimeSpan.FromHours(intervalHours), stoppingToken);

                    using IServiceScope scope = _serviceProvider.CreateScope();
                    IBackupService backupService = scope.ServiceProvider.GetRequiredService<IBackupService>();

                    _logger.LogInformation("Starting automatic backup...");
                    string fileName = await backupService.CreateBackupAsync();
                    _logger.LogInformation($"Automatic backup completed: {fileName}");
                }
                catch (OperationCanceledException)
                {
                    break;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error during automatic backup");
                }
            }
        }
    }
}