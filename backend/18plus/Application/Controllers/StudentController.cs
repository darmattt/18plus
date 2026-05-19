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
}
