using Application.Models.Services;
using Application.ViewModels.Converters;
using Application.ViewModels.LoginDtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Application.Controllers;

[ApiController]
[Route("api/[controller]")]

public class StudentController(IStudentService studentService) : ControllerBase
{
    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<StudentResponse>> StudentLoginAsync([FromBody] LoginStudentDto request)
    {
        var result = await studentService.LoginStudentAsync(request);
        return Ok(result);
    }
}
