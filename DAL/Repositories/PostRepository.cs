using DAL.Models;
using DAL.Repositories.Contracts;
using DAL.Repositories.Pagination;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Repositories
{
    public class PostRepository : GenericRepository<Post>, IPostRepository
    {
        public PostRepository(MyContext databaseContext)
          : base(databaseContext)
        {
        }

        public async Task<Pagination<Post>> GetPaggedByIdForReactAsync(string userid, QueryStringParameters queryStringParameters)
        {
            var result = databaseContext.posts.Where(e=>e.UserId== userid).AsEnumerable();

            var paged_list_coins = await Pagination<Post>.ToPagedListAsync(result, queryStringParameters.PageNumber, queryStringParameters.PageSize);

            return paged_list_coins;
        }
    }
}
