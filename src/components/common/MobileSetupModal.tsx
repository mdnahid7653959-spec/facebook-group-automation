import React, { useState } from 'react';
import {
  Smartphone,
  Download,
  CheckCircle2,
  ExternalLink,
  Copy,
  X,
  Sparkles,
  Check,
  Chrome,
} from 'lucide-react';

interface MobileSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast?: (msg: string) => void;
}

export const MobileSetupModal: React.FC<MobileSetupModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const downloadUrl =
    'https://raw.githubusercontent.com/mdnahid7653959-spec/facebook-group-automation/main/AI-Group-Poster-Mobile.zip';
  const repoUrl =
    'https://github.com/mdnahid7653959-spec/facebook-group-automation';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(downloadUrl);
      setCopied(true);
      if (onShowToast) onShowToast('📋 মোবাইলের ডাউনলোড লিংক কপি হয়েছে!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 animate-fadeIn">
      <div className="w-full max-w-[390px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-800 dark:text-slate-100 max-h-[92vh]">
        {/* Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-white/20 backdrop-blur-sm">
              <Smartphone size={18} className="text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold leading-tight">Mobile Setup Guide</h3>
              <p className="text-[10px] text-indigo-100">Android ফোনে এক্সটেনশন ব্যবহারের নিয়ম</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 space-y-3.5 text-xs overflow-y-auto flex-1">
          {/* Quick Notice */}
          <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex items-start gap-2.5">
            <Sparkles size={16} className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
              <strong className="text-indigo-950 dark:text-indigo-200">১০০% মোবাইল সাপোর্টেড:</strong> আপনি অ্যান্ড্রয়েড ফোনে <strong>Kiwi Browser</strong> দিয়ে কম্পিউটার ছাড়াই সব গ্রুপে পোস্ট ও অটো-জয়েন করতে পারবেন!
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-2.5">
            {/* Step 1 */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 space-y-1">
              <div className="font-bold text-[11px] text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">1</span>
                <span>Kiwi Browser ইন্সটল করুন</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 pl-6.5 leading-normal">
                ফোনের Google Play Store থেকে <strong>Kiwi Browser</strong> (বা <strong>Lemur Browser</strong>) ডাউনলোড করে ওপেন করুন।
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 space-y-1.5">
              <div className="font-bold text-[11px] text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">2</span>
                <span>মোবাইল জিপ ফাইল ডাউনলোড করুন</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 pl-6.5 leading-normal">
                ফোনে <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded text-blue-600 dark:text-blue-400 font-mono font-bold">AI-Group-Poster-Mobile.zip</code> ডাউনলোড করুন।
              </p>
              <div className="pl-6.5 pt-1 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                >
                  {copied ? <Check size={11} /> : <Copy size={11} />}
                  <span>{copied ? 'Copied Link!' : 'Copy Direct Zip Link'}</span>
                </button>
                <a
                  href={downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-semibold flex items-center gap-1 transition-colors"
                >
                  <Download size={11} />
                  <span>Download Zip</span>
                </a>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 space-y-1">
              <div className="font-bold text-[11px] text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">3</span>
                <span>Kiwi Browser-এ এক্সটেনশন লোড করুন</span>
              </div>
              <ol className="text-[10px] text-slate-500 dark:text-slate-400 pl-6.5 space-y-0.5 list-disc ml-2">
                <li>Kiwi Browser-এর ৩টি ডট (<strong>⋮</strong>) মেনুতে যান ➔ <strong>Extensions</strong> চাপুন।</li>
                <li>উপরে <strong>Developer mode</strong> অন করুন।</li>
                <li><strong>+ (from .zip)</strong> বাটনে ট্যাপ করে আপনার ডাউনলোড করা জিপ ফাইলটি সিলেক্ট করুন।</li>
              </ol>
            </div>

            {/* Step 4 */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 space-y-1">
              <div className="font-bold text-[11px] text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">4</span>
                <span>ফেসবুকে Desktop Site অন করে পোস্ট শুরু</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 pl-6.5 leading-normal">
                Kiwi Browser-এ <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded font-mono font-bold">facebook.com</code> এ গিয়ে ৩টি ডট (<strong>⋮</strong>) থেকে <strong>"Desktop site"</strong> টিক দিন। এরপর ৩ ডট মেনুর একদম নিচে এক্সটেনশন আইকন থেকে সরাসরি ক্যাপশন, ফটো ও ভিডিও দিয়ে পোস্ট শুরু করুন!
              </p>
            </div>

            {/* Step 5: Direct Mobile App Icon */}
            <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-1">
              <div className="font-bold text-[11px] text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>ফোনের স্ক্রিনে সরাসরি অ্যাপের মতো ব্যবহার (Add to Home Screen)</span>
              </div>
              <p className="text-[10px] text-emerald-800 dark:text-emerald-300/90 leading-normal">
                এক্সটেনশনের ড্যাশবোর্ড ওপেন করে Kiwi-এর ৩টি ডট (<strong>⋮</strong>) চেপে <strong>"Add to Home screen"</strong> বা <strong>"Install app"</strong> চাপুন। তাহলে আপনার ফোনের হোম স্ক্রিনে ফেসবুক পোস্টার অ্যাপের নিজস্ব আইকন চলে আসবে এবং ফুল-স্ক্রিন অ্যাপ আকারে ওপেন হবে!
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <a
            href={repoUrl}
            target="_blank"
            rel="noreferrer"
            className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <Chrome size={12} />
            <span>View on GitHub</span>
            <ExternalLink size={10} />
          </a>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

