import React from 'react';

const Input = ({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  error, 
  required = false,
  disabled = false,
  className = ''
}) => {
  return (
    <div className="form-group">
      {label && (
        <label className="label">
          {label}
          {required && <span> *</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={[
          'input',
          error ? 'is-error' : '',
          className
        ].join(' ')}
      />
      {error && (
        <p className="error-text">{error}</p>
      )}
    </div>
  );
};

export default Input;
