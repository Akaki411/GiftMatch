using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GiftMatch.Entity
{
    [Table("order_items")]
    public class OrderItem
    {
        [Key]
        [Column("order_item_id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int OrderItemId { get; set; }

        [Required]
        [Column("order_id")]
        public int OrderId { get; set; }

        [Required]
        [Column("product_id")]
        public int ProductId { get; set; }

        [Required]
        [Column("quantity")]
        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }

        [Required]
        [Column("price", TypeName = "numeric(10,2)")]
        [Range(0, double.MaxValue)]
        public decimal Price { get; set; }

        [Column("discount", TypeName = "numeric(10,2)")]
        [Range(0, double.MaxValue)]
        public decimal Discount { get; set; } = 0;

        // Navigation properties
        [ForeignKey("OrderId")]
        public virtual Order Order { get; set; } = null!;

        [ForeignKey("ProductId")]
        public virtual Product Product { get; set; } = null!;
    }
}