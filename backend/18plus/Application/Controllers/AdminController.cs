using Application.Models.Services;
using Application.ViewModels.Converters;
using Application.ViewModels.CreateDtos;
using Application.ViewModels.PatchDtos;
using Microsoft.AspNetCore.Mvc;

namespace Application.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TeachersController(ITeacherService teacherService) : ControllerBase
{
    [HttpGet("{id}")]
    public async Task<ActionResult<TeacherResponse>> GetOneTeacherAsync([FromRoute] int id)
    {
        return Ok(await teacherService.GetOneTeacherAsync(id));
    }

    [HttpGet]
    public async Task<ActionResult<List<TeacherResponse>>> GetAllTeachersAsync()
    {
        return Ok(await teacherService.GetAllTeachersAsync());
    }

    [HttpPost]
    public async Task<ActionResult<TeacherResponse>> CreateTeacherAsync(
        [FromBody] CreateTeacherDto request)
    {
        var teacher = await teacherService.CreateTeacherAsync(request);
        return CreatedAtAction("GetOneTeacher", new { id = teacher.Id }, teacher);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<TeacherResponse>> UpdateTeacherAsync(
        [FromRoute] int id,
        [FromBody] CreateTeacherDto request)
    {
        return Ok(await teacherService.UpdateTeacherAsync(request, id));
    }

    [HttpPatch("{id}")]
    public async Task<ActionResult<TeacherResponse>> PatchTeacherAsync(
        [FromRoute] int id,
        [FromBody] PatchTeacherDto request)
    {
        return Ok(await teacherService.PatchTeacherAsync(request, id));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTeacherAsync([FromRoute] int id)
    {
        await teacherService.DeleteTeacherAsync(id);
        return NoContent();
    }
}