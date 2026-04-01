using Application.Models.Services;
using Application.Models.Users;
using Application.ViewModels.CreateDtos;
using Application.ViewModels.PatchDtos;
using Microsoft.AspNetCore.Mvc;

namespace Application.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TeachersController(
    ITeacherService ts) : ControllerBase
{
    [HttpGet("{id}")]
    public async Task<ActionResult<Teacher>> GetTeacherById([FromRoute] int id)
    {
        var teacher = await ts.GetOneTeacherAsync(id);
        return Ok(teacher);
    }

    [HttpGet]
    public async Task<ActionResult<List<Teacher>>> GetAllTeachers()
    {
        var teachers = await ts.GetAllTeachersAsync();
        return Ok(teachers);
    }

    [HttpPost]
    public async Task<ActionResult<Teacher>> CreateNewTeacher([FromBody] CreateTeacherDto request)
    {
        var newTeacher = await ts.CreateTeacherAsync(request);
        return CreatedAtAction(nameof(GetTeacherById), new { id = newTeacher.Id }, newTeacher);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteTeacher([FromRoute] int id)
    {
        await ts.DeleteTeacherAsync(id);
        return NoContent();
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Teacher>> UpdateTeacherAsync(
        [FromBody] CreateTeacherDto request,
        [FromRoute] int id)
    {
        var updatedTeacher = await ts.UpdateTeacherAsync(request, id);
        return Ok(updatedTeacher);
    }

    [HttpPatch("{id}")]
    public async Task<ActionResult<Teacher>> PatchTeacherAsync(
        [FromBody] PatchTeacherDto request,
        [FromRoute] int id)
    {
        var patchedTeacher = await ts.PatchTeacherAsync(request, id);
        return Ok(patchedTeacher);
    }
}