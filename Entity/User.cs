using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GiftMatch.Entity
{
    [Table("users")]
    public class User
    {
        [Key]
        [Column("user_id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UserId { get; set; }

        [Column("first_name")]
        [MaxLength(50)]
        public string? FirstName { get; set; }

        [Column("last_name")]
        [MaxLength(50)]
        public string? LastName { get; set; }

        [Required]
        [Column("email")]
        [MaxLength(100)]
        public string Email { get; set; } = null!;

        [Required]
        [Column("password_hash")]
        [MaxLength(255)]
        public string PasswordHash { get; set; } = null!;

        [Required]
        [Column("role")]
        [MaxLength(10)]
        public string Role { get; set; } = "USER";

        [Column("avatar_image_id")]
        public int? AvatarImageId { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("AvatarImageId")]
        public virtual Image? AvatarImage { get; set; }

        public virtual ICollection<Wishlist> Wishlists { get; set; } = new List<Wishlist>();
        public virtual ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
        public virtual ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
        public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
    }
}