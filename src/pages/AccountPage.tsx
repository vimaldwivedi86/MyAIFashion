import { useNavigate } from 'react-router-dom';
import { getUser } from '../lib/auth';
import { eraseCustomerData, getOrders, getProfile, maskAccountNumber, maskCardNumber } from '../lib/orders';

const decisionBadgeStyles: Record<string, string> = {
  approved: 'bg-green-50 text-green-700',
  review: 'bg-amber-50 text-amber-700',
  declined: 'bg-red-50 text-red-700',
};

const decisionLabels: Record<string, string> = {
  approved: 'Approved',
  review: 'Review',
  declined: 'Declined',
};

export default function AccountPage() {
  const navigate = useNavigate();
  const user = getUser();
  if (!user) return null;

  const profile = getProfile(user.username);
  const orders = getOrders(user.username);

  const handleErase = () => {
    eraseCustomerData(user.username);
    navigate(0);
  };

  return (
    <main className="min-h-screen bg-[#fcfbf8] px-6 py-16">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Account</p>
          <h1 className="mt-3 text-2xl font-semibold text-gray-900">Saved profile</h1>

          {profile ? (
            <dl className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <div><dt className="text-gray-400">Name</dt><dd>{profile.fullName}</dd></div>
              <div><dt className="text-gray-400">Date of birth</dt><dd>{profile.dateOfBirth}</dd></div>
              <div><dt className="text-gray-400">Email</dt><dd>{profile.email}</dd></div>
              <div><dt className="text-gray-400">Phone</dt><dd>{profile.phone}</dd></div>
              <div className="sm:col-span-2"><dt className="text-gray-400">Address</dt><dd>{profile.street}, {profile.city}, {profile.state} {profile.postalCode}, {profile.country}</dd></div>
              {profile.taxId && <div><dt className="text-gray-400">PAN / Tax ID</dt><dd>{profile.taxId}</dd></div>}
            </dl>
          ) : (
            <p className="mt-4 text-sm text-gray-500">No saved profile yet — place an order to create one.</p>
          )}

          {profile && (
            <button
              onClick={handleErase}
              className="mt-6 text-xs uppercase tracking-wide text-red-600 underline"
            >
              Erase my saved data
            </button>
          )}
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900">Order history</h2>
          {orders.length === 0 ? (
            <p className="mt-4 text-sm text-gray-500">No orders yet.</p>
          ) : (
            <ul className="mt-4 divide-y divide-gray-100">
              {orders.map((order) => (
                <li key={order.id} className="py-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">#{order.id.slice(0, 8)}</span>
                    <div className="flex items-center gap-2">
                      {order.decision && (
                        <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide ${decisionBadgeStyles[order.decision.status]}`}>
                          {decisionLabels[order.decision.status]}
                        </span>
                      )}
                      <span>₹{order.total.toLocaleString()}</span>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleString()} ·{' '}
                    {order.payment.method === 'card' && order.payment.card
                      ? maskCardNumber(order.payment.card.cardNumber)
                      : order.payment.bank
                      ? `${order.payment.bank.bankName} ${maskAccountNumber(order.payment.bank.accountNumber)}`
                      : ''}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Shipped to {order.shipping.fullName}, {order.shipping.city}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
