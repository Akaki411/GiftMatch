using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GiftMatch.Entity
{
    [Table("wishlists")]
    public class Wishlist
    {
        [Key]
        [Column("wishlist_id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int WishlistId { get; set; }

        [Required]
        [Column("user_id")]
        public int UserId { get; set; }

        [Column("name")]
        [MaxLength(100)]
        public string Name { get; set; } = "Мой список желаний";

        [Column("description")]
        public string? Description { get; set; }

        [Column("is_public")]
        public bool IsPublic { get; set; } = false;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("UserId")]
        public virtual User User { get; set; } = null!;

        public virtual ICollection<WishlistItem> WishlistItems { get; set; } = new List<WishlistItem>();
    }
}