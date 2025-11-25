import React from 'react';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'medium',
  showCloseButton = true,
  className = ''
}) => {
  if (!isOpen) return null;
  
  const sizes = {
    small: 520,
    medium: 640,
    large: 840,
    full: 1024
  };
  
  return (
    <div className="modal-backdrop">
      <div className="modal-dialog" style={{ maxWidth: sizes[size] || sizes.medium }}>
        <div className="modal-header">
          <h2>{title}</h2>
          {showCloseButton && (
            <button onClick={onClose} className="btn btn-secondary">Cerrar</button>
          )}
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
