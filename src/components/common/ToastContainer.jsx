import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useApp();

  if (!toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        if (toast.type === 'danger') Icon = AlertCircle;
        else if (toast.type === 'warning') Icon = AlertCircle;
        else if (toast.type === 'info') Icon = Info;

        return (
          <div key={toast.id} className={`toast-item ${toast.type}`}>
            <Icon size={18} style={{ color: toast.type === 'success' ? 'var(--success)' : toast.type === 'warning' ? 'var(--amber-400)' : toast.type === 'danger' ? 'var(--danger)' : 'var(--info)' }} />
            <div className="toast-message">{toast.message}</div>
            <button className="toast-close" onClick={() => removeToast(toast.id)}>
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
