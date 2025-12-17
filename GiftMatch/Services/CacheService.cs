using Microsoft.Extensions.Caching.Distributed;
using System.Text.Json;
using Microsoft.Extensions.Logging;

namespace GiftMatch.api.Services
{
    public interface ICacheService
    {
        Task<T?> GetAsync<T>(string key);
        Task SetAsync<T>(string key, T value, TimeSpan? expiration = null);
        Task RemoveAsync(string key);
        Task RemoveByPrefixAsync(string prefix);
        Task<bool> ExistsAsync(string key);
    }

    public class CacheService : ICacheService
    {
        private readonly IDistributedCache _cache;
        private readonly ILogger<CacheService> _logger;
        private static readonly JsonSerializerOptions _jsonOptions = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = false
        };

        public CacheService(IDistributedCache cache, ILogger<CacheService> logger)
        {
            _cache = cache;
            _logger = logger;
        }

        public async Task<T?> GetAsync<T>(string key)
        {
            try
            {
                string? cachedData = await _cache.GetStringAsync(key);
                
                if (string.IsNullOrEmpty(cachedData))
                {
                    _logger.LogDebug($"Cache miss: {key}");
                    return default;
                }

                _logger.LogDebug($"Cache hit: {key}");
                return JsonSerializer.Deserialize<T>(cachedData, _jsonOptions);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting cache key: {key}");
                return default;
            }
        }

        public async Task SetAsync<T>(string key, T value, TimeSpan? expiration = null)
        {
            try
            {
                string serialized = JsonSerializer.Serialize(value, _jsonOptions);
                DistributedCacheEntryOptions options = new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = expiration ?? TimeSpan.FromMinutes(30)
                };

                await _cache.SetStringAsync(key, serialized, options);
                _logger.LogDebug($"Cache set: {key} (expires in {options.AbsoluteExpirationRelativeToNow})");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error setting cache key: {key}");
            }
        }

        public async Task RemoveAsync(string key)
        {
            try
            {
                await _cache.RemoveAsync(key);
                _logger.LogDebug($"Cache removed: {key}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error removing cache key: {key}");
            }
        }

        public async Task RemoveByPrefixAsync(string prefix)
        {
            _logger.LogWarning($"RemoveByPrefix called with prefix: {prefix}, but not fully implemented for IDistributedCache");
            await Task.CompletedTask;
        }

        public async Task<bool> ExistsAsync(string key)
        {
            try
            {
                string? cachedData = await _cache.GetStringAsync(key);
                return !string.IsNullOrEmpty(cachedData);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error checking cache key existence: {key}");
                return false;
            }
        }
    }

    public static class CacheKeys
    {
        public static string Product(int productId) => $"product:{productId}";
        public static string Products(int page, int limit) => $"products:page:{page}:limit:{limit}";
        public static string ProductsByCategory(int categoryId, int page, int limit) => 
            $"products:category:{categoryId}:page:{page}:limit:{limit}";
        
        public static string Category(int categoryId) => $"category:{categoryId}";
        public static string Categories() => "categories:all";
        public static string CategoriesSearch(string search) => $"categories:search:{search}";
        
        public static string User(int userId) => $"user:{userId}";
        public static string UserAvatar(int userId) => $"user:{userId}:avatar";
        
        public static string Cart(int userId) => $"cart:{userId}";
        public static string Wishlist(int userId) => $"wishlist:{userId}";
        public static string Favorites(int userId) => $"favorites:{userId}";

        public static class Prefixes
        {
            public const string Products = "products:";
            public const string Categories = "categories:";
            public const string Users = "user:";
            public const string Carts = "cart:";
        }
    }
}