using JobPortal.API.Data;
using JobPortal.API.DTOs;
using JobPortal.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace JobPortal.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ApplicationsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ApplicationsController(AppDbContext context)
        {
            _context = context;
        }

        // POST api/applications — Job Seeker applies for a job
        [HttpPost]
        [Authorize(Roles = "JobSeeker")]
        public async Task<IActionResult> Apply(CreateApplicationDTO dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            // Check job exists and is active
            var job = await _context.Jobs
                .FirstOrDefaultAsync(j => j.Id == dto.JobId && j.IsActive);
            if (job == null)
                return NotFound(new { message = "Job not found or no longer active" });

            // Check resume belongs to this user
            var resume = await _context.Resumes
                .FirstOrDefaultAsync(r => r.Id == dto.ResumeId && r.UserId == userId);
            if (resume == null)
                return BadRequest(new { message = "Resume not found" });

            // Check if already applied
            var alreadyApplied = await _context.Applications
                .AnyAsync(a => a.UserId == userId && a.JobId == dto.JobId);
            if (alreadyApplied)
                return BadRequest(new { message = "You have already applied for this job" });

            var application = new Application
            {
                UserId = userId,
                JobId = dto.JobId,
                ResumeId = dto.ResumeId,
                CoverLetter = dto.CoverLetter,
                Status = "Pending"
            };

            _context.Applications.Add(application);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Application submitted successfully", applicationId = application.Id });
        }

        // GET api/applications/my — Job Seeker views their applications
        [HttpGet("my")]
        [Authorize(Roles = "JobSeeker")]
        public async Task<IActionResult> GetMyApplications()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var applications = await _context.Applications
                .Include(a => a.Job).ThenInclude(j => j.Company)
                .Include(a => a.Resume)
                .Include(a => a.User)
                .Where(a => a.UserId == userId)
                .OrderByDescending(a => a.AppliedAt)
                .Select(a => new ApplicationResponseDTO
                {
                    Id = a.Id,
                    Status = a.Status,
                    CoverLetter = a.CoverLetter,
                    AppliedAt = a.AppliedAt,
                    JobId = a.JobId,
                    JobTitle = a.Job.Title,
                    CompanyName = a.Job.Company.Name,
                    JobLocation = a.Job.Location,
                    JobType = a.Job.JobType,
                    UserId = a.UserId,
                    ApplicantName = a.User.FullName,
                    ApplicantEmail = a.User.Email,
                    ApplicantPhone = a.User.Phone,
                    ResumeFileName = a.Resume.FileName
                })
                .ToListAsync();

            return Ok(applications);
        }

        // GET api/applications/job/5 — Employer views applicants for their job
        [HttpGet("job/{jobId}")]
        [Authorize(Roles = "Employer")]
        public async Task<IActionResult> GetJobApplicants(int jobId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            // Verify this job belongs to the employer
            var company = await _context.Companies
                .FirstOrDefaultAsync(c => c.UserId == userId);
            if (company == null)
                return BadRequest(new { message = "Company not found" });

            var job = await _context.Jobs
                .FirstOrDefaultAsync(j => j.Id == jobId && j.CompanyId == company.Id);
            if (job == null)
                return NotFound(new { message = "Job not found or not authorized" });

            var applications = await _context.Applications
                .Include(a => a.User)
                .Include(a => a.Resume)
                .Include(a => a.Job).ThenInclude(j => j.Company)
                .Where(a => a.JobId == jobId)
                .OrderByDescending(a => a.AppliedAt)
                .Select(a => new ApplicationResponseDTO
                {
                    Id = a.Id,
                    Status = a.Status,
                    CoverLetter = a.CoverLetter,
                    AppliedAt = a.AppliedAt,
                    JobId = a.JobId,
                    JobTitle = a.Job.Title,
                    CompanyName = a.Job.Company.Name,
                    JobLocation = a.Job.Location,
                    JobType = a.Job.JobType,
                    UserId = a.UserId,
                    ApplicantName = a.User.FullName,
                    ApplicantEmail = a.User.Email,
                    ApplicantPhone = a.User.Phone,
                    ResumeFileName = a.Resume.FileName
                })
                .ToListAsync();

            return Ok(applications);
        }

        // PUT api/applications/5/status — Employer updates application status
        [HttpPut("{id}/status")]
        [Authorize(Roles = "Employer")]
        public async Task<IActionResult> UpdateStatus(int id, UpdateApplicationStatusDTO dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var validStatuses = new[] { "Pending", "Reviewed", "Shortlisted", "Rejected" };
            if (!validStatuses.Contains(dto.Status))
                return BadRequest(new { message = "Invalid status value" });

            var company = await _context.Companies
                .FirstOrDefaultAsync(c => c.UserId == userId);
            if (company == null)
                return BadRequest(new { message = "Company not found" });

            // Make sure this application belongs to employer's job
            var application = await _context.Applications
                .Include(a => a.Job)
                .FirstOrDefaultAsync(a => a.Id == id && a.Job.CompanyId == company.Id);

            if (application == null)
                return NotFound(new { message = "Application not found or not authorized" });

            application.Status = dto.Status;
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Application status updated to {dto.Status}" });
        }

        // GET api/applications/{id}/resume — Download resume from an application
        [HttpGet("{id}/resume")]
        [Authorize]
        public async Task<IActionResult> DownloadApplicationResume(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var userRole = User.FindFirstValue(ClaimTypes.Role);

            Application? application;

            if (userRole == "JobSeeker")
            {
                // Job seeker can only download their own application's resume
                application = await _context.Applications
                    .Include(a => a.Resume)
                    .Include(a => a.Job).ThenInclude(j => j.Company)
                    .FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);
            }
            else
            {
                // Employer can download resume of applicants to their jobs
                var company = await _context.Companies
                    .FirstOrDefaultAsync(c => c.UserId == userId);

                if (company == null)
                    return BadRequest(new { message = "Company not found" });

                application = await _context.Applications
                    .Include(a => a.Resume)
                    .Include(a => a.Job).ThenInclude(j => j.Company)
                    .FirstOrDefaultAsync(a => a.Id == id && a.Job.CompanyId == company.Id);
            }

            if (application == null)
                return NotFound(new { message = "Application not found or not authorized" });

            var resume = application.Resume;

            // Check file exists on disk
            if (!System.IO.File.Exists(resume.FilePath))
                return NotFound(new { message = "Resume file not found on server" });

            // Return file as PDF download
            var fileBytes = await System.IO.File.ReadAllBytesAsync(resume.FilePath);
            return File(fileBytes, "application/pdf", resume.FileName);
        }
    }
}