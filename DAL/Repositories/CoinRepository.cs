using DAL.Models;
using DAL.Repositories.Contracts;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Repositories
{
    public class CoinRepository : GenericRepository<Coin>, ICoinRepository
    {
        public CoinRepository(MyContext databaseContext)
          : base(databaseContext)
        {
        }
    }
}
