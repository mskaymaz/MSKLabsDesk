import React, { useState } from 'react';
import { Gift, Copy, Check, X } from 'lucide-react';

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketNo: string;
  userEmail: string;
  userName: string;
}

export const CouponModal: React.FC<CouponModalProps> = ({
  isOpen,
  onClose,
  ticketNo,
  userEmail,
  userName,
}) => {
  const [couponCode, setCouponCode] = useState(() => 'MSK-' + Math.random().toString(36).substring(2, 8).toUpperCase());
  const [discountType, setDiscountType] = useState('PRO_1MONTH');
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = () => {
    setSent(true);
    setTimeout(() => {
      setSent(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', background: 'rgba(245, 158, 11, 0.15)', borderRadius: '10px', color: 'var(--accent-amber)' }}>
              <Gift size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF' }}>Kupon & Teşekkür Tanımla</h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Bilet: {ticketNo}</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
            Değerli geri bildirim veya hata bildirimi yapan <strong>{userName}</strong> ({userEmail}) kullanıcısına özel kupon kodu oluşturun.
          </p>

          <div className="form-group">
            <label className="form-label">Kupon Kodu</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                className="form-input"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                style={{ fontWeight: 700, letterSpacing: '1px', color: 'var(--accent-amber)' }}
              />
              <button type="button" className="btn btn-secondary" onClick={handleCopy}>
                {copied ? <Check size={16} color="var(--accent-emerald)" /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Hediye / Kupon Türü</label>
            <select
              className="form-select"
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value)}
            >
              <option value="PRO_1MONTH">1 Ay Ücretsiz MSKLabs Pro Üyelik</option>
              <option value="PRO_3MONTHS">3 Ay Ücretsiz MSKLabs Pro Üyelik</option>
              <option value="DISCOUNT_50">%50 İndirim Kuponu</option>
              <option value="SPECIAL_THANKS">Teşekkür Plaketi & Rozeti</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>İptal</button>
          <button type="button" className="btn btn-primary" onClick={handleSend} disabled={sent}>
            {sent ? 'Gönderildi!' : 'E-Posta ile Kuponu İlet'}
          </button>
        </div>
      </div>
    </div>
  );
};
