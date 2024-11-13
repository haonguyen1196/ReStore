export function getCookie(key: string) {
    const b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
    // phương thức pop lấy phần tử cuối cùng của mảng
    return b ? b.pop() : "";
}

export function formatCurrency(price: number) {
    return "$" + (price / 100).toFixed(2);
}
