using Application.Models.Services;
using Application.ViewModels.Converters;
using Application.ViewModels.CreateDtos;
using Application.ViewModels.LoginDtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Application.Controllers;

[ApiController]
[Route("api/[controller]")]

public class StudentController(IStudentService studentService) : ControllerBase
{
    [Authorize(Roles = "Student")]
    [HttpGet("me")]
    public async Task<ActionResult<StudentProfileResponse>> GetStudentProfileAsync()
    {
        var result = await studentService.GetCurrentStudentProfileAsync();
        return Ok(result);
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<ActionResult<RegisterStudentResponse>> RegisterAsync([FromBody] RegisterStudentDto request)
    {
        var result = await studentService.RegisterAsync(request);
        return Ok(result);
    }

    [AllowAnonymous]
    [HttpPost("login/request-code")]
    public async Task<ActionResult<StudentLoginResponse>> RequestLoginCodeAsync([FromBody] RequestStudentLoginCodeDto request)
    {
        var result = await studentService.RequestLoginCodeAsync(request);
        return Ok(result);
    }

    [AllowAnonymous]
    [HttpPost("login/verify-code")]
    public async Task<ActionResult<StudentLoginResponse>> VerifyLoginCodeAsync([FromBody] LoginStudentDto request)
    {
        var result = await studentService.VerifyLoginCodeAsync(request);
        return Ok(result);
    }

    [Authorize(Roles = "Student")]
    [HttpGet("enabled-worksheets")]
    public async Task<ActionResult<List<string>>> GetMyEnabledWorksheetsAsync()
    {
        var result = await studentService.GetMyEnabledWorksheetsAsync();
        return Ok(result);
    }

    [Authorize(Roles = "Student")]
    [HttpGet("results")]
    public async Task<ActionResult<List<StudentResultSummaryResponse>>> GetMyResultsAsync()
    {
        var results = await studentService.GetMyResultsAsync();
        return Ok(results);
    }

    [Authorize(Roles = "Student")]
    [HttpGet("results/{slug}")]
    public async Task<ActionResult<StudentResultResponse>> GetMyResultAsync(string slug)
    {
        var result = await studentService.GetMyResultAsync(slug);
        return Ok(result);
    }

    [Authorize(Roles = "Student")]
    [HttpPut("results/{slug}")]
    public async Task<ActionResult<StudentResultResponse>> SaveMyResultAsync(string slug, [FromBody] SaveResultDto request)
    {
        var result = await studentService.SaveMyResultAsync(slug, request);
        return Ok(result);
    }
}
