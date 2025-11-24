using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GiftMatch.Entity
{
    [Table("wishlist_items")]
    public class WishlistItem
    {
        [Key]
        [Column("wishlist_item_id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int WishlistItemId { get; set; }

        [Required]
        [Column("wishlist_id")]
        public int WishlistId { get; set; }

        [Required]
        [Column("product_id")]
        public int ProductId { get; set; }

        [Column("priority")]
        public int Priority { get; set; } = 0;

        [Column("notes")]
        public string? Notes { get; set; }

        [Column("added_at")]
        public DateTime AddedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("WishlistId")]
        public virtual Wishlist Wishlist { get; set; } = null!;

        [ForeignKey("ProductId")]
        public virtual Product Product { get; set; } = null!;
    }
}