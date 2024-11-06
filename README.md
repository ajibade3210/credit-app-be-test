# Demo Credit Wallet Service API

Demo Credit is a mobile lending application designed to help borrowers manage their funds seamlessly. Borrowers use this service to receive loan disbursements directly into their wallets and make repayments.

This MVP (Minimum Viable Product) wallet service API includes essential wallet functionalities, including account creation, funding, transferring, and withdrawing funds. Additionally, the service checks users against the Lendsqr Adjutor Karma blacklist to ensure only eligible users are onboarded.

## Features

### User Account Management

- Create an account.
- Sign in, sign up, and sign out securely.
- Restricted onboarding for users listed in the Lendsqr Adjutor Karma blacklist.

### Wallet Operations

- Create Wallet: Each user can create wallets of different types.
- Fund Wallet: Add funds to the wallet.
- Withdraw Funds: Withdraw funds to an external account.
- Delete Wallet: Option to delete a user’s wallet.

### Transaction Management

- Transfer Funds: Users can transfer funds to other users' wallets
- Transaction History: View mandate and beneficiary transactions for accountability and transparency.

## Project Setup

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd demo-credit-wallet

```

2. Install dependencies:

```bash
  npm install

```

### Starting the Application

1. Build & Start
   Build and run the application:

```bash
  npm run build
npm run start


```

2. Development Mode
   Run the application in development mode with auto-reload:

```bash
  npm run dev
```

3.Test Mode
Execute tests to ensure the functionality:

```bash
  npm run test
```

## API Models and Endpoints

### User Model

- Authentication
  - POST /auth/sign-up - Register a new user (Blacklist validation applied).
  - POST /auth/sign-in - Login for existing users.
  - POST /auth/sign-out - Logout the user.
- User Information
  - GET /users/:id - Retrieve the logged-in user’s details.
  - GET /users/:id/wallets - Retrieve wallets linked to the user.
  - GET /users/:id/mandate-transactions - Retrieve transactions mandated by the user.
  - GET /users/:id/beneficiary-transactions - Retrieve transactions where the user is the beneficiary.
  - GET /users/:id/all-transactions - Retrieve all transactions associated with the user.

### Wallet Model

- Wallet Operations
  - POST /wallets/create - Create a wallet of a specific type.
  - POST /wallets/fund - Fund the wallet.
  - POST /wallets/withdraw - Withdraw funds from the wallet.
  - DELETE /wallets/:id - Delete a user’s wallet.

### Transaction Model

- Transactions
  - POST /transactions/transfer - Transfer funds to another user's account.

## Additional Information

### Blacklist Verification

Any user who is listed in the Lendsqr Adjutor Karma blacklist will not be able to onboard. This check is automatically performed during the sign-up process to ensure compliance.

### Environment Variables

Configure the following environment variables to connect to the database and other services:

```bash
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your-password
DB_DATABASE=lendsqr_db
DEBUG=knex:query
NODE_ENV=development

DummySeedPass=@tehpasswor1
JWT_SECRET_KEY=your-secret
# NODE_ENV=test
```
