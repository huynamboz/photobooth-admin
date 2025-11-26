import { apiClient } from './apiClient';
import {
  type Bank,
  type BankListResponse,
  type BankInfo,
  type CreateBankInfoRequest,
  type UpdateBankInfoRequest,
  type DeleteBankInfoResponse,
} from '../types/bank';

class BankService {
  private BASE_URL = '/admin';

  // Get list of banks from VietQR API
  async getBanks(): Promise<Bank[]> {
    const response = await apiClient.get<BankListResponse>(`${this.BASE_URL}/banks`);
    return response.data;
  }

  // Get current bank info
  async getBankInfo(): Promise<BankInfo | null> {
    try {
      const response = await apiClient.get<BankInfo | null>(`${this.BASE_URL}/bank-info`);
      // API returns null if no bank info exists
      return response;
    } catch (error: any) {
      // If 404, return null (no bank info exists)
      if (error?.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  // Create or update bank info
  async createOrUpdateBankInfo(data: CreateBankInfoRequest): Promise<BankInfo> {
    return apiClient.post<BankInfo>(`${this.BASE_URL}/bank-info`, data);
  }

  // Update bank info by ID
  async updateBankInfo(id: string, data: UpdateBankInfoRequest): Promise<BankInfo> {
    return apiClient.put<BankInfo>(`${this.BASE_URL}/bank-info/${id}`, data);
  }

  // Delete bank info
  async deleteBankInfo(id: string): Promise<DeleteBankInfoResponse> {
    return apiClient.delete<DeleteBankInfoResponse>(`${this.BASE_URL}/bank-info/${id}`);
  }
}

export const bankService = new BankService();

