using BLL.Interfaces;
using DAL.Models;
using DAL.Repositories.Pagination;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using webapi.ModelsForReact;

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostController : ControllerBase
    {
        public readonly IPostLogic _PostLogic;

        public PostController(IPostLogic PostLogic)
        {
            _PostLogic = PostLogic;
        }


        [HttpGet("GetUserPosts")]
        public async Task<ActionResult<List<Post>>> GetUserPosts([FromHeader] string xAuthAccessToken, [FromQuery] QueryStringParameters queryStringParameters)
        {
            var result = await _PostLogic.GetAllUserPosts(xAuthAccessToken, queryStringParameters);

            if (result == null)
                return BadRequest();

            return Ok(result.ToList());
        }

        [HttpGet("GetCountOfUserPosts")]
        public async Task<int> GetUserPostsCount([FromHeader] string xAuthAccessToken)
        {
            var result = await _PostLogic.GetUserPostsCount(xAuthAccessToken);

            return result;
        }

        [HttpPost("CreatePost")]
        public async Task<ActionResult> CreatePost([FromHeader] string xAuthAccessToken, [FromBody] PostForReact post)
        {
            post.ByteImage = Convert.FromBase64String(post.Image);
            var result = await _PostLogic.CreatePost(xAuthAccessToken, post);

            if (result == false)
                return BadRequest();

            return Ok();
        }
    }
}
