namespace JobPortal.API.Models
{
    public class Resume
    {
        public int Id { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty;
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
        public bool IsDefault { get; set; } = false;

        // Foreign Key
        public int UserId { get; set; }
        public User User { get; set; } = null!;

        // Navigation
        public ICollection<Application> Applications { get; set; } = new List<Application>();
    }
}