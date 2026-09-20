import { useParams, Link } from 'react-router-dom';
import { getOrder, maskAccountNumber, maskCardNumber } from '../lib/orders';

export default function OrderConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const order = orderId ? getOrder(orderId) : null;

  if (!order) {
    return (
      <main className="min-h-screen bg-[#fcfbf8] px-6 py-16 text-center">
        <p className="text-sm text-gray-500">Order not found.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fcfbf8] px-6 py-16">
      <div className="mx-auto max-w-2xl rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Order confirmed</p>
        <h1 className="mt-3 text-3xl font-semibold text-gray-900">Thank you, {order.shipping.fullName.split(' ')[0]}</h1>
        <p className="mt-2 text-sm text-gray-500">Order #{order.id}</p>

        <div className="mt-8 space-y-6">
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-800">Shipping to</h2>
            <p className="mt-2 text-sm text-gray-600">
              {order.shipping.fullName}<br />
              {order.shipping.street}, {order.shipping.city}, {order.shipping.state} {order.shipping.postalCode}<br />
              {order.shipping.country}<br />
              {order.shipping.email} · {order.shipping.phone}
            </p>
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-800">Payment</h2>
            <p className="mt-2 text-sm text-gray-600">
              {order.payment.method === 'card' && order.payment.card
                ? `Card ending in ${maskCardNumber(order.payment.card.cardNumber)}`
                : order.payment.bank
                ? `Bank transfer · ${order.payment.bank.bankName} · ${maskAccountNumber(order.payment.bank.accountNumber)}`
                : '—'}
            </p>
          </section>

          <section className="border-t border-gray-100 pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Items</span>
              <span>{order.items.length}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold mt-1">
              <span>Total</span>
              <span>₹{order.total.toLocaleString()}</span>
            </div>
          </section>
        </div>

        <Link to="/account" className="mt-8 inline-block rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white">
          View order history
        </Link>
      </div>
    </main>
  );
}
