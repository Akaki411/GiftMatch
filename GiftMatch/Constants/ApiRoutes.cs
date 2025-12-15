namespace GiftMatch.api.Constants
{
    public static class ApiRoutes
    {
        private const string Base = "api";

        public static class Auth
        {
            public const string Base = $"{ApiRoutes.Base}/auth";

            public const string Register = $"{Base}/register";
            public const string Login = $"{Base}/login";
            public const string Validate = $"{Base}/validate";
            public const string CheckEmail = $"{Base}/email";
        }

        public static class User
        {
            public const string Base = $"{ApiRoutes.Base}/user";

            public const string GetAll = Base;
            public const string GetCurrent = $"{Base}/me";
            public const string GetById = $"{Base}/{{userId:int}}";
            public const string UpdateCurrent = $"{Base}/me";
            public const string UpdateById = $"{Base}/{{userId:int}}";
        }

        public static class Product
        {
            public const string Base = $"{ApiRoutes.Base}/product";

            public const string GetAll = Base;
            public const string GetById = $"{Base}/{{productId:int}}";
            public const string GetByCategory = $"{Base}/category/{{categoryId:int}}";
            public const string Create = Base;
            public const string Update = $"{Base}/{{productId:int}}";
            public const string Delete = $"{Base}/{{productId:int}}";
        }
        
        public static class Category
        {
            public const string Base = $"{ApiRoutes.Base}/category";

            public const string GetAll = Base;
            public const string Create = Base;
            public const string Delete = $"{Base}/{{categoryId:int}}";
        }

        public static class Wishlist
        {
            public const string Base = $"{ApiRoutes.Base}/wishlist";

            public const string GetAll = Base;
            public const string GetById = $"{Base}/{{wishlistId:int}}";
            public const string AddItem = $"{Base}/items";
            public const string RemoveItem = $"{Base}/items/{{wishlistItemId:int}}";
        }

        public static class Favorite
        {
            public const string Base = $"{ApiRoutes.Base}/favorite";

            public const string GetAll = Base;
            public const string Add = $"{Base}/{{productId:int}}";
            public const string Remove = $"{Base}/{{productId:int}}";
        }

        public static class Cart
        {
            public const string Base = $"{ApiRoutes.Base}/cart";
            
            public const string Get = Base;
            public const string AddItem = $"{Base}/items";
            public const string RemoveItem = $"{Base}/items/{{cartItemId:int}}";
            public const string Checkout = $"{Base}/checkout";
        }

        public static class Order
        {
            public const string Base = $"{ApiRoutes.Base}/order";
            
            public const string GetAll = Base;
            public const string UpdateStatus = $"{Base}/{{orderId:int}}/status";
            public const string UpdateDetails = $"{Base}/{{orderId:int}}/details";
        }
        
        public static class Image
        {
            public const string Base = $"{ApiRoutes.Base}/image";

            public const string UploadAvatar = $"{Base}/avatar";
            public const string UploadProductImage = $"{Base}/product";
            public const string UploadProductImages = $"{Base}/product/multiple";
            public const string UploadCategoryImage = $"{Base}/category";
            public const string Delete = $"{Base}/{{imageId:int}}";
        }
    }
}