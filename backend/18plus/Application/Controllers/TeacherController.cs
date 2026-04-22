using Application.Models.Services;
using Application.ViewModels.Converters;
using Application.ViewModels.CreateDtos;
using Application.ViewModels.LoginDtos;
using Application.ViewModels.PatchDtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Application.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TeacherController(ITeacherService teacherService) : ControllerBase
{
    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<TeacherLoginResponse>> Login([FromBody] LoginAdminDto dto)
    {
        var result = await teacherService.LoginTeacherAsync(dto);
        return Ok(result);
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
    [HttpPost("group/student/{studentId:int}")]
    public async Task<ActionResult<StudentResponse>> AddStudentToGroup(int studentId)
    {
        var result = await teacherService.AddStudentToGroupAsync(studentId);
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
}