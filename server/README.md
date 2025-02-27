# SwiftPay Server

A robust Node.js/Express backend for the SwiftPay mobile financial service application.

## Features

- 🔒 JWT-based authentication
- 💾 MongoDB database integration
- 🔄 Transaction management system
- 👥 User role management
- 📊 System statistics
- 🔍 Advanced query capabilities
- 🛡️ Secure PIN handling

## Prerequisites

- Node.js (v20 or higher)
- MongoDB (v6 or higher)

## Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/swiftpay.git
cd swiftpay/server
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file in the server directory

```env
MONGODB_URI=mongodb+srv://your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
PORT=5000
```

4. Start the server

```bash
npm run dev
```
