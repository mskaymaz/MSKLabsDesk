import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, id, style, className = '', ...props }, ref) => {
    const inputId = id || props.name;
    const errorId = error ? `${inputId}-error` : undefined;

    return (
      <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
        {label && (
          <label
            htmlFor={inputId}
            className="form-label"
            style={{
              display: 'block',
              fontSize: 'var(--font-sm)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--text-secondary)',
              marginBottom: 'var(--space-1)',
            }}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-errormessage={errorId}
          style={{
            width: '100%',
            minHeight: '44px',
            padding: '10px 14px',
            background: 'rgba(0, 0, 0, 0.3)',
            border: error ? '1px solid var(--danger)' : '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
            fontSize: 'var(--font-sm)',
            outline: 'none',
            fontFamily: 'inherit',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            ...style,
          }}
          className={`form-input ${className}`}
          {...props}
        />
        {error && (
          <span
            id={errorId}
            style={{
              display: 'block',
              color: 'var(--danger)',
              fontSize: 'var(--font-xs)',
              marginTop: 'var(--space-1)',
            }}
          >
            {error}
          </span>
        )}
        {!error && helperText && (
          <span
            style={{
              display: 'block',
              color: 'var(--text-muted)',
              fontSize: 'var(--font-xs)',
              marginTop: 'var(--space-1)',
            }}
          >
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: Array<{ value: string; label: string }>;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options = [], children, id, style, className = '', ...props }, ref) => {
    const selectId = id || props.name;
    const errorId = error ? `${selectId}-error` : undefined;

    return (
      <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
        {label && (
          <label
            htmlFor={selectId}
            style={{
              display: 'block',
              fontSize: 'var(--font-sm)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--text-secondary)',
              marginBottom: 'var(--space-1)',
            }}
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          aria-invalid={!!error}
          aria-errormessage={errorId}
          style={{
            width: '100%',
            minHeight: '44px',
            padding: '10px 14px',
            background: '#0F1522',
            border: error ? '1px solid var(--danger)' : '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
            fontSize: 'var(--font-sm)',
            outline: 'none',
            fontFamily: 'inherit',
            ...style,
          }}
          className={`form-select ${className}`}
          {...props}
        >
          {children
            ? children
            : options.map((opt) => (
                <option key={opt.value} value={opt.value} style={{ background: '#0F1522' }}>
                  {opt.label}
                </option>
              ))}
        </select>
        {error && (
          <span id={errorId} style={{ display: 'block', color: 'var(--danger)', fontSize: 'var(--font-xs)', marginTop: 'var(--space-1)' }}>
            {error}
          </span>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, id, style, ...props }) => {
  const boxId = id || props.name;
  return (
    <label
      htmlFor={boxId}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        minHeight: '44px',
        cursor: 'pointer',
        fontSize: 'var(--font-sm)',
        color: 'var(--text-primary)',
        ...style,
      }}
    >
      <input
        type="checkbox"
        id={boxId}
        style={{
          width: '20px',
          height: '20px',
          accentColor: 'var(--accent-primary)',
          cursor: 'pointer',
        }}
        {...props}
      />
      {label && <span>{label}</span>}
    </label>
  );
};

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  checked?: boolean;
}

export const Switch: React.FC<SwitchProps> = ({ label, checked, onChange, id, ...props }) => {
  const switchId = id || props.name;
  return (
    <label
      htmlFor={switchId}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        minHeight: '44px',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      <div
        style={{
          width: '42px',
          height: '24px',
          borderRadius: '12px',
          background: checked ? 'var(--accent-primary, #6366f1)' : 'var(--switch-off-bg, #94a3b8)',
          border: checked ? '1px solid var(--accent-primary, #6366f1)' : '1px solid #64748b',
          position: 'relative',
          transition: 'all 0.2s ease',
          boxSizing: 'border-box',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            background: '#ffffff',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
            position: 'absolute',
            top: '2px',
            left: checked ? '20px' : '2px',
            transition: 'left 0.2s ease',
          }}
        />
      </div>
      <input
        type="checkbox"
        id={switchId}
        checked={checked}
        onChange={onChange}
        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
        {...props}
      />
      {label && <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-primary)' }}>{label}</span>}
    </label>
  );
};
