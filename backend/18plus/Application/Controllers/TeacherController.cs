using Application.Models.Services;
using Application.Models.ValueObjects;
using Application.ViewModels.AddDtos;
using Application.ViewModels.Converters;
using Application.ViewModels.CreateDtos;
using Application.ViewModels.LoginDtos;
using Application.ViewModels.PatchDtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;

namespace Application.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TeacherController(ITeacherService teacherService, IHostEnvironment environment) : ControllerBase
{
    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<TeacherLoginResponse>> Login([FromBody] LoginAdminDto dto)
    {
        var response = await teacherService.LoginTeacherAsync(dto);

        Response.Cookies.Append("refreshToken", response.refreshToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = !environment.IsDevelopment(),
            SameSite = SameSiteMode.Lax,
            Expires = DateTime.UtcNow.AddDays(7)
        });

        return Ok(new
        {
            accessToken = response.Token,
            firstName = response.FirstName,
            lastName = response.LastName,
            email = response.EmailAddress
        });
    }
    
    [HttpPost("teacher/refresh")]
    public async Task<IActionResult> RefreshTeacherToken()
    {
        var refreshToken = Request.Cookies["refreshToken"];

        var response = await teacherService.RefreshTeacherTokenAsync(refreshToken);

        return Ok(new
        {
            accessToken = response.AccessToken
        });
    }
    
    
    

    [Authorize(Roles = "Teacher")]
    [HttpPost("group")]
    public async Task<ActionResult<TeacherResponse>> CreateGroup([FromBody] CreateGroupDto dto)
    {
        var result = await teacherService.CreateGroupAsync(dto);
        return Ok(result);
    }

    [Authorize(Roles = "Teacher")]
    [HttpPatch("group/{groupId:int}")]
    public async Task<ActionResult<GroupResponse>> PatchGroup(int groupId, [FromBody] PatchGroupDto dto)
    {
        var result = await teacherService.PatchGroupAsync(groupId, dto);
        return Ok(result);
    }

    [Authorize(Roles = "Teacher")]
    [HttpDelete("group/{groupId:int}")]
    public async Task<IActionResult> DeleteGroup(int groupId)
    {
        await teacherService.DeleteGroupAsync(groupId);
        return NoContent();
    }

    [Authorize(Roles = "Teacher")]
    [HttpGet("group/members")]
    public async Task<ActionResult<List<StudentResponse>>> GetMyGroupsMembers()
    {
        var result = await teacherService.GetMyGroupsMembers();
        return Ok(result);
    }

    [Authorize(Roles = "Teacher")]
    [HttpPatch("me")]
    public async Task<ActionResult<TeacherResponse>> PatchMyProfile([FromBody] PatchTeacherDto dto)
    {
        var result = await teacherService.PatchMyProfileAsync(dto);
        return Ok(result);
    }

    [Authorize(Roles = "Teacher")]
    [HttpPost("groups/{groupId:int}/students")]
    public async Task<ActionResult<StudentResponse>> AddStudentToGroup(
        int groupId,
        [FromBody] AddStudentToMyGroupDto dto)
    {
        var result = await teacherService.AddStudentToGroupAsync(groupId, dto);
        return Ok(result);
    }

    [Authorize(Roles = "Teacher")]
    [HttpDelete("group/student/{studentId:int}")]
    public async Task<IActionResult> RemoveStudentFromGroup(int studentId)
    {
        await teacherService.RemoveStudentFromGroupAsync(studentId);
        return NoContent();
    }

    [Authorize(Roles = "Teacher")]
    [HttpGet("results")]
    public async Task<ActionResult<List<ResultResponse>>> GetStudentResults()
    {
        var result = await teacherService.GetStudentResultsAsync();
        return Ok(result);
    }
    
    [Authorize(Roles = "Teacher")]
    [HttpGet("groups")]
    public async Task<ActionResult<List<GroupWithStudentsResponse>>> GetMyGroups()
    {
        var result = await teacherService.GetMyGroupsAsync();
        return Ok(result);
    }

    [Authorize(Roles = "Teacher")]
    [HttpGet("groups/{groupId:int}/enabled-worksheets")]
    public async Task<ActionResult<List<string>>> GetGroupEnabledWorksheets(int groupId)
    {
        var result = await teacherService.GetGroupEnabledWorksheetsAsync(groupId);
        return Ok(result);
    }

    [Authorize(Roles = "Teacher")]
    [HttpPut("groups/{groupId:int}/worksheets")]
    public async Task<ActionResult<List<string>>> SetGroupWorksheets(
        int groupId,
        [FromBody] SetGroupWorksheetsDto dto)
    {
        var result = await teacherService.SetGroupWorksheetsAsync(groupId, dto);
        return Ok(result);
    }
}
