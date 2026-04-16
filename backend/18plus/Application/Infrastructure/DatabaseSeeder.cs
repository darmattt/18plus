using Application.Models.Enitities;
using Application.Models.Enums;
using Application.Models.Services;
using Application.Models.Users;
using Application.Models.ValueObjects;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Application.Infrastructure;

public static class DatabaseSeeder
{
    public static void Seed(EighteenplusDbContext db,
        PasswordHasher<UserBase> passwordHasher,
        IPasswordService passwordService
        )
    {
        db.Database.Migrate();

        if (db.Users.Any())
            return;

        var now = DateTime.UtcNow;

        // =========================================================
        // ADMIN
        // =========================================================
        var admin = new Admin(
            firstName: "System",
            lastName: "Administrator",
            email: new EMailAddress("admin@18plus.local"),
            passwordHash: passwordService.Hash("Hashed-Admin-Password")
            );

        db.Admins.Add(admin);

        // =========================================================
        // TEACHERS
        // =========================================================
        var teacher1 = new Teacher(
            firstName: "Johannes",
            lastName: "Eder",
            email: new EMailAddress("eder.johannes@18plus.local"),
            passwordHash: passwordService.Hash("Hashed-Teacher2-Password"),
            phoneNumber: new PhoneNumber("+436601234567")
        );
        

        var teacher2 = new Teacher(
            firstName: "Pühringer",
            lastName: "Michael",
            email: new EMailAddress("puehringer.Michael@18plus.local"),
            passwordHash: passwordService.Hash("Hashed-Teacher3-Password"),
            phoneNumber: new PhoneNumber("+436609876543")
        );

        db.Teachers.AddRange(teacher1, teacher2);

        // =========================================================
        // GROUPS
        // =========================================================
        var group1 = new Group(
            name: new ClassNumber("1AHITM"),
            teacher: teacher1
        );

        var group2 = new Group(
            name: new ClassNumber("2BHITM"),
            teacher: teacher1
        );

        var group3 = new Group(
            name: new ClassNumber("3CHIF"),
            teacher: teacher2
        );

        db.Groups.AddRange(group1, group2, group3);

        // =========================================================
        // STUDENTS
        // =========================================================
        var students = new List<Student>
        {
            new Student(
                firstName: "Mansour",
                lastName: "Khawari",
                email: new EMailAddress("Mansour.Khawari@18plus.local")
            ),
            new Student(
                firstName: "Darya",
                lastName: "Martysiuk",
                email: new EMailAddress("Darya.Martysiuk@18plus.local")
            ),
            new Student(
                firstName: "Maryam",
                lastName: "Hukic-Dzavo",
                email: new EMailAddress("Maryam.Hukic@18plus.local")
            ),
            new Student(
                firstName: "Beshr",
                lastName: "Alkhabour",
                email: new EMailAddress("Beshr.Alkhabour@18plus.local")
            ),
            new Student(
                firstName: "Dana",
                lastName: "Alawad",
                email: new EMailAddress("Dana.Alawad@18plus.local")
            ),
            new Student(
                firstName: "Michael",
                lastName: "Scottfield",
                email: new EMailAddress("Michael.Scottfield@18plus.local")
            ),
            new Student(
                firstName: "Eren",
                lastName: "Jäger",
                email: new EMailAddress("Eren.Jaeger@18plus.local")
            ),
            new Student(
                firstName: "Paul",
                lastName: "Gruber",
                email: new EMailAddress("paul.gruber@18plus.local")
            ),
            new Student(
                firstName: "Lea",
                lastName: "Koch",
                email: new EMailAddress("lea.koch@18plus.local")
            )
        };

        db.Students.AddRange(students);

        // =========================================================
        // WORKSHEETS
        // =========================================================
        var worksheet1 = new Worksheet(
            name: "Alkohol Grundlagen",
            description: "Basiswissen zu Alkohol, Wirkung und Risiken"
        );

        var worksheet2 = new Worksheet(
            name: "Suchtprävention",
            description: "Prävention, Warnsignale und Unterstützungsangebote"
        );

        var worksheet3 = new Worksheet(
            name: "Recht und Verantwortung",
            description: "Jugendschutz, Verantwortung und rechtliche Grundlagen"
        );

        var worksheet4 = new Worksheet(
            name: "Gesundheit und Konsum",
            description: "Langzeitfolgen, Gesundheit und verantwortungsvoller Umgang"
        );

        db.Worksheets.AddRange(worksheet1, worksheet2, worksheet3, worksheet4);

        // =========================================================
        // GROUP WORKSHEETS
        // =========================================================
        var groupWorksheets = new List<GroupWorksheet>
        {
            new GroupWorksheet(
                group: group1,
                worksheet: worksheet1
            ),
            new GroupWorksheet(
                group: group1,
                worksheet: worksheet2
            ),
            new GroupWorksheet(
                group: group1,
                worksheet: worksheet3
            ),

            new GroupWorksheet(
                group: group2,
                worksheet: worksheet1
            ),
            new GroupWorksheet(
                group: group2,
                worksheet: worksheet3
            ),
            new GroupWorksheet(
                group: group2,
                worksheet: worksheet4
            ),

            new GroupWorksheet(
                group: group3,
                worksheet: worksheet2
            ),
            new GroupWorksheet(
                group: group3,
                worksheet: worksheet4
            )
        };

        db.GroupWorksheets.AddRange(groupWorksheets);

        // =========================================================
        // RESULTS
        // =========================================================
        var results = new List<Result>
        {
            new Result(
                answersJson: """{"q1":"a","q2":"b","q3":"c"}""",
                student: students[0],
                worksheet: worksheet1
            ),
            new Result(
                answersJson: """{"q1":"b","q2":"a","q3":"d"}""",
                student: students[1],
                worksheet: worksheet1
            ),
            new Result(
                answersJson: """{"q1":"c","q2":"c","q3":"a"}""",
                student: students[2],
                worksheet: worksheet2
            ),
            new Result(
                answersJson: """{"q1":"a"}""",
                student: students[3],
                worksheet: worksheet3
            ),
            new Result(
                answersJson: """{"q1":"d","q2":"b"}""",
                student: students[4],
                worksheet: worksheet1
            ),
            new Result(
                answersJson: """{"q1":"a","q2":"a","q3":"b","q4":"c"}""",
                student: students[6],
                worksheet: worksheet2
            ),
            new Result(
                answersJson: """{"q1":"b","q2":"d"}""",
                student: students[7],
                worksheet: worksheet4
            ),
            new Result(
                answersJson: """{"q1":"x"}""",
                student: students[8],
                worksheet: worksheet4
            )
        };

        db.Results.AddRange(results);

        // =========================================================
        // ONE TIME CODES
        // =========================================================
        var codes = new List<OneTimeCode>
        {
            new OneTimeCode(students[0],"111111"),
            new OneTimeCode(students[1],"222222"),
            new OneTimeCode(students[2],"333333"),
            new OneTimeCode(students[3],"444444")
        };

        db.OneTimeCodes.AddRange(codes);

        db.OneTimeCodes.AddRange(codes);

        db.SaveChanges();
    }
}