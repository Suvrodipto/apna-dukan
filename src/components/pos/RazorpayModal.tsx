import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  ShieldCheck, 
  CheckCircle2, 
  QrCode, 
  CreditCard, 
  Building2, 
  Smartphone, 
  Lock, 
  X
} from 'lucide-react';

interface RazorpayModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  customerName?: string;
  onPaymentSuccess: (paymentId: string, mode: string) => void;
}

export const RazorpayModal: React.FC<RazorpayModalProps> = ({
  isOpen,
  onClose,
  amount,
  customerName = 'Walk-in Customer',
  onPaymentSuccess
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentId, setPaymentId] = useState('');

  if (!isOpen) return null;

  const handlePayNow = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const generatedId = `pay_rzp_${Math.floor(10000000 + Math.random() * 90000000)}`;
      setPaymentId(generatedId);
      setIsProcessing(false);
      setPaymentSuccess(true);

      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 }
      });

      setTimeout(() => {
        onPaymentSuccess(generatedId, selectedMethod.toUpperCase());
        setPaymentSuccess(false);
        onClose();
      }, 1800);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="w-full max-w-md bg-[#101524] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 text-xs">
        <div className="p-4 bg-gradient-to-r from-rose-950 via-amber-950 to-slate-950 border-b border-amber-500/30 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center font-black text-slate-950 text-sm shadow">
              Rzp
            </div>
            <div>
              <div className="font-extrabold text-sm tracking-wide flex items-center gap-1.5 text-amber-300">
                Razorpay Secure Checkout
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <p className="text-[10px] text-amber-200/80">Merchant: APNA DUKAN Retail Store</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Amount Payable</div>
            <div className="text-xl font-black text-amber-400 font-mono mt-0.5">₹{amount.toLocaleString()}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-slate-400">Customer</div>
            <div className="font-bold text-white">{customerName}</div>
          </div>
        </div>

        {paymentSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto border border-amber-500/40 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-black text-white">RAZORPAY PAYMENT SUCCESSFUL!</h3>
            <p className="text-xs text-slate-300 font-mono">Payment ID: {paymentId}</p>
            <div className="text-[11px] text-amber-400 font-semibold">Completing sale & printing thermal receipt...</div>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Select Payment Option
              </label>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('upi')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    selectedMethod === 'upi'
                      ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-amber-400 mb-1" />
                  <span className="text-[11px]">UPI (GPay/Paytm)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('card')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    selectedMethod === 'card'
                      ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-rose-400 mb-1" />
                  <span className="text-[11px]">Debit/Credit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('netbanking')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    selectedMethod === 'netbanking'
                      ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-emerald-400 mb-1" />
                  <span className="text-[11px]">Netbanking</span>
                </button>
              </div>
            </div>

            {selectedMethod === 'upi' && (
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <QrCode className="w-4 h-4 text-amber-400" />
                  <span>Scan & Pay via any UPI App</span>
                </div>
                <div className="flex items-center justify-around py-2">
                  <span className="px-2 py-1 bg-slate-900 text-emerald-400 rounded font-bold text-[10px]">Google Pay</span>
                  <span className="px-2 py-1 bg-slate-900 text-amber-400 rounded font-bold text-[10px]">PhonePe</span>
                  <span className="px-2 py-1 bg-slate-900 text-rose-400 rounded font-bold text-[10px]">Paytm</span>
                  <span className="px-2 py-1 bg-slate-900 text-amber-300 rounded font-bold text-[10px]">BHIM</span>
                </div>
              </div>
            )}

            {selectedMethod === 'card' && (
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 font-mono text-[11px]">
                <input
                  type="text"
                  placeholder="Card Number: 4532 •••• •••• 8910"
                  defaultValue="4532 8921 9012 8842"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    defaultValue="08/28"
                    className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                  />
                  <input
                    type="password"
                    placeholder="CVV"
                    defaultValue="892"
                    className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
              </div>
            )}

            {selectedMethod === 'netbanking' && (
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <select className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs">
                  <option>HDFC Bank</option>
                  <option>State Bank of India (SBI)</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                </select>
              </div>
            )}

            <button
              onClick={handlePayNow}
              disabled={isProcessing}
              className="w-full py-3 bg-gradient-to-r from-amber-500 via-yellow-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Lock className="w-4 h-4 fill-current" />
              <span>{isProcessing ? 'Processing Payment...' : `PAY ₹${amount} VIA RAZORPAY`}</span>
            </button>

            <div className="text-center text-[10px] text-slate-500 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3 text-slate-500" />
              256-bit SSL Encrypted • Powered by Razorpay Sandbox
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
