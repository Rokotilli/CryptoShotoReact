using DAL.Models;
using DAL.Repositories.Contracts;
using Microsoft.AspNetCore.Mvc;

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CoinController : ControllerBase
    {
        private ICoinRepository coinRepository;
        public CoinController(ICoinRepository coinRepository)
        { 
            this.coinRepository = coinRepository;
        }

        [HttpGet("GetAllCoins")]
        public async Task<ActionResult<List<Coin>>> GetAllCoins()
        {
            var result = await coinRepository.GetAllAsync();

            if (result != null)
                return Ok(result.ToList());

            return BadRequest();
        }
    }
}
