using DAL;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ValidateTokenController : ControllerBase
    {
        private MyContext _context;
        private readonly IConfiguration _configuration;
        public ValidateTokenController(MyContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("CheckToken")]
        public async Task<ActionResult> CheckRefreshToken([FromBody] string token)
        {
            if (_context.refreshTokens.FirstOrDefault(e => e.Token == token) != null)
            {
                if (_context.refreshTokens.FirstOrDefault(m => m.Token == token).ExpiryDate > DateTime.Now)
                {
                    return Ok();
                }
                else
                {
                    return BadRequest();
                }
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpPost("CheckAndGiveAccessToken")]
        public async Task<ActionResult<string>> CheckAndGiveAccessToken([FromBody] List<string> tokens)
        {
            string token = tokens[0];
            string refresht = tokens[1];
            var refreshToken = _context.refreshTokens.FirstOrDefault(e => e.Token == refresht);

            var tokenHandler = new JwtSecurityTokenHandler();

            var temp = tokenHandler.ReadToken(token) as JwtSecurityToken;

            if (temp.ValidTo < DateTime.Now)
            {
                return BadRequest(GenerateAccessToken(refreshToken.UserId));
            }

            return Ok();
        }

        private string GenerateAccessToken(string userId)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["JwtSecurityKey"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, Convert.ToString(userId))
                }),
                Expires = DateTime.UtcNow.AddSeconds(10),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
