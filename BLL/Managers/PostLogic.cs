using BLL.Interfaces;
using DAL.Models;
using DAL.Repositories.Contracts;
using DAL.Repositories.Pagination;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Managers
{
    public class PostLogic : IPostLogic
    {
        public IUnitOfWork _unitOfWork { get; }


        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _configuration;

        public PostLogic(IUnitOfWork unitOfWork, UserManager<User> userManager, IConfiguration configuration)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
            _configuration = configuration;
        }

        public async Task<List<Post>> GetAllUserPosts(string accessToken, QueryStringParameters queryStringParameters)
        {
            var user = await GetUserFromAccessToken(accessToken);

            if (user == null)
                return null;

            var result = await _unitOfWork.PostRepository.GetPaggedByIdForReactAsync(user.Id, queryStringParameters);

            foreach(var item in result)
            {
                item.User = null;
            }

            return result;
        }

        public async Task<User> GetUserFromAccessToken(string accessToken)
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

        public async Task<int> GetUserPostsCount(string accessToken)
        {
            var user = await GetUserFromAccessToken(accessToken);
            var result = _unitOfWork.databaseContext.posts.Where(e => e.UserId == user.Id).Count();
            return result;
        }

        public async Task<bool> CreatePost(string accessToken, PostForReact post)
        {
            var user = await GetUserFromAccessToken(accessToken);
            try
            {
                var newpost = new Post()
                {
                    UserId = user.Id,
                    Title = post.Title,
                    Text = post.Text,
                    Photo = post.ByteImage,
                    Date = DateTime.Now
                };

                await _unitOfWork.PostRepository.AddAsync(newpost);
                await _unitOfWork.SaveChangesAsync();

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }
}
