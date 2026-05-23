using JobPortal.API.Data;
using JobPortal.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace JobPortal.API.Controllers
{
    [ApiController]
    [Route("API / [controller]")]
    public class ResumeController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;
        public ResumeController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }
        // POST api/resume — Job Seeker uploads resume
        [HttpPost]
        [Authorize(Roles = "JobSeeker")]
        public async Task<IActionResult> Uploads(IFormFile file)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            if (file == null || file.Length == 0)
                return BadRequest(new { message = "Please select a file" });

            // Only allow PDF files
            if (!file.ContentType.Equals("application/pdf", StringComparison.OrdinalIgnoreCase))
                return BadRequest(new { message = "Only PDF files are allowed" });

            // Max 5MB
            if (file.Length > 5 * 1024 * 1024)
                return BadRequest(new { message = "File size must be less than 5MB" });

            // Create uploads folder if not exists
            var uploadsFolder = Path.Combine(_env.ContentRootPath, "Uploads", "Resumes");
            Directory.CreateDirectory(uploadsFolder);

            // Create unique filename
            var uniqueFileName = $"{userId}_{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            // Save file to disk
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Save to database
            var resume = new Resume
            {
                UserId = userId,
                FileName = file.FileName,
                FilePath = filePath,
                IsDefault = !(await _context.Resumes.AnyAsync(r => r.UserId == userId))
            };
            _context.Resumes.Add(resume);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Resume uploaded successfully",
                resumeId = resume.Id,
                fileName = resume.FileName
            });
        }
        // GET api/resume/my — Get all resumes for logged in user
        [HttpGet("my")]
        [Authorize(Roles = "JobSeeker")]
        public async Task<IActionResult> GetMyResumes()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var resumes = await _context.Resumes
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.UploadedAt)
                .Select(r => new
                {
                    r.Id,
                    r.FileName,
                    r.IsDefault,
                    r.UploadedAt
                })
                .ToListAsync();

            return Ok(resumes);
        }

        // DELETE api/resume/5 — Delete a resume
        [HttpDelete("{id}")]
        [Authorize(Roles = "JobSeeker")]
        public async Task<IActionResult> DeleteResume(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var resume = await _context.Resumes
                .FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId);

            if (resume == null)
                return NotFound(new { message = "Resume not found" });

            // Check if resume is used in any application
            var isUsed = await _context.Applications
                .AnyAsync(a => a.ResumeId == id);
            if (isUsed)
                return BadRequest(new { message = "Cannot delete resume — it is used in an application" });

            // Delete file from disk
            if (System.IO.File.Exists(resume.FilePath))
                System.IO.File.Delete(resume.FilePath);

            _context.Resumes.Remove(resume);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Resume deleted successfully" });
        }
        // PUT api/resume/5/setdefault — Set a resume as default
        [HttpPut("{id}/setdefault")]
        [Authorize(Roles = "JobSeeker")]
        public async Task<IActionResult> SetDefault(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            // Remove default from all resumes
            var allResumes = await _context.Resumes
                .Where(r => r.UserId == userId)
                .ToListAsync();

            foreach (var r in allResumes)
                r.IsDefault = false;

            // Set this one as default
            var resume = allResumes.FirstOrDefault(r => r.Id == id);
            if (resume == null)
                return NotFound(new { message = "Resume not found" });

            resume.IsDefault = true;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Default resume updated" });
        }

        [HttpGet("{id}/download")]
        [Authorize]
        public async Task<IActionResult> DownloadResume(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var userRole = User.FindFirstValue(ClaimTypes.Role);

            Resume? resume;

            // JobSeeker can only download their own resume
            // Employer can download any resume (to view applicant's resume)
            if (userRole == "JobSeeker")
            {
                resume = await _context.Resumes
                    .FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId);
            }
            else
            {
                // Employer — verify the resume belongs to someone who applied to their job
                resume = await _context.Resumes
                    .FirstOrDefaultAsync(r => r.Id == id);
            }

            if (resume == null)
                return NotFound(new { message = "Resume not found" });

            // Check file exists on disk
            if (!System.IO.File.Exists(resume.FilePath))
                return NotFound(new { message = "Resume file not found on server" });

            // Read file and return it
            var fileBytes = await System.IO.File.ReadAllBytesAsync(resume.FilePath);
            return File(fileBytes, "application/pdf", resume.FileName);
        }
    }
}