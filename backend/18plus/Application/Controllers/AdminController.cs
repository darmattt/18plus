using Application.Models.Services;
using Application.ViewModels.Converters;
using Application.ViewModels.CreateDtos;
using Application.ViewModels.PatchDtos;
using Microsoft.AspNetCore.Mvc;

namespace Application.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AdminController(IAdminService adminService) : ControllerBase
{
    [HttpGet("teacher/{id}")]
    public async Task<ActionResult<TeacherResponse>> GetTeacherByIdAsync([FromRoute] int id)
    {
        return Ok(await adminService.GetTeacherByIdAsync(id));
    }

    [HttpGet("teacher/search/{lastname}")]
    public async Task<ActionResult<List<TeacherResponse>>> SearchTeachersByLastnameAsync([FromRoute] string lastname)
    {
        return Ok(await adminService.SearchTeachersByNameAsync(lastname));
    }
    
    [HttpGet("teacher")]
    public async Task<ActionResult<List<TeacherResponse>>> GetAllTeachersAsync()
    {
        return Ok(await adminService.GetAllTeachersAsync());
    }
    [HttpPost("teacher")]
    public async Task<ActionResult<TeacherResponse>> CreateTeacherAsync([FromBody] CreateTeacherDto request)
    {
        var teacher = await adminService.CreateTeacherAsync(request);

        return CreatedAtAction(
            "GetTeacherById",
            new { id = teacher.Id },
            teacher
        );
    }
    
    [HttpDelete("teacher/{id}")]
    public async Task<IActionResult> DeleteTeacherAsync([FromRoute] int id)
    {
        await adminService.DeleteTeacherAsync(id);
        return NoContent();
    }

    [HttpPatch("teacher/{id}")]
    public async Task<ActionResult<TeacherResponse>> PatchTeacherAsync(
        [FromRoute] int id,
        [FromBody] PatchTeacherDto request)
    {
        return Ok(await adminService.PatchTeacherAsync(request, id));
    }

    [HttpGet("group/{groupName}")]
    public async Task<ActionResult<List<TeacherResponse>>> GetGroupByNameAsync([FromRoute] string groupName)
    {
        return Ok(await adminService.GetGroupByNameAsync(groupName));
    }
    
    [HttpPost("group/{id}")]
    public async Task<ActionResult<TeacherResponse>> CreateGroupAsync([FromBody] CreateGroupDto request,[FromRoute] int id)
    {
        var group = await adminService.CreateGroupAsync(id, request);

        return CreatedAtAction("GetGroupByName", new { id = group.Id }, group);
    }


    //
    // [HttpGet("student")]
    // public async Task<ActionResult<List<StudentResponse>>> GetAllStudentsAsync()
    // {
    //     return Ok(await adminService.GetAllStudentsAsync());
    // }
    //
    // [HttpGet("student/{id}")]
    // public async Task<ActionResult<StudentResponse>> GetOneStudentAsync([FromRoute] int id)
    // {
    //     return Ok(await adminService.GetOneStudentAsync(id));
    // }
    //
    // [HttpPost("student")]
    // public async Task<ActionResult<StudentResponse>> CreateStudentAsync(
    //     [FromBody] CreateStudentDto request)
    // {
    //     var student = await adminService.CreateStudentAsync(request);
    //     return CreatedAtAction(nameof(GetOneStudentAsync), new { id = student.id }, student);
    // }
    //
    // [HttpPut("student/{id}")]
    // public async Task<ActionResult<StudentResponse>> UpdateStudentAsync(
    //     [FromRoute] int id,
    //     [FromBody] CreateStudentDto request)
    // {
    //     return Ok(await adminService.UpdateStudentAsync(request, id));
    // }
    //
    // [HttpPatch("student/{id}")]
    // public async Task<ActionResult<StudentResponse>> PatchStudentAsync(
    //     [FromRoute] int id,
    //     [FromBody] PatchStudentDto request)
    // {
    //     return Ok(await adminService.PatchStudentAsync(request, id));
    // }
    //
    // [HttpDelete("student/{id}")]
    // public async Task<IActionResult> DeleteStudentAsync([FromRoute] int id)
    // {
    //     await adminService.DeleteStudentAsync(id);
    //     return NoContent();
    // }
    //
    // //kurse anlegen + verwalten 
    // //worksheet anlegen + verwalten
    // //
    //
}