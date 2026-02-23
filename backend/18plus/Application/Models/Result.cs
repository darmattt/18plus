namespace Application.Models;

public class Result : EntityBase
{
    public string AnswersJson { get; set; }
    public DateTime? SubmittedAt { get; set; }
    public Student  Student { get; set; }
    public Worksheet  Worksheet { get; set; }
    public WorkingStatus Status { get; set; }
}