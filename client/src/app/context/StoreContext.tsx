import { PropsWithChildren, createContext, useContext, useState } from "react";
import { Basket } from "../models/basket";

//định nghĩa cấu trúc của giá trị context
interface StoreContextValue {
    basket: Basket | null;
    setBasket: (basket: Basket) => void;
    removeItem: (productId: number, quantity: number) => void;
}

//sử dụng createContext để tạo context với giá trị mặc định là undefined
export const StoreContext = createContext<StoreContextValue | undefined>(
    undefined
);

// tạo ra hook để truy cập vào giá trị của context, nếu không tìm thấy context thì báo lỗi
export function useStoreContext() {
    const context = useContext(StoreContext);

    if (context === undefined) {
        throw new Error(
            "Oops - We are not inside the app.tsx so we do not have access to the store context"
        );
    }

    return context;
}

export function StoreProvider({ children }: PropsWithChildren<unknown>) {
    const [basket, setBasket] = useState<Basket | null>(null);

    function removeItem(productId: number, quantity: number) {
        if (!basket) return;
        const items = [...basket.items];

        //findIndex trả về index của phần tử đầu tiên trong mảng thỏa đk, nếu không có đk thỏa trả về -1
        const itemIndex = items.findIndex((i) => i.productId === productId);
        if (itemIndex >= 0) {
            items[itemIndex].quantity -= quantity;

            //nếu số lượng của sản phẩm bằng 0 thì xóa sản phẩm đó khỏi giỏ hàng,
            // itemIndex là index của sản phẩm cần xóa, 1 là số lượng phần tử cần xóa tính từ index qua phải
            if (items[itemIndex].quantity === 0) items.splice(itemIndex, 1);

            //cập nhật giỏ hàng mới trong items, dấu ! để bỏ qua lỗi null của typescript
            setBasket((prevState) => {
                return { ...prevState!, items };
            });
        }
    }

    //đây là 3 giá trị mà context cung cấp cho các component con
    return (
        <StoreContext.Provider value={{ basket, setBasket, removeItem }}>
            {children}
        </StoreContext.Provider>
    );
}
