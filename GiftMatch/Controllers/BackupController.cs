using GiftMatch.api.Constants;
using GiftMatch.api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace GiftMatch.api.Controllers
{
    [ApiController]
    [Authorize(Policy = "AdminOnly")]
    public class BackupController : BaseController
    {
        private readonly IBackupService _backupService;
        private readonly ILogger<BackupController> _logger;

        public BackupController(IBackupService backupService, ILogger<BackupController> logger)
        {
            _backupService = backupService;
            _logger = logger;
        }

        [HttpPost(ApiRoutes.Backup.Create)]
        public async Task<ActionResult<BackupInfo>> CreateBackup()
        {
            _logger.LogInformation($"Backup creation requested by user {GetCurrentUserId()}");
            
            string fileName = await _backupService.CreateBackupAsync();
            List<BackupInfo> backups = await _backupService.GetBackupsAsync();
            BackupInfo? backup = backups.FirstOrDefault(b => b.FileName == fileName);

            return Ok(backup);
        }

        [HttpGet(ApiRoutes.Backup.GetAll)]
        public async Task<ActionResult<List<BackupInfo>>> GetAllBackups()
        {
            List<BackupInfo> backups = await _backupService.GetBackupsAsync();
            return Ok(backups);
        }

        [HttpGet(ApiRoutes.Backup.GetLatest)]
        public async Task<ActionResult<BackupInfo>> GetLatestBackup()
        {
            BackupInfo? backup = await _backupService.GetLatestBackupAsync();
            if (backup == null)
            {
                return NotFound(new { message = "Резервные копии не найдены" });
            }
            return Ok(backup);
        }
        
        [HttpPost(ApiRoutes.Backup.Restore)]
        public async Task<ActionResult> RestoreBackup([FromBody] RestoreBackupRequest request)
        {
            _logger.LogWarning($"Database restore requested by user {GetCurrentUserId()}: {request.BackupFileName}");
            
            await _backupService.RestoreBackupAsync(request.BackupFileName);
            
            return Ok(new { message = $"База данных успешно восстановлена из {request.BackupFileName}" });
        }

        [HttpDelete(ApiRoutes.Backup.Delete)]
        public async Task<ActionResult> DeleteBackup(string fileName)
        {
            _logger.LogInformation($"Backup deletion requested by user {GetCurrentUserId()}: {fileName}");
            
            await _backupService.DeleteBackupAsync(fileName);
            
            return NoContent();
        }

        [HttpGet(ApiRoutes.Backup.Download)]
        public async Task<ActionResult> DownloadBackup(string fileName)
        {
            string backupDirectory = Path.Combine(Directory.GetCurrentDirectory(), "backups");
            string filePath = Path.Combine(backupDirectory, fileName);

            if (!System.IO.File.Exists(filePath))
            {
                return NotFound(new { message = "Файл резервной копии не найден" });
            }
            
            MemoryStream memory = new MemoryStream();
            using (FileStream stream = new FileStream(filePath, FileMode.Open))
            {
                await stream.CopyToAsync(memory);
            }
            memory.Position = 0;

            return File(memory, "application/octet-stream", fileName);
        }
    }

    public class RestoreBackupRequest
    {
        public string BackupFileName { get; set; } = null!;
    }
}