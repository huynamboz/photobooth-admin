import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBankStore } from "@/stores/bankStore";
import { type User } from "@/types/user";
import { QrCode, Wallet, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface AddPointsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (points: number) => Promise<void>;
  user: User | null;
  loading?: boolean;
}

function AddPointsDialog({ isOpen, onClose, onSubmit, user, loading = false }: AddPointsDialogProps) {
  const { bankInfo, fetchBankInfo } = useBankStore();
  const [activeTab, setActiveTab] = useState<'manual' | 'qr'>('manual');
  const [points, setPoints] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPoints('');
      setAmount('');
      // Auto-fill description with user's paymentCode
      setDescription(`PTB${user?.paymentCode || ''}`);
      setError('');
      setQrCodeUrl('');
      setCopied(false);
      setActiveTab('manual');
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (isOpen && activeTab === 'qr') {
      fetchBankInfo();
    }
  }, [isOpen, activeTab, fetchBankInfo]);

  useEffect(() => {
    if (activeTab === 'qr' && bankInfo) {
      const params = new URLSearchParams();
      params.append('acc', bankInfo.accountNumber);
      params.append('bank', bankInfo.bankCode);
      
      if (amount) {
        params.append('amount', amount);
      }
      
      // Use paymentCode as description (auto-filled from user)
      const transferDescription = `PTB${user?.paymentCode}`;
      if (transferDescription) {
        params.append('des', transferDescription);
      }

      const qrUrl = `https://qr.sepay.vn/img?${params.toString()}`;
      setQrCodeUrl(qrUrl);
    } else {
      setQrCodeUrl('');
    }
  }, [activeTab, bankInfo, amount, description, user]);


  const copyQrUrl = () => {
    if (qrCodeUrl) {
      navigator.clipboard.writeText(qrCodeUrl);
      setCopied(true);
      toast.success('QR code URL copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (activeTab === 'manual') {
      const pointsValue = parseInt(points, 10);
      
      if (!points || isNaN(pointsValue) || pointsValue < 1) {
        setError('Points must be a positive integer (minimum 1)');
        return;
      }

      try {
        await onSubmit(pointsValue);
        onClose();
      } catch {
        // Error is handled by parent component
      }
    } else {
      // QR Banking tab - just show QR code, admin will manually add points after verification
      if (!bankInfo) {
        setError('Bank information is not configured. Please set up bank account in Settings.');
        return;
      }
      if (!amount || parseFloat(amount) <= 0) {
        setError('Please enter a valid amount');
        return;
      }
      // QR code is already generated, just show it
      toast.info('Please verify the payment and manually add points after confirmation');
    }
  };

  const handleAddPointsFromQr = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    // Convert amount to points (assuming 1 VND = 1 point, adjust as needed)
    const pointsValue = Math.floor(parseFloat(amount));
    
    if (pointsValue < 1) {
      setError('Amount must be at least 1 VND');
      return;
    }

    try {
      await onSubmit(pointsValue);
      onClose();
    } catch {
      // Error is handled by parent component
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Points</DialogTitle>
          <DialogDescription>
            Add points to user <strong>{user?.name}</strong> ({user?.email})
            {user?.points !== undefined && (
              <span className="block mt-1 text-sm text-gray-600">
                Current points: <strong>{user.points}</strong>
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'manual' | 'qr')} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Manual Add
            </TabsTrigger>
            <TabsTrigger value="qr" className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              QR Banking
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-4 mt-4">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="points">Points</Label>
                  <Input
                    id="points"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="Enter points to add"
                    value={points}
                    onChange={(e) => {
                      setPoints(e.target.value);
                      setError('');
                    }}
                    disabled={loading}
                  />
                  {error && (
                    <p className="text-sm text-red-600">{error}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    Minimum: 1 point
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Points'}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>

          <TabsContent value="qr" className="space-y-4 mt-4">
            {!bankInfo ? (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Bank information is not configured. Please set up bank account in Settings first.
                </p>
              </div>
            ) : (
              <>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (VND)</Label>
                    <Input
                      id="amount"
                      type="number"
                      min="1"
                      step="1000"
                      placeholder="Enter amount in VND"
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value);
                        setError('');
                      }}
                      disabled={loading}
                    />
                    <p className="text-xs text-gray-500">
                      Amount will be converted to points (1 VND = 1 point)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Transfer Description</Label>
                    <Input
                      id="description"
                      type="text"
                      placeholder="Payment code"
                      value={`PTB${user?.paymentCode}`}
                      onChange={(e) => {
                        setDescription(e.target.value);
                      }}
                      disabled={loading || !!user?.paymentCode}
                      className={user?.paymentCode ? 'bg-gray-50' : ''}
                    />
                    <p className="text-xs text-gray-500">
                      {user?.paymentCode 
                        ? `Using user's payment code: ${user.paymentCode}` 
                        : 'This will appear in the transfer message'}
                    </p>
                  </div>

                  {error && (
                    <p className="text-sm text-red-600">{error}</p>
                  )}

                  {/* Bank Info Display */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-sm text-blue-900 mb-2">Bank Information</h4>
                    <div className="space-y-1 text-sm text-blue-800">
                      <p><strong>Bank:</strong> {bankInfo.bankName} ({bankInfo.bankCode})</p>
                      <p><strong>Account:</strong> {bankInfo.accountNumber}</p>
                      <p><strong>Holder:</strong> {bankInfo.accountHolderName}</p>
                      {bankInfo.branch && <p><strong>Branch:</strong> {bankInfo.branch}</p>}
                    </div>
                  </div>

                  {/* QR Code Display */}
                  {qrCodeUrl && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>QR Code</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={copyQrUrl}
                          className="flex items-center gap-2"
                        >
                          {copied ? (
                            <>
                              <Check className="h-4 w-4" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4" />
                              Copy URL
                            </>
                          )}
                        </Button>
                      </div>
                      <div className="flex justify-center p-4 bg-gray-50 rounded-lg border">
                        <img
                          src={qrCodeUrl}
                          alt="QR Code"
                          className="max-w-xs"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                      <p className="text-xs text-center text-gray-500">
                        User can scan this QR code to transfer money
                      </p>
                    </div>
                  )}
                </form>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleAddPointsFromQr}
                    disabled={loading || !amount || parseFloat(amount) <= 0}
                  >
                    {loading ? 'Adding...' : 'Confirm & Add Points'}
                  </Button>
                </DialogFooter>
              </>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default AddPointsDialog;

