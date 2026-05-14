namespace 
    JobPortal.API.Models
{
    public class Application
    {
        public int Id { get; set; }
        public string Status { get; set; } = "Pending"; // "Pending","Reviewed","Shortlisted","Rejected"
        public string? CoverLetter { get; set; }
        public DateTime AppliedAt { get; set; } = DateTime.UtcNow;

        // Foreign Keys
        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public int JobId { get; set; }
        public Job Job { get; set; } = null!;

        public int ResumeId { get; set; }
        public Resume Resume { get; set; } = null!;
    }
}