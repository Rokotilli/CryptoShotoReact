using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class User:IdentityUser
    {
        public User(): base()
        {
            RefreshTokens = new HashSet<RefreshToken>();
        }

        public byte[] Avatar { get; set; }
        public virtual ICollection<RefreshToken> RefreshTokens { get; set; }
        public virtual ICollection<Wallet> Wallets { get; set; }
    }
}
