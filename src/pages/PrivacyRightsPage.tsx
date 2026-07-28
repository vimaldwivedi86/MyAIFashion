import { useState } from 'react';

export default function PrivacyRightsPage() {
  const [email, setEmail] = useState('');
  const [requestType, setRequestType] = useState('access');
  const [details, setDetails] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      const res = await fetch('/api/dsr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          request_type: requestType,
          email,
          details,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request could not be submitted');
      setStatus(`Request received. Reference ${data.request_id}.`);
      setEmail('');
      setDetails('');
    } catch (error: unknown) {
      setStatus(error instanceof Error ? error.message : 'Request could not be submitted');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fcfbf8] px-6 py-16">
      <div className="mx-auto max-w-3xl rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Privacy rights</p>
        <h1 className="mt-3 text-3xl font-semibold text-gray-900">Submit a data subject request</h1>
        <p className="mt-4 text-sm leading-7 text-gray-600">
          Use this form to request access, correction, erasure, withdrawal of consent, or other privacy rights. Your request is logged securely and routed to our DSR workflow.
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Request type</label>
            <select
              value={requestType}
              onChange={(event) => setRequestType(event.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
            >
              <option value="access">Access</option>
              <option value="correction">Correction</option>
              <option value="erasure">Erasure</option>
              <option value="withdraw">Withdraw consent</option>
              <option value="grievance">Grievance</option>
              <option value="nominate">Nominate</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Details</label>
            <textarea
              value={details}
              onChange={(event) => setDetails(event.target.value)}
              className="min-h-32 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
              placeholder="Optional details about your request"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? 'Submitting…' : 'Submit request'}
          </button>
        </form>

        {status && (
          <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
            {status}
          </div>
        )}
      </div>
    </main>
  );
}
