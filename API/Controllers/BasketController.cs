using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class BasketController : BaseApiController
    {
        private readonly StoreContext _context;
        public BasketController(StoreContext context)
        {
            _context = context;
            
        }

        [HttpGet(Name = "GetBasket")]
        public async Task<ActionResult<BasketDto>> GetBasket()
        {
            var basket = await RetrieveBasket();

            if (basket == null) return NotFound();
            return BasketToDto(basket);
        }

        [HttpPost] //api/basket?productId=1&quantity=5
        public async Task<ActionResult<Basket>> AddItemToBasket(int productId, int quantity)
        {
            var basket = await RetrieveBasket();

            if(basket == null) basket = CreateBasket();
            
            var product = await _context.Products.FindAsync(productId);

            if(product == null) return NotFound();

            basket.AddItem(product, quantity);

            var result = await _context.SaveChangesAsync() > 0;

            // nếu lưu thành công thì trả về 201 CreatedAtRoute, trả về đường dẫn GetBasket và trả về dto
            if(result) return CreatedAtRoute("GetBasket", BasketToDto(basket));

            return BadRequest(new ProblemDetails{Title = "Problem saving item to basket"});
        }

        [HttpDelete]
        public async Task<ActionResult<Basket>> RemoveBasketItem(int productId, int quantity)
        {
            var basket = await RetrieveBasket();
            if(basket == null) return NotFound();

            basket.RemoveItem(productId, quantity);
            var result = await _context.SaveChangesAsync() > 0;

            if(result) return Ok();

            return BadRequest(new ProblemDetails{Title = "Problem removing item from basket"});
        }

        private async Task<Basket> RetrieveBasket()
        {
            return await _context.Baskets
                            .Include(i => i.Items)
                            .ThenInclude(p => p.Product)
                            .FirstOrDefaultAsync(x => x.BuyerId == Request.Cookies["buyerId"]); 
        }

        private Basket CreateBasket()
        {
            // tạo 1 id là số toàn cầu duy nhất
            var buyerId = Guid.NewGuid().ToString();
            // tạo cookie với dự cần thiết là true và thời hạn 30 ngày
            var cookieOptions = new CookieOptions{IsEssential = true, Expires = DateTime.Now.AddDays(30)};
            // thêm cookie vào response, basketId là tên cookie, buyerId là giá trị của cookie, trả về cho client lưu vào trình duyệt
            Response.Cookies.Append("buyerId", buyerId, cookieOptions);
            
            var basket = new Basket{BuyerId = buyerId};
            _context.Baskets.Add(basket);
            return basket;
        }

        private BasketDto BasketToDto(Basket basket)
        {

            // trả ra dto để tránh lỗi vòng tròn tham chiếu
            return new BasketDto
            {
                Id = basket.Id,
                BuyerId = basket.BuyerId,
                Items = basket.Items.Select(item => new BasketItemDto
                {
                    ProductId = item.ProductId,
                    Name = item.Product.Name,
                    Price = item.Product.Price,
                    PictureUrl = item.Product.PictureUrl,
                    Type = item.Product.Type,
                    Brand = item.Product.Brand,
                    Quantity = item.Quantity,
                }).ToList()
            };
        }
    }
}