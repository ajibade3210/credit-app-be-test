export interface User {
  id: number;
  bvn: string;
  first_name: string;
  last_name: string;
  password: string;
  date_of_birth: Date;
  age: number;
  phone_number: string;
  unique_email: string;
  created_at: Date;
  updated_at: Date;
}

export interface Wallet {
  id: number;
  balance: string;
  currency: string;
  type: string;
  user_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface Transaction {
  id: number;
  amount: string;
  reference: string;
  narration: string;
  price: number;
  wallet_id: number;
  mandate_id: number;
  beneficiary_id: number;
  created_at: Date;
  updated_at: Date;
}

declare module "knex/types/tables" {
  interface Tabled {
    users: User;
    wallets: Wallet;
    transactions: Transaction;
  }
}

export interface EmployeeResponse {
  data: { [key: string]: any }[];
}

export interface ErrorResponseData {
  message: string;
}

export interface ServiceInterface {
  Lendurl: {
    url: string;
    fetchEmployee: (email: string) => Promise<any>;
  };
}
