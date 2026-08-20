import React, { useState } from 'react';
import type { OCRResult } from '../../types';
import { processBillOCR } from '../../services/ocrService';
import { pouchStore } from '../../db/pouchStore';
import { SAMPLE_OCR_BILLS } from '../../db/mockData';
import { 
  ScanLine, 
  Upload, 
  FileText, 
  CheckCircle2, 
  ShoppingBag, 
  RefreshCw,
  Plus
} from 'lucide-react';

interface BillOCRScannerProps {
  onLoadIntoPOS?: () => void;
}

export const BillOCRScanner: React.FC<BillOCRScannerProps> = ({ onLoadIntoPOS }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrProgress, setOcrProgress] = useState<{ status: string; progress: number }>({ status: '', progress: 0 });
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(SAMPLE_OCR_BILLS[0]);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);

    const result = await processBillOCR(file, (status, progress) => {
      setOcrProgress({ status, progress });
    });

    setOcrResult(result);
    setIsProcessing(false);
  };

  const handleSampleBillSelect = (sampleIndex: number) => {
    setOcrResult(SAMPLE_OCR_BILLS[sampleIndex]);
  };

  const handleImportToInventory = async () => {
    if (!ocrResult) return;

    let count = 0;
    const existingProducts = await pouchStore.getProducts();

    for (const item of ocrResult.lineItems) {
      const match = existingProducts.find(
        p => p.name.toLowerCase().includes(item.name.toLowerCase()) || item.name.toLowerCase().includes(p.name.toLowerCase())
      );

      if (match) {
        await pouchStore.saveProduct({
          ...match,
          stockQty: match.stockQty + item.quantity,
          costPrice: item.unitPrice > 0 ? item.unitPrice : match.costPrice
        });
      } else {
        await pouchStore.saveProduct({
          id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name: item.name,
          category: 'Wholesale Imports',
          barcode: `${Math.floor(8900000000000 + Math.random() * 900000000000)}`,
          costPrice: item.unitPrice,
          sellingPrice: Math.round(item.unitPrice * 1.2),
          stockQty: item.quantity,
          minReorderQty: 10,
          unit: 'unit',
          lastUpdated: new Date().toISOString().split('T')[0]
        });
      }
      count++;
    }

    setImportStatus(`Successfully imported/updated ${count} products into Inventory Catalogue!`);
    setTimeout(() => setImportStatus(null), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <ScanLine className="w-6 h-6 text-blue-400" />
            Bill & Invoice OCR Parser Component
            <span className="px-2.5 py-0.5 text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full font-mono">
              Tradable Asset #2
            </span>
          </h2>
          <p className="text-xs text-slate-400">Extract line items, quantities, and totals from physical paper bills & supplier invoices</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold">Demo Samples:</span>
          <button
            onClick={() => handleSampleBillSelect(0)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium"
          >
            Wholesale Invoice
          </button>
          <button
            onClick={() => handleSampleBillSelect(1)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium"
          >
            Supermart Slip
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 text-center space-y-4">
            <label className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all bg-slate-950/40">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <span className="text-sm font-bold text-white mb-1">Upload Bill Image or Take Photo</span>
              <span className="text-xs text-slate-400 mb-3">Supports JPG, PNG, WEBP (Max 10MB)</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              />
              <span className="px-3 py-1 bg-slate-800 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700">
                Browse Files
              </span>
            </label>

            {isProcessing && (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-400" />
                    {ocrProgress.status}
                  </span>
                  <span className="font-mono text-blue-400 font-bold">{ocrProgress.progress}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-500 h-full transition-all duration-300"
                    style={{ width: `${ocrProgress.progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {ocrResult && (
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-400" />
                  Raw Tesseract OCR Text
                </span>
                <span className="text-emerald-400 font-mono font-bold">
                  {Math.round(ocrResult.confidenceScore * 100)}% Confidence
                </span>
              </div>
              <pre className="font-mono text-[11px] text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-900 max-h-48 overflow-y-auto whitespace-pre-wrap">
                {ocrResult.rawText}
              </pre>
            </div>
          )}
        </div>

        <div className="lg:col-span-7 flex flex-col h-full bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
          {ocrResult ? (
            <>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="font-bold text-white text-base">{ocrResult.storeName}</h3>
                  <p className="text-xs text-slate-400">
                    Bill #{ocrResult.billNumber} • Date: {ocrResult.date}
                  </p>
                </div>
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-semibold">
                  Parsed Cleanly
                </span>
              </div>

              {importStatus && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{importStatus}</span>
                </div>
              )}

              <div className="flex-1 overflow-y-auto space-y-2">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Item Description</th>
                      <th className="py-2.5 px-3">Qty</th>
                      <th className="py-2.5 px-3">Rate (₹)</th>
                      <th className="py-2.5 px-3 text-right">Total (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {ocrResult.lineItems.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 font-semibold text-white">{item.name}</td>
                        <td className="py-2.5 px-3 font-mono">{item.quantity}</td>
                        <td className="py-2.5 px-3 font-mono">₹{item.unitPrice}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-emerald-400 text-right">
                          ₹{item.totalPrice}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-mono text-slate-200">₹{ocrResult.calculatedSubtotal}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>GST Tax</span>
                  <span className="font-mono text-slate-200">₹{ocrResult.tax}</span>
                </div>
                <div className="flex justify-between font-extrabold text-sm text-white pt-1.5 border-t border-slate-800">
                  <span>Grand Total</span>
                  <span className="text-emerald-400 font-mono text-base">₹{ocrResult.grandTotal}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleImportToInventory}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Import Items into Inventory</span>
                </button>

                {onLoadIntoPOS && (
                  <button
                    onClick={onLoadIntoPOS}
                    className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs flex items-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4 text-emerald-400" />
                    <span>Load into POS Cart</span>
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs">
              <ScanLine className="w-12 h-12 stroke-1 mb-2 text-slate-600" />
              <span>Upload a bill image to begin client-side OCR extraction.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
