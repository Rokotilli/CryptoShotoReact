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
        public async Task<ActionResult> BuyCoin([FromHeader] string xAuthAccessToken, [FromBody] WalletForReact wallet)
        {
            var model = await _walletLogic.BuyCoin(xAuthAccessToken, wallet);

            if (model == false)
                return BadRequest();

            return Ok();
        }

        [HttpGet("GetAllWallets")]
        public async Task<ActionResult<List<WalletForReact>>> GetAllWallets([FromHeader] string xAuthAccessToken)
        {
            var model = await _walletLogic.GetAllWallets(xAuthAccessToken);

            if (model == null)
                return NotFound();

            return Ok(model);
        }

        [HttpPost("SellCoin")]
        public async Task<ActionResult> SellCoin([FromHeader] string xAuthAccessToken, [FromBody] WalletForReact wallet)
        {
            var model = await _walletLogic.SellCoin(xAuthAccessToken, wallet);
            Console.WriteLine(model);

            if (model == false)
                return BadRequest();

            return Ok();
        }
    }
}
