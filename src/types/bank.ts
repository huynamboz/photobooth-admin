export interface Bank {
  id: number;
  name: string;
  code: string;
  bin: string;
  shortName: string;
  logo: string;
  transferSupported: number;
  lookupSupported: number;
}

export interface BankListResponse {
  code: string;
  desc: string;
  data: Bank[];
}

export interface BankInfo {
  id: string;
  bankCode: string;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  branch?: string;
  qrCodeUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBankInfoRequest {
  bankCode: string;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  branch?: string;
  qrCodeUrl?: string;
}

export interface UpdateBankInfoRequest {
  bankCode?: string;
  bankName?: string;
  accountNumber?: string;
  accountHolderName?: string;
  branch?: string;
  qrCodeUrl?: string;
}

export interface DeleteBankInfoResponse {
  message: string;
}

