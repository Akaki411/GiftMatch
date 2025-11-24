using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GiftMatch.Entity
{
    [Table("favorites")]
    public class Favorite
    {
        [Key]
        [Column("favorite_id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int FavoriteId { get; set; }

        [Required]
        [Column("user_id")]
        public int UserId { get; set; }

        [Required]
        [Column("product_id")]
        public int ProductId { get; set; }

        [Column("added_at")]
        public DateTime AddedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("UserId")]
        public virtual User User { get; set; } = null!;

        [ForeignKey("ProductId")]
        public virtual Product Product { get; set; } = null!;
    }
}