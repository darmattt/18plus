using Application.Models.Enums;
using Application.Models.Users;

namespace Application.Models.Enitities;

public class Result : EntityBase
{
    public string AnswersJson { get; set; }
    public DateTime? SubmittedAt { get; set; }
    public Student  Student { get; set; }
    public Worksheet  Worksheet { get; set; }
    public WorkingStatus Status { get; set; }
}