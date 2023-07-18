using DAL.Repositories.Contracts;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Repositories
{
    public class UnitOfWork:IUnitOfWork
    {
        public MyContext databaseContext { get; }
        public IWalletRepository WalletRepository { get; }
        public ICoinRepository CoinRepository { get; }
        public IPostRepository PostRepository { get; }

        public UnitOfWork(MyContext databaseContext, IWalletRepository WalletRepository, ICoinRepository CoinRepository, IPostRepository postRepository)
        {
            this.databaseContext = databaseContext;
            this.CoinRepository = CoinRepository;
            this.WalletRepository = WalletRepository;
            this.PostRepository = postRepository;
        }

        public async Task SaveChangesAsync()
        {
            await databaseContext.SaveChangesAsync();
        }
    }
}
