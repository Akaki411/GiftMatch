namespace GiftMatch.api.Constants
{
    public static class Router
    {
        public static string GetUserUrl(int userId)
        {
            return ApiRoutes.User.GetById.Replace("{userId}", userId.ToString());
        }

        public static string GetProductUrl(int productId)
        {
            return ApiRoutes.Product.GetById.Replace("{productId}", productId.ToString());
        }

        public static string GetProductsByCategoryUrl(int categoryId, int page = 1, int limit = 10)
        {
            string baseUrl = ApiRoutes.Product.GetByCategory.Replace("{categoryId}", categoryId.ToString());
            return $"{baseUrl}?page={page}&limit={limit}";
        }

        public static string GetCategoryUrl(int categoryId)
        {
            return ApiRoutes.Category.Delete.Replace("{categoryId}", categoryId.ToString());
        }

        public static string GetWishlistUrl(int wishlistId)
        {
            return ApiRoutes.Wishlist.GetById.Replace("{wishlistId}", wishlistId.ToString());
        }

        public static string GetWishlistItemUrl(int wishlistItemId)
        {
            return ApiRoutes.Wishlist.RemoveItem.Replace("{wishlistItemId}", wishlistItemId.ToString());
        }

        public static string GetFavoriteUrl(int productId)
        {
            return ApiRoutes.Favorite.Add.Replace("{productId}", productId.ToString());
        }

        public static string GetCartItemUrl(int cartItemId)
        {
            return ApiRoutes.Cart.RemoveItem.Replace("{cartItemId}", cartItemId.ToString());
        }

        public static string GetOrderStatusUrl(int orderId)
        {
            return ApiRoutes.Order.UpdateStatus.Replace("{orderId}", orderId.ToString());
        }

        public static string GetOrderDetailsUrl(int orderId)
        {
            return ApiRoutes.Order.UpdateDetails.Replace("{orderId}", orderId.ToString());
        }

        public static string WithPagination(string url, int page, int limit)
        {
            var separator = url.Contains('?') ? "&" : "?";
            return $"{url}{separator}page={page}&limit={limit}";
        }

        public static string WithSearch(string url, string searchQuery)
        {
            if (string.IsNullOrWhiteSpace(searchQuery))
            {
                return url;
            }
            string separator = url.Contains('?') ? "&" : "?";
            return $"{url}{separator}searchName={Uri.EscapeDataString(searchQuery)}";
        }
    }

    public static class RouteExtensions
    {
        public static string Paginate(this string url, int page, int limit)
        {
            return Router.WithPagination(url, page, limit);
        }

        public static string Search(this string url, string query)
        {
            return Router.WithSearch(url, query);
        }
    }
}

