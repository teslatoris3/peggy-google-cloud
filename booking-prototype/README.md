Booking prototype

Overview
This is a minimal prototype demonstrating a booking that requires a deposit via Stripe Checkout. It uses an in-memory store and is intended for local testing only.

Quick start
1. Install dependencies

```bash
cd booking-prototype
npm install
```

2. Copy environment example and set your Stripe test keys

```bash
cp .env.example .env
# edit .env and paste your test keys
```

3. Start the server

```bash
npm start
```

4. Open http://localhost:4000 in your browser, fill the form and complete the Checkout flow with Stripe test card `4242 4242 4242 4242`.

5. To test webhooks locally, expose port with `ngrok` and set the webhook signing secret in `.env`.

Notes
- This prototype stores bookings in memory; restarting the server clears bookings.
- Use `GET /bookings` to see current bookings and payment status.
 - This prototype stores bookings in a local file-backed store (`persist/`) using `node-persist`; restarting the server will NOT clear bookings.
 - Use `GET /bookings` to see current bookings and payment status.
- For production, replace in-memory storage with a database, add authentication, and secure webhook endpoints.

Sample flow
- User submits booking and deposit amount
- Server creates a booking record (pending_payment) and a Stripe Checkout session
- When Checkout completes, Stripe webhook `checkout.session.completed` marks booking as confirmed

Next steps
- Persist bookings in PostgreSQL and add refund/capture logic.
- Add approval workflow for employees and notification hooks.
