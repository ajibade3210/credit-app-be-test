# Demo Credit Wallet Service API [LIVE](https://olaoluajibade-lendsqr-be-test.onrender.com/api/test)

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

## Database Design Approach Used
The database design approach used in this Demo API service is a relational database design with a normalized structure.

Here’s a breakdown of the design choices made and implications:
### Users Table:
This serves as the primary table with basic information about users, including fields such as bvn (Bank Verification Number), first_name, last_name, phone_number, and unique_email.

Where our unique_email column is explicitly set to be unique, ensuring that each user has a distinct email.

### Wallets Table:
Designed as a child table of the users table, it represents different wallets that each user can own. The user_id field acts as a foreign key referencing the users table.

The **type column** allows only specific values (standard, regular, or premium), enforcing type consistency with a native database enum (wallet_type). Where a user can have multiple wallets but of one type.

To do this we are using a unique constraint on `user_id` and `type` this ensures that a user cannot have multiple wallets of the same type, which follows the user's requirement of one wallet type per user ID.

### Transactions Table:
Represents transactions associated with wallets

wallet_id is a foreign key referencing the wallets table, establishing the wallet context for each transaction.

mandate_id and beneficiary_id reference the users table to capture the transaction initiator and the recipient respectively.

Setting these fields with onDelete("CASCADE") ensures that if a user or wallet is deleted, the related transactions are also removed, maintaining referential integrity.

## Normalization:
Our database structure adheres to third normal form (3NF), where data is stored in multiple tables with clear primary and foreign keys linking them. This reduces redundancy by ensuring that each piece of data (such as user information) is stored only once and is referenced by related tables.

## Data Constraints and Integrity:

Primary and unique constraints, like unique_email in the users table and unique(["user_id", "type"]) in the wallets table, are used to enforce data integrity at the database level.

Foreign key constraints with onDelete("CASCADE") ensure that deletions in parent tables cascade to child tables, preventing orphaned records.
Use of enums and specified data types (e.g., decimal for balance) ensures that data is stored consistently.

## Scalability and Maintainability:

This approach allows flexibility in adding more wallet types or additional relationships (e.g., additional transaction types). With this we can create wallets of different types, currency etc.
