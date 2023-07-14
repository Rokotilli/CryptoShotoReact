using BLL.Interfaces;
using DAL.Models;
using Microsoft.AspNetCore.Mvc;

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WalletController : ControllerBase
    {
        private readonly IWalletLogic _walletLogic;
        public WalletController(IWalletLogic walletLogic)
        {
            _walletLogic = walletLogic;
        }

        [HttpPost("BuyCoin")]
        public async Task<ActionResult> BuyCoin([FromBody] List<string> ids)
        {
            var model = await _walletLogic.BuyCoin(ids);

            if (model == false)
                return BadRequest();

            return Ok();
        }

        [HttpGet("GetAllWallets")]
        public async Task<ActionResult<List<Wallet>>> GetAllWallets([FromQuery] string email)
        {
            var model = await _walletLogic.GetAllWallets(email);

            if (model == null)
                return NotFound();

            return Ok(model);
        }

        [HttpPost("SellCoin")]
        public async Task<ActionResult> SellCoin([FromBody] List<string> ids)
        {
            var model = await _walletLogic.SellCoin(ids);

            if (model == false)
                return BadRequest();

            return Ok();
        }
    }
}
