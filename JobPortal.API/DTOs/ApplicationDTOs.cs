namespace JobPortal.API.DTOs
{
    public class CreateApplicationDTO
    {
        public int JobId { get; set; }
        public int ResumeId { get; set; }
        public string? CoverLetter { get; set; }
    }

    public class UpdateApplicationStatusDTO
    {
        public string Status { get; set; } = string.Empty;
        // Pending, Reviewed, Shortlisted, Rejected
    }

    public class ApplicationResponseDTO
    {
        public int Id { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? CoverLetter { get; set; }
        public DateTime AppliedAt { get; set; }

        // Job details
        public int JobId { get; set; }
        public string JobTitle { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public string JobLocation { get; set; } = string.Empty;
        public string JobType { get; set; } = string.Empty;

        // Applicant details (for employer view)
        public int UserId { get; set; }
        public string ApplicantName { get; set; } = string.Empty;
        public string ApplicantEmail { get; set; } = string.Empty;
        public string? ApplicantPhone { get; set; }

        // Resume
        public string ResumeFileName { get; set; } = string.Empty;
    }
}