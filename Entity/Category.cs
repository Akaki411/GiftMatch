using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GiftMatch.Entity
{
    [Table("categories")]
    public class Category
    {
        [Key]
        [Column("category_id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CategoryId { get; set; }

        [Required]
        [Column("name")]
        [MaxLength(100)]
        public string Name { get; set; } = null!;

        [Column("description")]
        public string? Description { get; set; }

        [Column("parent_category_id")]
        public int? ParentCategoryId { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("ParentCategoryId")]
        public virtual Category? ParentCategory { get; set; }

        public virtual ICollection<Category> SubCategories { get; set; } = new List<Category>();
        public virtual ICollection<ProductCategory> ProductCategories { get; set; } = new List<ProductCategory>();
    }
}