using Application.Models.Enitities;
using Application.Models.Enums;
using Application.Models.Users;

namespace Application.Models.Entities;

public class Result : EntityBase
{
    public string AnswersJson { get; protected set; }
    public DateTime? SubmittedAt { get; protected set; }
    public Student Student { get; protected set; }
    public Worksheet Worksheet { get; protected set; }
    public WorkingStatus Status { get; protected set; }

    protected Result() { }

    public Result(string answersJson, Student student, Worksheet worksheet)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(answersJson);
        ArgumentNullException.ThrowIfNull(student);
        ArgumentNullException.ThrowIfNull(worksheet);

        AnswersJson = answersJson.Trim();
        Student = student;
        Worksheet = worksheet;
        Status = WorkingStatus.InProgress;
    }

    public void Submit()
    {
        SubmittedAt = DateTime.UtcNow;
        Status = WorkingStatus.Submitted;
    }

    public void UpdateAnswers(string answersJson)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(answersJson);

        AnswersJson = answersJson.Trim();

        if (Status != WorkingStatus.Submitted)
            Status = WorkingStatus.InProgress;
    }
}