using Microsoft.EntityFrameworkCore;

namespace GiftMatch.Entity
{
    public class GiftMatchDbContext : DbContext
    {
        public GiftMatchDbContext(DbContextOptions<GiftMatchDbContext> options) : base(options) { }

        public DbSet<Image> Images { get; set; } = null!;
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Category> Categories { get; set; } = null!;
        public DbSet<Product> Products { get; set; } = null!;
        public DbSet<ProductCategory> ProductCategories { get; set; } = null!;
        public DbSet<ProductImage> ProductImages { get; set; } = null!;
        public DbSet<Wishlist> Wishlists { get; set; } = null!;
        public DbSet<WishlistItem> WishlistItems { get; set; } = null!;
        public DbSet<Favorite> Favorites { get; set; } = null!;
        public DbSet<CartItem> CartItems { get; set; } = null!;
        public DbSet<Order> Orders { get; set; } = null!;
        public DbSet<OrderItem> OrderItems { get; set; } = null!;

        [Obsolete("Obsolete")]
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(e => e.Email).IsUnique();
                entity.HasIndex(e => e.Role);

                entity.Property(e => e.Role).HasConversion<string>();

                entity.HasCheckConstraint("CK_User_Role", "role IN ('USER', 'MODER', 'ADMIN', 'SUPPORT')");

                entity.HasOne(e => e.AvatarImage)
                    .WithMany(i => i.Users)
                    .HasForeignKey(e => e.AvatarImageId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasOne(e => e.ParentCategory)
                    .WithMany(c => c.SubCategories)
                    .HasForeignKey(e => e.ParentCategoryId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasIndex(e => e.Name);
                entity.HasIndex(e => e.IsActive);

                entity.HasCheckConstraint("CK_Product_Price", "price >= 0");
                entity.HasCheckConstraint("CK_Product_StockQuantity", "stock_quantity >= 0");
            });

            modelBuilder.Entity<ProductCategory>(entity =>
            {
                entity.HasKey(pc => new { pc.ProductId, pc.CategoryId });

                entity.HasIndex(e => e.CategoryId);

                entity.HasOne(pc => pc.Product)
                    .WithMany(p => p.ProductCategories)
                    .HasForeignKey(pc => pc.ProductId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(pc => pc.Category)
                    .WithMany(c => c.ProductCategories)
                    .HasForeignKey(pc => pc.CategoryId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<ProductImage>(entity =>
            {
                entity.HasIndex(e => e.ProductId);
                entity.HasIndex(e => new { e.ProductId, e.ImageId }).IsUnique();

                entity.HasOne(pi => pi.Product)
                    .WithMany(p => p.ProductImages)
                    .HasForeignKey(pi => pi.ProductId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(pi => pi.Image)
                    .WithMany(i => i.ProductImages)
                    .HasForeignKey(pi => pi.ImageId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Wishlist>(entity =>
            {
                entity.HasIndex(e => e.UserId);

                entity.HasOne(w => w.User)
                    .WithMany(u => u.Wishlists)
                    .HasForeignKey(w => w.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<WishlistItem>(entity =>
            {
                entity.HasIndex(e => e.WishlistId);
                entity.HasIndex(e => new { e.WishlistId, e.ProductId }).IsUnique();

                entity.HasOne(wi => wi.Wishlist)
                    .WithMany(w => w.WishlistItems)
                    .HasForeignKey(wi => wi.WishlistId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(wi => wi.Product)
                    .WithMany(p => p.WishlistItems)
                    .HasForeignKey(wi => wi.ProductId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Favorite>(entity =>
            {
                entity.HasIndex(e => e.UserId);
                entity.HasIndex(e => new { e.UserId, e.ProductId }).IsUnique();

                entity.HasOne(f => f.User)
                    .WithMany(u => u.Favorites)
                    .HasForeignKey(f => f.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(f => f.Product)
                    .WithMany(p => p.Favorites)
                    .HasForeignKey(f => f.ProductId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<CartItem>(entity =>
            {
                entity.HasIndex(e => e.UserId);
                entity.HasIndex(e => new { e.UserId, e.ProductId }).IsUnique();

                entity.HasCheckConstraint("CK_CartItem_Quantity", "quantity > 0");

                entity.HasOne(ci => ci.User)
                    .WithMany(u => u.CartItems)
                    .HasForeignKey(ci => ci.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(ci => ci.Product)
                    .WithMany(p => p.CartItems)
                    .HasForeignKey(ci => ci.ProductId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasIndex(e => e.UserId);
                entity.HasIndex(e => e.Status);
                entity.HasIndex(e => e.TrackingNumber).IsUnique();

                entity.HasCheckConstraint("CK_Order_Status", "status IN ('В обработке', 'Отправляем', 'В пути', 'В пункте выдачи', 'Доставлен', 'Отменен')");
                entity.HasCheckConstraint("CK_Order_TotalAmount", "total_amount >= 0");

                entity.HasOne(o => o.User)
                    .WithMany(u => u.Orders)
                    .HasForeignKey(o => o.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<OrderItem>(entity =>
            {
                entity.HasIndex(e => e.OrderId);

                entity.HasCheckConstraint("CK_OrderItem_Quantity", "quantity > 0");
                entity.HasCheckConstraint("CK_OrderItem_Price", "price >= 0");
                entity.HasCheckConstraint("CK_OrderItem_Discount", "discount >= 0");

                entity.HasOne(oi => oi.Order)
                    .WithMany(o => o.OrderItems)
                    .HasForeignKey(oi => oi.OrderId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(oi => oi.Product)
                    .WithMany(p => p.OrderItems)
                    .HasForeignKey(oi => oi.ProductId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}