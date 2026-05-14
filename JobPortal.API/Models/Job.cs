using static System.Net.Mime.MediaTypeNames;

namespace JobPortal.API.Models
{
    public class Job
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string JobType { get; set; } = string.Empty; // "Full-Time","Part-Time","Remote","Internship"
        public string ExperienceLevel { get; set; } = string.Empty; // "Entry","Mid","Senior"
        public decimal? SalaryMin { get; set; }
        public decimal? SalaryMax { get; set; }
        public string? SkillsRequired { get; set; } // comma separated e.g. "C#, React, SQL"
        public DateTime Deadline { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Foreign Key
        public int CompanyId { get; set; }
        public Company Company { get; set; } = null!;

        // Navigation
        public ICollection<Application> Applications { get; set; } = new List<Application>();
    }
}