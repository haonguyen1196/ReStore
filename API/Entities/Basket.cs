namespace API.Entities
{
    public class Basket
    {
        public int Id { get; set; }
        public string BuyerId { get; set; }
        public List<BasketItem> Items { get; set; } = new();

        public void AddItem(Product product, int quantity)
        {
            if(Items.All(item => item.ProductId != product.Id))
            {
                //tạo một record mới cho bảng BasketItem
                Items.Add(new BasketItem { Product = product, Quantity = quantity });
            }

            //nếu sản phẩm đã tồn tại trong giỏ hàng thì tăng số lượng
            var existingItem = Items.FirstOrDefault(item => item.ProductId == product.Id);
            if(existingItem != null)
            {
                existingItem.Quantity += quantity;
            }
        }

        public void RemoveItem(int productId, int quantity)
        {
            var item = Items.FirstOrDefault(item => item.ProductId == productId);
            if(item == null) return;
            item.Quantity -= quantity;
            if(item.Quantity == 0) Items.Remove(item);
        }

    }

}