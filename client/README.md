# SwiftPay Client

A modern mobile financial service web application built with React, Tailwind CSS.

## Live Link

[SwiftPay](https://swiftpay-nasib-client.vercel.app/)

## Features

- 🔐 Secure authentication system
- 💰 Real-time balance tracking
- 💸 Multiple transaction types:
  - Send Money
  - Cash In (Agent)
  - Cash Out
  - Balance Request (Agent)
  - Withdrawal Request (Agent)
- 📊 Detailed transaction history
- 🔍 Advanced filtering and search capabilities
- 📱 Responsive design for all devices
- 👥 User role management (User, Agent, Admin)

## Prerequisites

- Node.js (v20 or higher)
- Modern web browser (Preferably Chrome)

## Installation

1. Clone the repository

```bash
git clone https://github.com/nasib15/swiftpay.git
cd swiftpay/client
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file in the client directory

```env
VITE_API_URL=your-api-url
```

4. Start the development server

```bash
npm run dev
```

## Testing Credentials

### Admin Account

- Phone: 11111111111
- Email: admin@gmail.com
- PIN: 12345

### Test User Account

- Phone: 01234567891
- Email: user@gmail.com
- Initial Balance: 40 Tk
- PIN: 12345

### Test Agent Account

- Phone: 01234567890
- Email: agent@gmail.com
- PIN: 12345
- Initial Balance: 100,000 Tk

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
client/
├── src/
│   ├── components/     # Reusable components
│   ├── contexts/      # Context providers
│   ├── layouts/       # Layout components
│   ├── pages/         # Page components
│   │   ├── admin/     # Admin dashboard pages
│   │   ├── agent/     # Agent dashboard pages
│   │   ├── auth/      # Authentication pages
│   │   └── user/      # User dashboard pages
│   ├── App.jsx        # Main application component
│   └── main.jsx       # Application entry point
├── public/            # Static assets
├── .env.local        # Environment variables
└── package.json      # Project dependencies
```
