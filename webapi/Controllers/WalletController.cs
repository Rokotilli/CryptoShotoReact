using DAL.Models;
using DAL.Repositories.Contracts;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WalletController : ControllerBase
    {
        private IUnitOfWork _unitofwork { get; set; }
        private UserManager<User> _userManager { get; set; }
        public WalletController(IUnitOfWork unitofwork, UserManager<User> userManager)
        {
            _unitofwork = unitofwork;
            _userManager = userManager;
        }

        [HttpPost("BuyCoin")]
        public async Task<ActionResult> BuyCoin([FromBody] List<string> ids)
        {
            try
            {
                float count = float.Parse(ids[2]);

                var user = await _userManager.FindByEmailAsync(ids[1]);

                Wallet temp = new Wallet();

                temp.UserId = user.Id;
                temp.CoinId = int.Parse(ids[0]);
                temp.Count = count;

                try
                {
                    var tem = await _unitofwork.WalletRepository.GetAllByIdAsync(user.Id);

                    foreach (var smth in tem)
                    {
                        if (smth.CoinId == temp.CoinId)
                        {
                            smth.Count += temp.Count;

                            await _unitofwork.WalletRepository.UpdateAsync(smth);
                            await _unitofwork.SaveChangesAsync();
                            return Ok();
                        }
                    }

                    await _unitofwork.WalletRepository.AddAsync(temp);
                    await _unitofwork.SaveChangesAsync();
                    return Ok();
                }

                catch
                {
                    return Ok();
                }
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpGet("GetAllWallets/{email}")]
        public async Task<List<Wallet>> GetAllWallets()
        {
            var user = await _userManager.FindByEmailAsync(HttpContext.GetRouteValue("email").ToString());

            var result = await _unitofwork.WalletRepository.GetAllByIdAsync(user.Id);

            foreach (var wallet in result)
            {
                wallet.User = null;
            }
            if (result != null)
            {
                return result;
            }
            else
            {
                return null;
            }
        }


        [HttpPost("SellCoin")]
        public async Task<ActionResult> SellCoin([FromBody] List<string> ids)
        {
            try
            {
                float count = float.Parse(ids[2]);

                var user = await _userManager.FindByEmailAsync(ids[1]);

                Wallet temp = new Wallet();

                temp.UserId = user.Id;
                temp.CoinId = int.Parse(ids[0]);
                temp.Count = count;

                try
                {
                    var tem = await _unitofwork.WalletRepository.GetAllByIdAsync(user.Id);

                    foreach (var smth in tem)
                    {
                        if (smth.CoinId == temp.CoinId)
                        {
                            if (count <= smth.Count)
                            {
                                smth.Count -= temp.Count;

                                await _unitofwork.WalletRepository.UpdateAsync(smth);
                                await _unitofwork.SaveChangesAsync();
                                return Ok();
                            }
                            else
                            {
                                return BadRequest();
                            }
                        }
                    }

                    return Ok();
                }

                catch
                {
                    return BadRequest();
                }
            }
            catch
            {
                return BadRequest();
            }
        }
    }
}
