import React from 'react';

const Select = ({ 
  label, 
  options = [], 
  value, 
  onChange, 
  placeholder = 'Seleccione una opción',
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
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={[
          'select',
          error ? 'is-error' : '',
          className
        ].join(' ')}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="error-text">{error}</p>
      )}
    </div>
  );
};

export default Select;
