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
    public class CompanyController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CompanyController(AppDbContext context)
        {
            _context = context;
        }

        // POST api/company — employer creates company profile
        [HttpPost]
        [Authorize(Roles = "Employer")]
        public async Task<IActionResult> CreateCompany(CreateCompanyDTO dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            // Check if company already exists
            if (await _context.Companies.AnyAsync(c => c.UserId == userId))
                return BadRequest(new { message = "Company profile already exists" });

            var company = new Company
            {
                Name = dto.Name,
                Description = dto.Description,
                Website = dto.Website,
                Location = dto.Location,
                UserId = userId
            };

            _context.Companies.Add(company);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Company created successfully", companyId = company.Id });
        }

        // GET api/company/my — get employer's own company
        [HttpGet("my")]
        [Authorize(Roles = "Employer")]
        public async Task<IActionResult> GetMyCompany()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var company = await _context.Companies
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (company == null)
                return NotFound(new { message = "No company profile found" });

            return Ok(company);
        }
    }
}