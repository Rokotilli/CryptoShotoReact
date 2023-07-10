using DAL.Models;
using DAL.Repositories.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Repositories
{
    public class WalletRepository : GenericRepository<Wallet>, IWalletRepository
    {
        public WalletRepository(MyContext databaseContext)
          : base(databaseContext)
        {

        }

        public async Task<List<Wallet>> GetAllByIdAsync(string id)
        {
            return databaseContext.wallets.Where(w => w.UserId == id).ToList();
        }
    }
}
