using Application.Models.Entities;
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
            firstName: "Michael",
            lastName: "Pühringer",
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
                email: new EMailAddress("MansourKhawari14@gmail.com")
            ),
            new Student(
                firstName: "Darya",
                lastName: "Martysiuk",
                email: new EMailAddress("darmaralk@gmail.com")
            ),
            new Student(
                firstName: "Maryam",
                lastName: "Hukic-Dzavo",
                email: new EMailAddress("HUK231042@spengergasse.at")
            ),
            new Student(
                firstName: "Beshr",
                lastName: "Alkhabour",
                email: new EMailAddress("Beshr.Alkhabour@18plus.local")
            ),
            new Student(
                firstName: "Dana",
                lastName: "Alawad",
                email: new EMailAddress("ala230463@spengergasse.at")
            ),
            new Student(
                firstName: "Michael",
                lastName: "Scofield",
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
            type: "Basiswissen zu Alkohol, Wirkung und Risiken",
            slug: "demo-alkohol-grundlagen"
        );

        var worksheet2 = new Worksheet(
            name: "Suchtprävention",
            type: "Prävention, Warnsignale und Unterstützungsangebote",
            slug: "demo-suchtpraevention"
        );

        var worksheet3 = new Worksheet(
            name: "Recht und Verantwortung",
            type: "Jugendschutz, Verantwortung und rechtliche Grundlagen",
            slug: "demo-recht-und-verantwortung"
        );

        var worksheet4 = new Worksheet(
            name: "Gesundheit und Konsum",
            type: "Langzeitfolgen, Gesundheit und verantwortungsvoller Umgang",
            slug: "demo-gesundheit-und-konsum"
        );

        db.Worksheets.AddRange(worksheet1, worksheet2, worksheet3, worksheet4);

        // =========================================================
        // FRONTEND WORKSHEETS (ws-* slugs, referenced by frontend/src/data/modules.js)
        // =========================================================
        var frontendWorksheets = new List<Worksheet>
        {
            new Worksheet(name: "Wegweiser Einleitung", type: null, slug: "ws-wegweiser-intro"),

            new Worksheet(name: "Arbeitsblatt 1: Fremdbild", type: null, slug: "ws-fremdbild"),
            new Worksheet(name: "Arbeitsblatt 2: Selbstbild", type: null, slug: "ws-selbstbild"),
            new Worksheet(name: "Arbeitsblatt 3/1: Werte-Ziele Allgemein", type: null, slug: "ws-werte-ziele-allgemein"),
            new Worksheet(name: "Arbeitsblatt 3/2: Werte-Ziele Berufsbezogen", type: null, slug: "ws-werte-ziele-berufsbezogen"),
            new Worksheet(name: "Arbeitsblatt 4: Meine Stärken, Werte, Ziele", type: null, slug: "ws-staerken-werte-ziele"),
            new Worksheet(name: "Arbeitsblatt 5: Meinen Interessen auf der Spur", type: null, slug: "ws-interessen-auf-der-spur"),
            new Worksheet(name: "Arbeitsblatt 6: Meine Aktivitäten - nächste Schritte", type: null, slug: "ws-aktivitaeten-naechste-schritte"),
            new Worksheet(name: "Arbeitsblatt 7: Meine Recherche - nächste Schritte", type: null, slug: "ws-recherche-naechste-schritte"),
            new Worksheet(name: "Arbeitsblatt 8: Meine Berufsvorschläge", type: null, slug: "ws-berufsvorschlaege"),
            new Worksheet(name: "Ergebnissicherung", type: null, slug: "ws-ergebnissicherung"),

            new Worksheet(name: "Arbeitsblatt 1: Offene Fragen", type: null, slug: "ws-offene-fragen"),
            new Worksheet(name: "Arbeitsblatt 2: Interview", type: null, slug: "ws-interview"),
            new Worksheet(name: "Arbeitsblatt 3: Checkliste", type: null, slug: "ws-checkliste"),
            new Worksheet(name: "Arbeitsblatt 4: Informationstext", type: null, slug: "ws-text"),
            new Worksheet(name: "Arbeitsblatt 5: Interaktive Kreise", type: null, slug: "ws-kreise"),
            new Worksheet(name: "Arbeitsblatt 6: Berufsvergleich Tabelle", type: null, slug: "ws-tabelle"),
            new Worksheet(name: "Arbeitsblatt 7: Fragen & Tabellen", type: null, slug: "ws-fragen-tabelle"),
            new Worksheet(name: "Arbeitsblatt 8: Kontaktformular", type: null, slug: "ws-kontaktform"),

            new Worksheet(name: "A1: Ein Blick in die Zukunft", type: null, slug: "ws-a1-blick-in-die-zukunft"),
            new Worksheet(name: "A2: Meine persönliche Zukunft", type: null, slug: "ws-a2-persoenliche-zukunft"),
            new Worksheet(name: "A3: Zukunftsbilder – Erwartungen", type: null, slug: "ws-a3-zukunftsbilder-checkliste"),
            new Worksheet(name: "A3: Zukunftsbilder – Anregungen zur Bearbeitung", type: null, slug: "ws-a3-zukunftsbilder-reflexion"),
            new Worksheet(name: "B1: Ihre Berufs- und Studienwahlpartner/in", type: null, slug: "ws-b1-berufs-studienwahlpartner"),
            new Worksheet(name: "B2: Blitzlicht-Interview", type: null, slug: "ws-b2-blitzlicht-interview"),
            new Worksheet(name: "B3: Meine Planungsaktivitäten", type: null, slug: "ws-b3-planungsaktivitaeten"),
            new Worksheet(name: "C1a: Meine Berufshitliste", type: null, slug: "ws-c1a-berufshitliste"),
            new Worksheet(name: "C1b: Meine Studienhitliste", type: null, slug: "ws-c1b-studienhitliste"),
            new Worksheet(name: "C2: Berufe-Interview", type: null, slug: "ws-c2-berufe-interview"),
            new Worksheet(name: "C3: Die wichtigsten Interviewregeln", type: null, slug: "ws-c3-interviewregeln"),
            new Worksheet(name: "C4: Checkliste für Ihre Praxiskontakte", type: null, slug: "ws-c4-praxiskontakte"),
            new Worksheet(name: "D1a: Realitätscheck – Meine Berufshitliste", type: null, slug: "ws-d1a-realitaetscheck-beruf"),
            new Worksheet(name: "D1b: Realitätscheck – Meine Studienhitliste", type: null, slug: "ws-d1b-realitaetscheck-studium"),
            new Worksheet(name: "D2: Checkliste zur Nutzung von Informationsangeboten", type: null, slug: "ws-d2-informationsangebote"),
            new Worksheet(name: "D3: Ihre Entscheidungspartner/innen", type: null, slug: "ws-d3-entscheidungspartner"),
            new Worksheet(name: "E1: Mein Portfolio", type: null, slug: "ws-e1-mein-portfolio"),
            new Worksheet(name: "E2: Vertrag mit mir selbst", type: null, slug: "ws-e2-vertrag-mit-mir-selbst"),
            new Worksheet(name: "E3: Mein Wunschlebenslauf", type: null, slug: "ws-e3-wunschlebenslauf"),
            new Worksheet(name: "E4a: Expert/Innen – Berufe-Interview", type: null, slug: "ws-e4a-experten-interview-beruf"),
            new Worksheet(name: "E4b: Expert/Innen-Interview zu Studium", type: null, slug: "ws-e4b-experten-interview-studium"),
        };

        db.Worksheets.AddRange(frontendWorksheets);

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
        // DEFAULT MODULE ACCESS (Module 1 open by default for every group)
        // =========================================================
        var defaultWorksheets = frontendWorksheets
            .Where(w => DefaultModuleAccess.DefaultEnabledSlugs.Contains(w.Slug))
            .ToList();

        var defaultGroupWorksheets = new List<GroupWorksheet>();
        foreach (var group in new[] { group1, group2, group3 })
        {
            foreach (var worksheet in defaultWorksheets)
            {
                var groupWorksheet = new GroupWorksheet(group, worksheet);
                groupWorksheet.Enable();
                defaultGroupWorksheets.Add(groupWorksheet);
            }
        }

        db.GroupWorksheets.AddRange(defaultGroupWorksheets);

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