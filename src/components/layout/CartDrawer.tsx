import { X, ShoppingBag, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { isAuthenticated } from '../../lib/auth';

export default function CartDrawer() {
  const { cart, isCartOpen, toggleCart, removeFromCart } = useStore();
  const navigate = useNavigate();

  const handleCheckout = () => {
    toggleCart();
    navigate(isAuthenticated() ? '/checkout' : '/login', { state: { from: { pathname: '/checkout' } } });
  };

  const total = cart.reduce((sum, item) => sum + item.price * (item.customization.quantity || 1), 0);

  return (
    <>
      {/* Overlay */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50 transition-opacity"
          onClick={toggleCart}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 flex flex-col transition-transform duration-300 ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm tracking-[0.14em] uppercase">Your Bag ({cart.length})</h2>
          <button onClick={toggleCart} className="p-2 -mr-2">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-400">
              <ShoppingBag size={48} strokeWidth={1} />
              <p className="text-sm tracking-wide">Your bag is empty</p>
              <button
                onClick={toggleCart}
                className="text-xs tracking-[0.12em] uppercase text-black underline"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {cart.map((item) => (
                <li key={item.id} className="px-6 py-4 flex gap-4">
                  <div className="w-20 h-24 bg-gray-50 flex-shrink-0 overflow-hidden">
                    {item.customization.selectedTemplate && (
                      <img
                        src={item.customization.selectedTemplate.image}
                        alt={item.customization.selectedTemplate.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {item.customization.selectedTemplate?.name || 'Custom Design'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.customization.selectedFabric?.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {item.customization.selectedColor && (
                        <span
                          className="w-3 h-3 rounded-full border border-gray-200"
                          style={{ background: item.customization.selectedColor.hex }}
                        />
                      )}
                      <span className="text-xs text-gray-500">
                        Size {item.customization.size} · Qty {item.customization.quantity}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm">₹{item.price.toLocaleString()}</span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-gray-100 px-6 py-6">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-500 tracking-wide">Subtotal</span>
              <span className="text-sm">₹{total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs text-gray-500 tracking-wide">Shipping</span>
              <span className="text-xs text-gray-500">Calculated at checkout</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-black text-white text-xs tracking-[0.14em] uppercase py-4 hover:bg-gray-900 transition-colors"
            >
              Checkout
            </button>
            <button
              onClick={toggleCart}
              className="w-full text-xs tracking-[0.12em] uppercase text-gray-500 py-3 hover:text-black transition-colors mt-2"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
