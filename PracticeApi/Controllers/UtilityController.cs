using Microsoft.AspNetCore.Mvc;

namespace PracticeApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UtilityController : ControllerBase
{
    // GET: api/utility/health
    [HttpGet("health")]
    public ActionResult<object> HealthCheck()
    {
        return Ok(new 
        { 
            status = "healthy", 
            timestamp = DateTime.UtcNow,
            version = "1.0.0"
        });
    }

    // GET: api/utility/time
    [HttpGet("time")]
    public ActionResult<object> GetServerTime()
    {
        return Ok(new 
        { 
            utc = DateTime.UtcNow,
            local = DateTime.Now,
            timezone = TimeZoneInfo.Local.DisplayName
        });
    }

    // POST: api/utility/echo
    [HttpPost("echo")]
    public ActionResult<object> Echo([FromBody] object data)
    {
        return Ok(new 
        { 
            received = data,
            timestamp = DateTime.UtcNow
        });
    }

    // GET: api/utility/random?min=1&max=100
    [HttpGet("random")]
    public ActionResult<object> GetRandomNumber([FromQuery] int min = 1, [FromQuery] int max = 100)
    {
        var random = new Random();
        return Ok(new 
        { 
            min,
            max,
            value = random.Next(min, max + 1)
        });
    }

    // POST: api/utility/calculate
    [HttpPost("calculate")]
    public ActionResult<object> Calculate([FromBody] CalculationRequest request)
    {
        double result = request.Operation.ToLower() switch
        {
            "add" => request.A + request.B,
            "subtract" => request.A - request.B,
            "multiply" => request.A * request.B,
            "divide" => request.B != 0 ? request.A / request.B : double.NaN,
            _ => double.NaN
        };

        return Ok(new 
        { 
            a = request.A,
            b = request.B,
            operation = request.Operation,
            result
        });
    }
}

public class CalculationRequest
{
    public double A { get; set; }
    public double B { get; set; }
    public string Operation { get; set; } = "add";
}
