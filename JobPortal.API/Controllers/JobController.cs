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
    public class JobsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public JobsController(AppDbContext context)
        {
            _context = context;
        }

        // GET api/jobs — get all active jobs (public)
        [HttpGet]
        public async Task<IActionResult> GetAllJobs()
        {
            var jobs = await _context.Jobs
                .Include(j => j.Company)
                .Where(j => j.IsActive)
                .OrderByDescending(j => j.CreatedAt)
                .Select(j => new JobResponseDTO
                {
                    Id = j.Id,
                    Title = j.Title,
                    Description = j.Description,
                    Location = j.Location,
                    JobType = j.JobType,
                    ExperienceLevel = j.ExperienceLevel,
                    SalaryMin = j.SalaryMin,
                    SalaryMax = j.SalaryMax,
                    SkillsRequired = j.SkillsRequired,
                    Deadline = j.Deadline,
                    IsActive = j.IsActive,
                    CreatedAt = j.CreatedAt,
                    CompanyName = j.Company.Name,
                    CompanyLocation = j.Company.Location ?? "",
                    CompanyId = j.Company.Id
                })
                .ToListAsync();

            return Ok(jobs);
        }

        // GET api/jobs/5 — get single job (public)
        [HttpGet("{id}")]
        public async Task<IActionResult> GetJob(int id)
        {
            var job = await _context.Jobs
                .Include(j => j.Company)
                .Where(j => j.Id == id)
                .Select(j => new JobResponseDTO
                {
                    Id = j.Id,
                    Title = j.Title,
                    Description = j.Description,
                    Location = j.Location,
                    JobType = j.JobType,
                    ExperienceLevel = j.ExperienceLevel,
                    SalaryMin = j.SalaryMin,
                    SalaryMax = j.SalaryMax,
                    SkillsRequired = j.SkillsRequired,
                    Deadline = j.Deadline,
                    IsActive = j.IsActive,
                    CreatedAt = j.CreatedAt,
                    CompanyName = j.Company.Name,
                    CompanyLocation = j.Company.Location ?? "",
                    CompanyId = j.Company.Id
                })
                .FirstOrDefaultAsync();

            if (job == null)
                return NotFound(new { message = "Job not found" });

            return Ok(job);
        }

        // POST api/jobs — employer posts a job (auth required)
        [HttpPost]
        [Authorize(Roles = "Employer")]
        public async Task<IActionResult> CreateJob(CreateJobDTO dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            // Get employer's company
            var company = await _context.Companies
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (company == null)
                return BadRequest(new { message = "Please create a company profile first" });

            var job = new Job
            {
                Title = dto.Title,
                Description = dto.Description,
                Location = dto.Location,
                JobType = dto.JobType,
                ExperienceLevel = dto.ExperienceLevel,
                SalaryMin = dto.SalaryMin,
                SalaryMax = dto.SalaryMax,
                SkillsRequired = dto.SkillsRequired,
                Deadline = dto.Deadline,
                CompanyId = company.Id
            };

            _context.Jobs.Add(job);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Job posted successfully", jobId = job.Id });
        }

        // PUT api/jobs/5 — employer updates job (auth required)
        [HttpPut("{id}")]
        [Authorize(Roles = "Employer")]
        public async Task<IActionResult> UpdateJob(int id, UpdateJobDTO dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var company = await _context.Companies
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (company == null)
                return BadRequest(new { message = "Company not found" });

            var job = await _context.Jobs
                .FirstOrDefaultAsync(j => j.Id == id && j.CompanyId == company.Id);

            if (job == null)
                return NotFound(new { message = "Job not found or not authorized" });

            job.Title = dto.Title;
            job.Description = dto.Description;
            job.Location = dto.Location;
            job.JobType = dto.JobType;
            job.ExperienceLevel = dto.ExperienceLevel;
            job.SalaryMin = dto.SalaryMin;
            job.SalaryMax = dto.SalaryMax;
            job.SkillsRequired = dto.SkillsRequired;
            job.Deadline = dto.Deadline;
            job.IsActive = dto.IsActive;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Job updated successfully" });
        }

        // DELETE api/jobs/5 — employer deletes job (auth required)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Employer")]
        public async Task<IActionResult> DeleteJob(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var company = await _context.Companies
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (company == null)
                return BadRequest(new { message = "Company not found" });

            var job = await _context.Jobs
                .FirstOrDefaultAsync(j => j.Id == id && j.CompanyId == company.Id);

            if (job == null)
                return NotFound(new { message = "Job not found or not authorized" });

            _context.Jobs.Remove(job);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Job deleted successfully" });
        }
    }
}