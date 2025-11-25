// Funciones de utilidad generales

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN'
  }).format(amount);
};

export const formatNumber = (number) => {
  return new Intl.NumberFormat('es-PE').format(number);
};

export const calculatePercentage = (partial, total) => {
  if (total === 0) return 0;
  return Math.round((partial / total) * 100);
};

export const getStatusColor = (status) => {
  const colors = {
    'Completado': 'green',
    'Pendiente': 'yellow',
    'Cancelado': 'red',
    'Proceso': 'blue',
    'Normal': 'green',
    'Bajo': 'yellow',
    'Crítico': 'red'
  };
  return colors[status] || 'gray';
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^\+?[\d\s\-\(\)]+$/;
  return re.test(phone);
};

export const validateDNI = (dni) => {
  const re = /^\d{8}$/;
  return re.test(dni);
};

export const validateRUC = (ruc) => {
  const re = /^\d{11}$/;
  return re.test(ruc);
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }
};

export const exportToCSV = (data, filename) => {
  const csvContent = data.map(row => Object.values(row).join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
};

export const downloadFile = (content, filename, type = 'text/plain') => {
  const blob = new Blob([content], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
};