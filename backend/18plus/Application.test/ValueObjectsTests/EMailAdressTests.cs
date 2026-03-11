namespace Application.test.ValueObjectsTests;
using Xunit;
using Models.ValueObjects;

    public class EMailAddressTests
    {
        [Fact]
        public void Constructor_Should_Create_Object_When_Email_Is_Valid()
        {
            var email = "Annamustermann@gmail.com";

            var result = new EMailAddress(email);

            Assert.Equal(email, result.Value);
        }

        [Fact]
        public void Constructor_Should_Trim_Email()
        {
            var result = new EMailAddress("  test@gmail.com  ");

            Assert.Equal("test@gmail.com", result.Value);
        }

        [Fact]
        public void Constructor_Should_Throw_ArgumentNullException_When_Email_Is_Null()
        {
            Assert.Throws<ArgumentNullException>(() => new EMailAddress(null!));
        }
        
        [Theory]
        [InlineData("")]
        [InlineData(" ")]
        [InlineData("     ")]
        public void Constructor_Should_Throw_ArgumentException_When_Email_Is_Null_Or_Whitespace(string input)
        {
            //! sorgt dafür, dass input null sein darf.
            Assert.Throws<ArgumentException>(() => new EMailAddress(input));
        }

        [Theory]
        [InlineData("Anna Mustermann")] // kein @
        [InlineData("plainaddress")] // kein @
        [InlineData("missingatsign.com")] // kein @
        [InlineData("@domain.com")] // kein local part
        [InlineData("test@")] // keine domain
        [InlineData("test@domain")] // kein Punkt in Domain (TopLevelDomains = false)
        [InlineData("test@@domain.com")] // doppeltes @
        public void Constructor_Should_Throw_ArgumentException_When_Email_Format_Is_Invalid(string input)
        {
            Assert.Throws<ArgumentException>(() => new EMailAddress(input));
        }

        [Theory]
        [InlineData("user@localhost")]
        [InlineData("user@com")]
        [InlineData("postmaster@dk")]
        public void Constructor_Should_Reject_Single_Label_Domains(string input)
        {
            Assert.Throws<ArgumentException>(() => new EMailAddress(input));
        }

        [Theory]
        [InlineData("müller@büro.de")]
        [InlineData("用户@例子.公司")]
        public void Constructor_Should_Reject_International_Emails_When_Not_Allowed(string input)
        {
            Assert.Throws<ArgumentException>(() => new EMailAddress(input));
        }

        [Fact]
        public void Two_Objects_With_Same_Email_Should_Be_Equal()
        {
            var a = new EMailAddress("test@gmail.com");
            var b = new EMailAddress("test@gmail.com");

            Assert.Equal(a, b);
            Assert.True(a == b);
            Assert.Equal(a.GetHashCode(), b.GetHashCode());
        }

        [Fact]
        public void Two_Objects_With_Different_Emails_Should_Not_Be_Equal()
        {
            var a = new EMailAddress("a@gmail.com");
            var b = new EMailAddress("b@gmail.com");

            Assert.NotEqual(a, b);
            Assert.True(a != b);
        }

        [Fact]
        public void ToString_Should_Return_Email()
        {
            var email = new EMailAddress("test@gmail.com");

            Assert.Equal("test@gmail.com", email.ToString());
        }

    }
