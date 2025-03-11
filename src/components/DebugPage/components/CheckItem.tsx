import React from 'react';

interface CheckItemProps {
  title: string;
  status: 'loading' | 'success' | 'error';
  description: string;
  errorMessage: string;
  helpAction?: () => void;
  helpText?: string;
}

const CheckItem: React.FC<CheckItemProps> = ({
  title,
  status,
  description,
  errorMessage,
  helpAction,
  helpText
}) => {
  return (
    <div className={`check-item check-item-${status}`}>
      <div className="check-item-header">
        <h3>{title.toUpperCase()}</h3>
        <div className="check-status-icon">
          {status === 'loading' && <div className="loading-spinner"></div>}
          {status === 'success' && <div className="success-icon">✓</div>}
          {status === 'error' && <div className="error-icon">✗</div>}
        </div>
      </div>
      
      <p className="check-description">
        {status === 'loading' ? `>> ${description}` : 
         status === 'success' ? '>> Status: OK' : 
         `>> Error: ${errorMessage}`}
      </p>
      
      {status === 'error' && helpAction && helpText && (
        <button className="help-link" onClick={helpAction}>
          {`>> ${helpText}`}
        </button>
      )}
    </div>
  );
};

export default CheckItem;
