using DAL.Models;
using DAL.Repositories.Contracts;
using DAL.Repositories.Pagination;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Interfaces
{
    public interface IPostLogic
    {
        IUnitOfWork _unitOfWork { get; }
        Task<List<Post>> GetAllUserPosts(string accessToken, QueryStringParameters queryStringParameters);
        Task<int> GetUserPostsCount(string accessToken);
        Task<bool> CreatePost(string accessToken, PostForReact post);
    }
}
