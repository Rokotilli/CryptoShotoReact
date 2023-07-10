using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class User_Model 
    {
        [Required(ErrorMessage ="Email is nyshen")]
        [EmailAddress]
        public string Email { get; set; }

        [PasswordPropertyText]
        [Required(ErrorMessage = "Password is nyshen")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Name is nyshen")]
        public string Name { get; set; }
    }
}
