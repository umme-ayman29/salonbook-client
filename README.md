# SalonBook Client

SalonBook is a salon appointment booking platform. Customers browse services, request appointments and pay for confirmed ones with Stripe. Admins manage services, appointments, users and transactions.

## Important Features
- Browse, search, filter by category and sort services by price
- Role-based Customer and Admin dashboards
- Appointment booking with duplicate slot prevention
- Stripe Checkout payment for confirmed appointments
- Better Auth (email/password and Google login)
- Block/unblock users, profile management
- Fully responsive UI with toast notifications

## Technology Stack
Next.js, TypeScript, Tailwind CSS, Better Auth

## Installation
```bash
git clone https://github.com/umme-ayman29/salonbook-client.git
cd salonbook-client
npm install
```

## Run Locally
```bash
cp .env.example .env.local   # then fill in the values
npm run dev
```
App runs on http://localhost:3000

## Required Environment Variables
- BETTER_AUTH_SECRET
- BETTER_AUTH_URL
- NEXT_PUBLIC_API_URL
- MONGODB_URI
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET

## Links
- Live Website: https://salonbook-client-rust.vercel.app
- Client Repository: https://github.com/umme-ayman29/salonbook-client
- Server Repository: https://github.com/umme-ayman29/salonbook-server