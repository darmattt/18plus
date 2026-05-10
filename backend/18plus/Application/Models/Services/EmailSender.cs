using System.Net;
using System.Net.Mail;

namespace Application.Models.Services;

public class EmailSender : IEmailSender
{
    public Task SendEmailAsync(string email, string subject, string message)
    {
        var mail = "18plusspengergasse@gmail.com";
        var pw = "xbma qcml zggw blck";
        
        var client = new SmtpClient("smtp.gmail.com", 587)
        {
            EnableSsl = true,
            Credentials = new NetworkCredential(mail, pw)
        };

        return client.SendMailAsync(new MailMessage(mail, email, subject, message));

    }
}   