using DAL;
using DAL.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private SignInManager<User> _signInManager;
        private UserManager<User> _userManager;
        private readonly IConfiguration _configuration;
        private MyContext _context;

        public UserController(SignInManager<User> signInManager, UserManager<User> userManager, IConfiguration configuration, MyContext context)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _configuration = configuration;
            _context = context;
        }

        [HttpPost("LogIn")]
        public async Task<ActionResult<UserWithToken>> LoginUser(User_Model user)
        {
            var check = await _signInManager.PasswordSignInAsync(user.Name, user.Password, true, true);
            User temp = null;

            if (!check.Succeeded)
            {
                return NotFound();
            }

            temp = await _userManager.FindByEmailAsync(user.Email);

            UserWithToken userWithToken = new UserWithToken(temp);

            if (temp != null)
            {
                RefreshToken refreshToken = GenerateRefreshToken();

                temp.RefreshTokens.Add(refreshToken);
                await _context.SaveChangesAsync();

                userWithToken = new UserWithToken(temp);
                userWithToken.RefreshToken = refreshToken.Token;
            }

            if (userWithToken == null)
            {
                return NotFound();
            }

            userWithToken.AccessToken = GenerateAccessToken(temp.Id);

            return userWithToken;
        }

        [HttpPost("SignUp")]
        public async Task<ActionResult> Reg(User_Model user)
        {
            var newUser = new User { UserName = user.Name, Email = user.Email };

            var result = await _userManager.CreateAsync(newUser, user.Password);

            if (!result.Succeeded)
            {
                return BadRequest();
            }

            await _userManager.AddToRoleAsync(newUser, "USER");

            return Ok();
        }

        [HttpPost("GetUserByAccessToken")]
        public async Task<ActionResult<User>> GetUserByAccessToken([FromBody] string accessToken)
        {
            User user = await GetUserFromAccessToken(accessToken);

            if (user != null)
            {
                return user;
            }

            return null;
        }

        [HttpPost("GetRole")]
        public async Task<ActionResult<string>> GetRole([FromBody] string email)
        {
            var user = await _userManager.FindByEmailAsync(email);

            var result = await _userManager.GetRolesAsync(user);

            return Ok(result[0]);
        }

        [HttpPost("DeleteRefreshToken")]
        public async Task<ActionResult> DeleteRefreshToken([FromBody] string refreshToken)
        {
            var token = await FindToken(refreshToken);

            if (token != null)
            {
                _context.refreshTokens.Remove(token);
                await _context.SaveChangesAsync();
                return Ok();
            }

            return Ok();
        }

        [HttpGet("users")]
        public async Task<ActionResult<List<User>>> GetAllusers()
        {
            var result = await _userManager.Users.ToListAsync();
            return result;
        }

        [HttpGet("users/{id}")]
        public async Task<ActionResult<List<RefreshToken>>> GetAllUserTokens()
        {
            var result = await _context.refreshTokens.Where(t => t.UserId == HttpContext.GetRouteValue("id").ToString()).ToListAsync();
            return Ok(result);
        }

        private async Task<RefreshToken> FindToken(string token)
        {
            return await _context.refreshTokens.FirstOrDefaultAsync(t => t.Token == token);
        }

        private RefreshToken GenerateRefreshToken()
        {
            RefreshToken refreshToken = new RefreshToken();

            var randomNumber = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);

                var base64String = Convert.ToBase64String(randomNumber);

                var sanitizedToken = base64String.Replace("+", "");

                refreshToken.Token = sanitizedToken;
            }

            refreshToken.ExpiryDate = DateTime.Now.AddHours(1);
            return refreshToken;
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

        private async Task<User> GetUserFromAccessToken(string accessToken)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(_configuration["JwtSecurityKey"]);

                var tokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };

                SecurityToken securityToken;
                var principle = tokenHandler.ValidateToken(accessToken, tokenValidationParameters, out securityToken);

                JwtSecurityToken jwtSecurityToken = securityToken as JwtSecurityToken;

                if (jwtSecurityToken != null && jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                {
                    var userId = principle.FindFirst(ClaimTypes.Name)?.Value;

                    return await _userManager.FindByIdAsync(userId);
                }
            }

            catch (Exception)
            {
                return new User();
            }

            return new User();
        }
    }
}
