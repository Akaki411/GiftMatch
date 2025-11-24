using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GiftMatch.Entity
{
    [Table("orders")]
    public class Order
    {
        [Key]
        [Column("order_id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int OrderId { get; set; }

        [Required]
        [Column("user_id")]
        public int UserId { get; set; }

        [Required]
        [Column("status")]
        [MaxLength(20)]
        public string Status { get; set; } = "В обработке";

        [Column("tracking_number")]
        [MaxLength(100)]
        public string? TrackingNumber { get; set; }

        [Required]
        [Column("total_amount", TypeName = "numeric(10,2)")]
        [Range(0, double.MaxValue)]
        public decimal TotalAmount { get; set; }

        [Required]
        [Column("delivery_address")]
        [MaxLength(255)]
        public string DeliveryAddress { get; set; } = null!;

        [Column("phone")]
        [MaxLength(20)]
        public string? Phone { get; set; }

        [Column("notes")]
        public string? Notes { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("UserId")]
        public virtual User User { get; set; } = null!;

        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}