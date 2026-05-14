namespace JobPortal.API.Models
{
    public class User
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty; // "JobSeeker" or "Employer"
        public string? Phone { get; set; }
        public string? ProfilePicture { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsActive { get; set; } = true;

        // Navigation
        public Company? Company { get; set; }
        public ICollection<Application> Applications { get; set; } = new List<Application>();
        public ICollection<Resume> Resumes { get; set; } = new List<Resume>();
    }
}