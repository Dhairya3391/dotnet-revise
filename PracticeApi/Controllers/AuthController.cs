using Microsoft.AspNetCore.Mvc;
using PracticeApi.Models;

namespace PracticeApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    // Simple hardcoded users for practice
    private static readonly List<(string Username, string Password, User User)> _users = new()
    {
        ("admin", "admin123", new User { Id = 1, Username = "admin", Email = "admin@example.com" }),
        ("user", "user123", new User { Id = 2, Username = "user", Email = "user@example.com" }),
        ("demo", "demo", new User { Id = 3, Username = "demo", Email = "demo@example.com" })
    };

    // POST: api/auth/login
    [HttpPost("login")]
    public ActionResult<LoginResponse> Login([FromBody] LoginRequest request)
    {
        var user = _users.FirstOrDefault(u => 
            u.Username == request.Username && u.Password == request.Password);

        if (user.User == null)
        {
            return Unauthorized(new LoginResponse 
            { 
                Success = false, 
                Message = "Invalid username or password" 
            });
        }

        return Ok(new LoginResponse 
        { 
            Success = true, 
            Message = "Login successful",
            User = user.User 
        });
    }

    // POST: api/auth/register (simulated)
    [HttpPost("register")]
    public ActionResult<LoginResponse> Register([FromBody] LoginRequest request)
    {
        // Check if username exists
        if (_users.Any(u => u.Username == request.Username))
        {
            return BadRequest(new LoginResponse 
            { 
                Success = false, 
                Message = "Username already exists" 
            });
        }

        var newUser = new User 
        { 
            Id = _users.Count + 1, 
            Username = request.Username, 
            Email = $"{request.Username}@example.com" 
        };

        return Ok(new LoginResponse 
        { 
            Success = true, 
            Message = "Registration successful",
            User = newUser 
        });
    }
}
