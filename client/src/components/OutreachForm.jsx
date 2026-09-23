import React, { useState, useEffect } from 'react';
import { Send, Sparkles, Paperclip, CheckCircle2, AlertCircle, Info, RefreshCw } from 'lucide-react';
import { outreachService } from '../services/outreachService';

const OutreachForm = ({ initialBuyer, onSuccess }) => {
  const [formData, setFormData] = useState({
    buyerId: initialBuyer?.id || '',
    recipientEmail: initialBuyer?.email || '',
    companyName: initialBuyer?.companyName || '',
    subject: 'Export Inquiry: Direct Manufacturer Supply for {{company}}',
    body: `Dear Purchasing Team at {{company}},

We are direct exporters and manufacturers of high-quality handcrafted and modern collections.

We are expanding our wholesale distribution partners across international markets and would like to explore a potential partnership with {{company}}.

Please review our wholesale product offerings. We would be delighted to share our product catalog and pricing sheet.

Best regards,
International Trade & Export Desk`
  });

  const [attachment, setAttachment] = useState(null);
  const [sending, setSending] = useState(false);
  const [generatingAi, setGeneratingAi] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    if (initialBuyer) {
      setFormData((prev) => ({
        ...prev,
        buyerId: initialBuyer.id || '',
        recipientEmail: initialBuyer.email || '',
        companyName: initialBuyer.companyName || ''
      }));
    }
  }, [initialBuyer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        setStatusMessage({ type: 'error', text: 'File size exceeds 10 MB limit' });
        return;
      }
      setAttachment(file);
    }
  };

  const handleGenerateAi = async () => {
    setGeneratingAi(true);
    setStatusMessage(null);
    try {
      const res = await outreachService.generateAiPitch({
        companyName: formData.companyName || 'Target Buyer',
        country: initialBuyer?.country || 'International Market',
        industry: initialBuyer?.industry || 'Wholesale Distribution',
        product: 'Export Collections'
      });

      if (res.success) {
        setFormData((prev) => ({
          ...prev,
          subject: res.subject || prev.subject,
          body: res.body || prev.body
        }));
        setStatusMessage({
          type: 'success',
          text: res.isAiGenerated
            ? 'Personalized pitch generated via Google Gemini AI!'
            : 'Generated high-converting B2B trade pitch template.'
        });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Failed to generate AI pitch. Please write custom pitch.' });
    } finally {
      setGeneratingAi(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.recipientEmail || !formData.companyName || !formData.subject || !formData.body) {
      setStatusMessage({ type: 'error', text: 'Please fill in all required email fields.' });
      return;
    }

    setSending(true);
    setStatusMessage(null);

    try {
      const data = new FormData();
      data.append('buyerId', formData.buyerId);
      data.append('recipientEmail', formData.recipientEmail);
      data.append('companyName', formData.companyName);
      data.append('subject', formData.subject);
      data.append('body', formData.body);
      if (attachment) {
        data.append('attachment', attachment);
      }

      const res = await outreachService.sendOutreach(data);

      if (res.success) {
        setStatusMessage({
          type: 'success',
          text: res.isDemo
            ? 'Email successfully processed in Email Demo Mode!'
            : 'Outreach email successfully sent to buyer!'
        });
        if (onSuccess) onSuccess(res);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to dispatch email';
      setStatusMessage({ type: 'error', text: msg });
    } finally {
      setSending(false);
    }
  };

  // Live Variable Resolution Preview
  const previewBody = formData.body.replace(/\{\{company\}\}/g, formData.companyName || '[Company Name]');
  const previewSubject = formData.subject.replace(/\{\{company\}\}/g, formData.companyName || '[Company Name]');

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden p-6 md:p-8">
      <div className="flex items-center justify-between border-b border-slate-200 pb-5 mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">Email Outreach to Selected Buyer</h3>
          <p className="text-xs text-slate-500 font-medium">
            Draft and send direct B2B export proposals with automatic company name variable replacement
          </p>
        </div>

        <button
          type="button"
          onClick={handleGenerateAi}
          disabled={generatingAi}
          className="inline-flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold text-xs hover:from-indigo-700 hover:to-blue-700 transition-all shadow-md shadow-indigo-500/20 disabled:opacity-50"
        >
          {generatingAi ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4 mr-2" />
          )}
          {generatingAi ? 'Generating AI Pitch...' : 'AI Pitch Personalization'}
        </button>
      </div>

      {statusMessage && (
        <div
          className={`mb-6 p-4 rounded-xl border flex items-center text-sm font-medium ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 mr-3 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 mr-3 text-rose-600 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recipient Email */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Target Buyer Email <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              name="recipientEmail"
              required
              value={formData.recipientEmail}
              onChange={handleChange}
              placeholder="e.g. sales@internationalbuyer.com"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            />
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Company Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="companyName"
              required
              value={formData.companyName}
              onChange={handleChange}
              placeholder="e.g. Modern Home Decor Group"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Email Subject */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Email Subject <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="subject"
            required
            value={formData.subject}
            onChange={handleChange}
            placeholder="Export Inquiry..."
            className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
          />
          <p className="mt-1 text-[11px] text-slate-500">Supports variable placeholder <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-600 font-mono">{"{{company}}"}</code></p>
        </div>

        {/* Email Pitch Body */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Email Pitch / Message Body <span className="text-rose-500">*</span>
          </label>
          <textarea
            name="body"
            required
            rows="7"
            value={formData.body}
            onChange={handleChange}
            placeholder="Write your trade proposal..."
            className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-sans leading-relaxed"
          ></textarea>
        </div>

        {/* Product Catalog / Price List Attachment */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Product Catalog / Price List Attachment (Optional)
          </label>
          <div className="flex items-center space-x-4">
            <label className="cursor-pointer inline-flex items-center px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors shadow-sm">
              <Paperclip className="w-4 h-4 mr-2 text-blue-600" />
              Choose Catalog File
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.docx,.xlsx,.png,.jpg,.jpeg"
                className="hidden"
              />
            </label>
            {attachment ? (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 truncate max-w-xs">
                📎 {attachment.name} ({(attachment.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            ) : (
              <span className="text-xs text-slate-400 italic">Supports PDF, DOCX, XLSX, PNG, JPG (Max 10 MB)</span>
            )}
          </div>
        </div>

        {/* Real-time Email Preview Accordion */}
        <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200/80">
          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-2 flex items-center">
            <Info className="w-4 h-4 mr-1.5 text-blue-600" /> Live Recipient Email Preview
          </h4>
          <div className="bg-white p-4 rounded-xl border border-blue-100 text-xs text-slate-800 space-y-2">
            <p className="font-bold text-slate-900 border-b border-slate-100 pb-2">Subject: {previewSubject}</p>
            <div className="whitespace-pre-line leading-relaxed text-slate-700 pt-1">
              {previewBody}
            </div>
          </div>
        </div>

        {/* Submit Action Button */}
        <div className="flex items-center justify-end space-x-4 pt-2">
          <button
            type="submit"
            disabled={sending}
            className="w-full md:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center disabled:opacity-50"
          >
            {sending ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Sending Mail to Buyer...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Mail to Buyer
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OutreachForm;
