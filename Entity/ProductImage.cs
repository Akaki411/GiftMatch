using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GiftMatch.Entity
{
    [Table("product_images")]
    public class ProductImage
    {
        [Key]
        [Column("product_image_id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ProductImageId { get; set; }

        [Required]
        [Column("product_id")]
        public int ProductId { get; set; }

        [Required]
        [Column("image_id")]
        public int ImageId { get; set; }

        [Column("is_primary")]
        public bool IsPrimary { get; set; } = false;

        [Column("display_order")]
        public int DisplayOrder { get; set; } = 0;

        // Navigation properties
        [ForeignKey("ProductId")]
        public virtual Product Product { get; set; } = null!;

        [ForeignKey("ImageId")]
        public virtual Image Image { get; set; } = null!;
    }    
}