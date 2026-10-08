import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { CheckCircle, Edit3, Globe, ShieldAlert } from 'lucide-react';

export interface TranslationAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  status: 'GENERATED' | 'REVIEW' | 'EDIT' | 'APPROVED' | 'PLACEHOLDER_MISMATCH' | 'QUEUED';
  qualityScore: number;
  warnings?: string[];
  glossaryWarnings?: string[];
  onApprove: (finalText: string) => void;
}

export const TranslationAuditModal: React.FC<TranslationAuditModalProps> = ({
  isOpen,
  onClose,
  originalText,
  translatedText,
  sourceLang,
  targetLang,
  status,
  qualityScore,
  warnings = [],
  glossaryWarnings = [],
  onApprove,
}) => {
  const [editedText, setEditedText] = useState(translatedText);
  const [isEditing, setIsEditing] = useState(false);

  if (!isOpen) return null;

  const hasWarnings = warnings.length > 0 || glossaryWarnings.length > 0 || status === 'PLACEHOLDER_MISMATCH';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Çeviri İnceleme & Audit (${sourceLang.toUpperCase()} → ${targetLang.toUpperCase()})`}>
      <div style={{ padding: '4px' }}>
        {/* Quality Score & Status Badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe size={18} style={{ color: 'var(--accent-primary)' }} />
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Durum:</span>
            <span
              style={{
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: '700',
                background: status === 'APPROVED' ? 'rgba(34, 197, 94, 0.2)' : status === 'PLACEHOLDER_MISMATCH' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(234, 179, 8, 0.2)',
                color: status === 'APPROVED' ? '#4ADE80' : status === 'PLACEHOLDER_MISMATCH' ? '#FCA5A5' : '#FDE047'
              }}
            >
              {status}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Kalite Skoru:</span>
            <span style={{ fontWeight: 800, color: qualityScore > 80 ? '#4ADE80' : '#FCA5A5' }}>%{qualityScore}</span>
          </div>
        </div>

        {/* Warnings Banner */}
        {hasWarnings && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FCA5A5', fontWeight: 700, fontSize: '0.85rem', marginBottom: '6px' }}>
              <ShieldAlert size={16} /> Uyarılar & Güvenlik Kısıtları
            </div>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.8rem', color: '#FECACA' }}>
              {warnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
              {glossaryWarnings.map((gw, i) => (
                <li key={i}>{gw}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Side-by-side comparison */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Kaynak Metin ({sourceLang.toUpperCase()})
            </label>
            <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)', padding: '12px', borderRadius: '8px', minHeight: '120px', fontSize: '0.85rem', color: '#E2E8F0', whiteSpace: 'pre-wrap' }}>
              {originalText}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              AI Çevirisi ({targetLang.toUpperCase()})
            </label>
            {isEditing ? (
              <textarea
                style={{ width: '100%', minHeight: '120px', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--accent-primary)', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', color: '#FFF' }}
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
              />
            ) : (
              <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)', padding: '12px', borderRadius: '8px', minHeight: '120px', fontSize: '0.85rem', color: '#E2E8F0', whiteSpace: 'pre-wrap' }}>
                {editedText}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <Button variant="secondary" onClick={() => setIsEditing(!isEditing)}>
            <Edit3 size={16} style={{ marginRight: '6px' }} /> {isEditing ? 'Düzenlemeyi Bitir' : 'Metni Düzenle'}
          </Button>
          <Button
            disabled={status === 'PLACEHOLDER_MISMATCH'}
            onClick={() => onApprove(editedText)}
          >
            <CheckCircle size={16} style={{ marginRight: '6px' }} /> Çeviriyi Onayla (Approve)
          </Button>
        </div>
      </div>
    </Modal>
  );
};
