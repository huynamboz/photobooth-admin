import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useBankStore } from "@/stores/bankStore";
import { type CreateBankInfoRequest } from "@/types/bank";
import { toast } from "sonner";
import { Building2, CreditCard, User, MapPin, QrCode, Loader2 } from "lucide-react";

function BankSettings() {
  const {
    banks,
    bankInfo,
    loading,
    error,
    fetchBanks,
    fetchBankInfo,
    createOrUpdateBankInfo,
    clearError,
  } = useBankStore();

  const [formData, setFormData] = useState<CreateBankInfoRequest>({
    bankCode: '',
    bankName: '',
    accountNumber: '',
    accountHolderName: '',
    branch: '',
    qrCodeUrl: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchBanks();
    fetchBankInfo();
  }, [fetchBanks, fetchBankInfo]);

  useEffect(() => {
    if (bankInfo) {
      setFormData({
        bankCode: bankInfo.bankCode,
        bankName: bankInfo.bankName,
        accountNumber: bankInfo.accountNumber,
        accountHolderName: bankInfo.accountHolderName,
        branch: bankInfo.branch || '',
        qrCodeUrl: bankInfo.qrCodeUrl || '',
      });
    }
  }, [bankInfo]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleBankSelect = (bankCode: string) => {
    const selectedBank = banks.find(bank => bank.code === bankCode);
    if (selectedBank) {
      setFormData(prev => ({
        ...prev,
        bankCode: selectedBank.code,
        bankName: selectedBank.name,
      }));
      setErrors(prev => ({ ...prev, bankCode: '', bankName: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.bankCode) {
      newErrors.bankCode = 'Bank is required';
    }
    if (!formData.bankName) {
      newErrors.bankName = 'Bank name is required';
    }
    if (!formData.accountNumber || formData.accountNumber.length < 8) {
      newErrors.accountNumber = 'Account number must be at least 8 characters';
    }
    if (!formData.accountHolderName || formData.accountHolderName.length < 2) {
      newErrors.accountHolderName = 'Account holder name must be at least 2 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      await createOrUpdateBankInfo(formData);
      toast.success('Bank information saved successfully');
      await fetchBankInfo(); // Refresh bank info
    } catch {
      toast.error('Failed to save bank information');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Bank Account Information
          </CardTitle>
          <CardDescription>
            Configure your bank account details for receiving payments from users.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Bank Selection */}
            <div className="space-y-2">
              <Label htmlFor="bankCode" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Bank
              </Label>
              <Select
                value={formData.bankCode}
                onValueChange={handleBankSelect}
                disabled={loading}
              >
                <SelectTrigger id="bankCode" className={errors.bankCode ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select a bank" />
                </SelectTrigger>
                <SelectContent>
                  {loading ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : (
                    banks.map((bank) => (
                      <SelectItem key={bank.id} value={bank.code}>
                        <div className="flex items-center gap-2">
                          {bank.logo && (
                            <img
                              src={bank.logo}
                              alt={bank.shortName}
                              className="h-5 w-5 object-contain"
                            />
                          )}
                          <span>{bank.name}</span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.bankCode && (
                <p className="text-sm text-red-600">{errors.bankCode}</p>
              )}
            </div>

            {/* Bank Name (auto-filled) */}
            {formData.bankName && (
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  id="bankName"
                  value={formData.bankName}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
            )}

            {/* Account Number */}
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                type="text"
                value={formData.accountNumber}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, accountNumber: e.target.value }));
                  setErrors(prev => ({ ...prev, accountNumber: '' }));
                }}
                placeholder="Enter account number"
                disabled={loading}
                className={errors.accountNumber ? 'border-red-500' : ''}
              />
              {errors.accountNumber && (
                <p className="text-sm text-red-600">{errors.accountNumber}</p>
              )}
            </div>

            {/* Account Holder Name */}
            <div className="space-y-2">
              <Label htmlFor="accountHolderName" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Account Holder Name
              </Label>
              <Input
                id="accountHolderName"
                type="text"
                value={formData.accountHolderName}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, accountHolderName: e.target.value.toUpperCase() }));
                  setErrors(prev => ({ ...prev, accountHolderName: '' }));
                }}
                placeholder="Enter account holder name"
                disabled={loading}
                className={errors.accountHolderName ? 'border-red-500' : ''}
              />
              {errors.accountHolderName && (
                <p className="text-sm text-red-600">{errors.accountHolderName}</p>
              )}
            </div>

            {/* Branch */}
            <div className="space-y-2">
              <Label htmlFor="branch" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Branch (Optional)
              </Label>
              <Input
                id="branch"
                type="text"
                value={formData.branch}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, branch: e.target.value }));
                }}
                placeholder="Enter branch name"
                disabled={loading}
              />
            </div>

            {/* QR Code URL */}
            <div className="space-y-2">
              <Label htmlFor="qrCodeUrl" className="flex items-center gap-2">
                <QrCode className="h-4 w-4" />
                QR Code URL (Optional)
              </Label>
              <Input
                id="qrCodeUrl"
                type="url"
                value={formData.qrCodeUrl}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, qrCodeUrl: e.target.value }));
                }}
                placeholder="Enter QR code URL"
                disabled={loading}
              />
            </div>

            {/* QR Code Preview */}
            {formData.qrCodeUrl && (
              <div className="space-y-2">
                <Label>QR Code Preview</Label>
                <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
                  <img
                    src={formData.qrCodeUrl}
                    alt="QR Code"
                    className="max-w-xs"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}

            {/* Current Bank Info Display */}
            {bankInfo && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-sm text-blue-900 mb-2">Current Bank Information</h4>
                <div className="space-y-1 text-sm text-blue-800">
                  <p><strong>Bank:</strong> {bankInfo.bankName} ({bankInfo.bankCode})</p>
                  <p><strong>Account:</strong> {bankInfo.accountNumber}</p>
                  <p><strong>Holder:</strong> {bankInfo.accountHolderName}</p>
                  {bankInfo.branch && <p><strong>Branch:</strong> {bankInfo.branch}</p>}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Bank Information'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default BankSettings;

