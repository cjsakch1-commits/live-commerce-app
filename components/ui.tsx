
import React from 'react';

// FIX: Add 'size' prop to ButtonProps to allow for different button sizes.
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md';
}

// FIX: Update Button component to handle the new 'size' prop.
// This allows for a smaller button variant, e.g., in table cells, resolving the build error.
// The default size 'md' ensures existing buttons are not affected.
export const Button: React.FC<ButtonProps> = ({ children, className, variant = 'primary', size = 'md', ...props }) => {
  const baseClasses = "rounded-md font-semibold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  const variantClasses = {
    primary: 'bg-primary hover:bg-primary-hover focus:ring-primary',
    secondary: 'bg-secondary hover:bg-green-600 focus:ring-secondary',
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-600',
  };
  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2',
  };
  return (
    <button className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className, title }) => (
  <div className={`bg-surface rounded-lg shadow p-6 ${className}`}>
    {title && <h2 className="text-xl font-bold mb-4 text-text-primary">{title}</h2>}
    {children}
  </div>
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, id, ...props }) => (
  <div className="w-full">
    {label && <label htmlFor={id} className="block text-sm font-medium text-text-secondary mb-1">{label}</label>}
    <input
      id={id}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
      {...props}
    />
  </div>
);

interface TableProps {
  headers: string[];
  children: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({ headers, children }) => (
  <div className="overflow-x-auto bg-surface shadow rounded-lg">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {headers.map((header) => (
            <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {children}
      </tbody>
    </table>
  </div>
);

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-surface rounded-lg shadow-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-text-primary">{title}</h3>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary">&times;</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};
