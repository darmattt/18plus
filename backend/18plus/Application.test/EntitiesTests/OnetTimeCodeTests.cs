// using Application.Models.Enitities;
// using Application.Models.Users;
// using Application.Models.ValueObjects;
// using Xunit;
//
// namespace Application.test.EntitiesTests;
//
// public class OneTimeCodeTests
// {
//     [Fact]
//     public void Constructor_Should_Create_Object_When_Student_Is_Valid()
//     {
//         var student = CreateStudent();
//
//         var code = new OneTimeCode(student, "123456");
//
//         Assert.NotNull(code);
//         Assert.Equal(student, code.Student);
//         Assert.False(code.IsUsed);
//         Assert.NotNull(code.CodeHash);
//     }
//
//     [Fact]
//     public void Constructor_Should_Set_Expiration_Time_In_Future()
//     {
//         var student = CreateStudent();
//
//         var code = new OneTimeCode(student, "123456");
//
//         Assert.True(code.ExpiresAt > DateTime.UtcNow);
//     }
//
//     [Fact]
//     public void Constructor_Should_Throw_Exception_When_Student_Is_Null()
//     {
//         Assert.Throws<ArgumentNullException>(() =>
//             new OneTimeCode(null!, "123456"));
//     }
//
//     [Fact]
//     public void Constructor_Should_Throw_Exception_When_Code_Is_Empty()
//     {
//         var student = CreateStudent();
//
//         Assert.Throws<ArgumentException>(() =>
//             new OneTimeCode(student, ""));
//     }
//
//     [Fact]
//     public void MarkAsUsed_Should_Set_IsUsed_To_True()
//     {
//         var student = CreateStudent();
//         var code = new OneTimeCode(student, "123456");
//
//         code.MarkAsUsed();
//
//         Assert.True(code.IsUsed);
//         Assert.NotNull(code.UsedAt);
//     }
//
//     [Fact]
//     public void MarkAsUsed_Should_Throw_Exception_When_Code_Already_Used()
//     {
//         var student = CreateStudent();
//         var code = new OneTimeCode(student, "123456");
//
//         code.MarkAsUsed();
//
//         Assert.Throws<InvalidOperationException>(() =>
//             code.MarkAsUsed());
//     }
//
//     [Fact]
//     public void VerifyCode_Should_Return_True_When_Code_Is_Correct()
//     {
//         var student = CreateStudent();
//         var code = new OneTimeCode(student, "123456");
//
//         var result = code.VerifyCode("123456");
//
//         Assert.True(result);
//     }
//
//     [Fact]
//     public void VerifyCode_Should_Return_False_When_Code_Is_Wrong()
//     {
//         var student = CreateStudent();
//         var code = new OneTimeCode(student, "123456");
//
//         var result = code.VerifyCode("654321");
//
//         Assert.False(result);
//     }
//
//     private static Student CreateStudent()
//     {
//         return new Student(
//             "Max",
//             "Mustermann",
//             new EMailAddress("student@test.at")
//         );
//     }
// }