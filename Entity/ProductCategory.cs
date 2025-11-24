using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GiftMatch.Entity
{
    [Table("product_categories")]
    public class ProductCategory
    {
        [Required]
        [Column("product_id")]
        public int ProductId { get; set; }

        [Required]
        [Column("category_id")]
        public int CategoryId { get; set; }

        [ForeignKey("ProductId")]
        public virtual Product Product { get; set; } = null!;

        [ForeignKey("CategoryId")]
        public virtual Category Category { get; set; } = null!;
    }
}