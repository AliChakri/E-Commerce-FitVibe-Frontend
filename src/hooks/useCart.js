// hooks/useCart.js
import { useEffect, useState } from "react";
import CartApi from "../context/cartApi";
import { useLanguage } from "../context/LanguageContext";

export default function useCart(buyNowItem = null) {

  const { lang } = useLanguage();
  
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // BUY NOW mode
    if (buyNowItem) {
      setCartItems([buyNowItem]);
      setTotalPrice(buyNowItem.product.price * buyNowItem.quantity);
      setLoading(false);
      return;
    }

    // Normal CART mode
    const fetchCart = async () => {
      try {
        const { data } = await CartApi.get(`/?lang=${lang}`, { withCredentials: true });
        setCartItems(data.cart?.items || []);
        setTotalPrice(Number(data.totalPrice || 0));
      } catch (error) {
        console.error("Error fetching cart:", error);
        setCartItems([]);
        setTotalPrice(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [buyNowItem, lang]);

  return { cartItems, totalPrice, loading };
}
