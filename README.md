# SwiftPay - Mobile Financial Service

A full-stack mobile financial service application built with React, Node.js, and MongoDB.

## Live Demo

[SwiftPay Live Demo](https://swiftpay-nasib-client.vercel.app/)

## Project Structure

```
swiftpay/
├── client/          # React frontend application
├── server/          # Express backend application
└── README.md
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

## Client (Frontend)

### Setup

1. Navigate to client directory:

```bash
cd client
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file:

```env
VITE_API_URL=your-api-url
```

4. Start development server:

```bash
npm run dev
```

## Server (Backend)

### Setup

1. Navigate to server directory:

```bash
cd server
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file:

```env
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=7d
PORT=5000
```

4. Start development server:

```bash
npm run dev
```
