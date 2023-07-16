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
        Task<List<Wallet>> GetAllByIdAsync(string userid);
        Task<List<WalletForReact>> GetAllByIdForReactAsync(string userid);
    }
}
