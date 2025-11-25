import React from 'react';

const Form = ({ 
  children, 
  onSubmit, 
  className = '',
  id = ''
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit && onSubmit(e);
  };
  
  return (
    <form id={id} className={["form", className].join(" ")} onSubmit={handleSubmit}>
      {children}
    </form>
  );
};

const FormGroup = ({ children, className = '' }) => {
  return <div className={["form-group", className].join(" ")}>{children}</div>;
};

const FormActions = ({ children, className = '' }) => {
  return <div className={["form-actions", className].join(" ")}>{children}</div>;
};

export { Form, FormGroup, FormActions };
