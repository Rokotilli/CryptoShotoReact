using BLL.Interfaces;
using DAL.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using webapi.ModelsForReact;

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private UserManager<User> _userManager;
        private readonly IUserLogic _userLogic;

        public UserController(UserManager<User> userManager, IUserLogic userLogic)
        {
            _userManager = userManager;
            _userLogic = userLogic;
        }

        [HttpPost("LogIn")]
        public async Task<ActionResult<UserWithToken>> LoginUser(User_Model user)
        {
            var model = await _userLogic.LoginUser(user);

            if (model == null)
                return NotFound();

            return Ok(model);
        }

        [HttpPost("SignUp")]
        public async Task<ActionResult> Reg(User_Model user)
        {
            var model = await _userLogic.Registration(user);

            if (model == false)
                return BadRequest();

            return Ok(model);
        }

        [HttpGet("GetUserByAccessToken")]
        public async Task<ActionResult<User>> GetUserByAccessToken([FromHeader] string xAuthAccessToken)
        {
            var user = await _userLogic.GetUserFromAccessToken(xAuthAccessToken);

            if (user == null)
                return NotFound();

            return Ok(user);
        }

        [HttpPost("GetRole")]
        public async Task<ActionResult<string>> GetRole([FromBody] string email)
        {
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null)
                return NotFound();

            var result = await _userManager.GetRolesAsync(user);

            return Ok(result[0]);
        }

        [HttpDelete("DeleteRefreshToken")]
        public async Task<ActionResult> DeleteRefreshToken([FromHeader] string xAuthRefreshToken)
        {
            var model = await _userLogic.DeleteRefreshToken(xAuthRefreshToken);

            if (model == false)
                return NotFound();

            return Ok(model);
        }

        [HttpGet("users")]
        public async Task<ActionResult<List<User>>> GetAllusers()
        {
            var result = await _userManager.Users.ToListAsync();

            if (result == null)
                return NotFound();

            return result;
        }

        [HttpGet("usertokens")]
        public async Task<ActionResult<List<RefreshToken>>> GetAllUserTokens([FromQuery] string id)
        {
            var result = await _userLogic._unitOfWork.databaseContext.refreshTokens.Where(t => t.UserId == id).ToListAsync();

            if (result == null)
                return NotFound();

            return Ok(result);
        }

        [HttpPost("ChangeName")]
        public async Task<ActionResult> ChangeName([FromHeader] string xAuthAccessToken, [FromQuery] string name)
        {
            var model = await _userLogic.ChangeName(xAuthAccessToken, name);

            if (!model)
            {
                return BadRequest();
            }

            return Ok();
        }

        [HttpPost("ChangePassword")]
        public async Task<ActionResult> ChangePassword([FromHeader] string xAuthAccessToken, [FromBody] ChangePasswordModel passwords)
        {
            var model = await _userLogic.ChangePassword(xAuthAccessToken, passwords.oldPassword, passwords.newPassword);

            if (model == false)
                return BadRequest();
            
            return Ok();
        }
    }
}
