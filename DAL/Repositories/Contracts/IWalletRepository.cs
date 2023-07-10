using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Repositories.Contracts
{
    public interface IWalletRepository : IGenericRepository<Wallet>
    {
        public Task<List<Wallet>> GetAllByIdAsync(string id);
    }
}
