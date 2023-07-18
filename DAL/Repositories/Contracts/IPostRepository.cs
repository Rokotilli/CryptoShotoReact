using DAL.Models;
using DAL.Repositories.Pagination;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Repositories.Contracts
{
    public interface IPostRepository : IGenericRepository<Post>
    {
        public Task<Pagination<Post>> GetPaggedByIdForReactAsync(string userid, QueryStringParameters queryStringParameters);
    }
}
