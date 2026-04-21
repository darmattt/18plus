using Application.Models.Services;
using Application.ViewModels.Converters;
using Application.ViewModels.CreateDtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Application.Controllers;

[ApiController]
[Route("api/[controller]")]

public class TeacherController(ITeacherService teacherService) : ControllerBase
{
    [Authorize(Roles = "Teacher")]
    [HttpPost("group")]
    public async Task<ActionResult<TeacherResponse>> CreateGroupAsync([FromBody] CreateGroupDto request)
    {
        var result = await teacherService.CreateGroupAsync(request);
        return Ok(result);
    }


}