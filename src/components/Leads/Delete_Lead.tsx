import React from 'react';

const NEUTRAL_25 = '#F5F6FA';
const NEUTRAL_50 = '#EDEFF2';
const NEUTRAL_100 = '#D4D5D8';
const NEUTRAL_950 = '#141414';
const ERROR_RED = '#A80D0B';

interface DeleteLeadProps {
  leadName?: string;
  leadDate?: string;
  onClose?: () => void;
  onConfirm?: () => void;
}

const Delete_Lead: React.FC<DeleteLeadProps> = ({
  leadName = 'John Kraziniski',
  leadDate = '12/5/2026',
  onClose,
  onConfirm,
}) => (
  <div
    onClick={(e) => e.stopPropagation()}
    style={{
      borderRadius: 12,
      background: NEUTRAL_25,
      display: 'flex',
      width: 462,
      paddingTop: 32,
      flexDirection: 'column',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: 22,
      boxSizing: 'border-box',
      overflow: 'hidden',
      boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.12)',
    }}
  >
    <p
      style={{
        width: 422,
        maxWidth: '100%',
        margin: 0,
        padding: '0 20px',
        boxSizing: 'border-box',
        color: NEUTRAL_950,
        textAlign: 'center',
        fontFamily: 'Inter, sans-serif',
        fontSize: 19,
        fontStyle: 'normal',
        fontWeight: 500,
        lineHeight: 'normal',
      }}
    >
      Are you sure you want to delete this Lead ?
    </p>

    <div
      style={{
        width: 422,
        maxWidth: 'calc(100% - 40px)',
        alignSelf: 'stretch',
        margin: '0 20px',
        borderRadius: 12,
        background: NEUTRAL_50,
        display: 'flex',
        padding: 8,
        justifyContent: 'space-between',
        alignItems: 'center',
        boxSizing: 'border-box',
      }}
    >
      <span
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 14,
          fontWeight: 500,
          color: NEUTRAL_950,
        }}
      >
        {leadName}
      </span>
      <span
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 14,
          fontWeight: 500,
          color: ERROR_RED,
        }}
      >
        {leadDate}
      </span>
    </div>

    <div
      style={{
        borderRadius: '0 0 12px 12px',
        background: NEUTRAL_25,
        display: 'flex',
        height: 76,
        width: '100%',
        padding: '8px 20px 20px 20px',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        boxSizing: 'border-box',
      }}
    >
      <button
        type="button"
        onClick={onClose}
        style={{
          borderRadius: 12,
          border: `1px solid ${NEUTRAL_100}`,
          display: 'flex',
          height: 48,
          padding: '8px 24px',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 8,
          flex: '1 0 0',
          background: 'transparent',
          fontFamily: 'Inter, sans-serif',
          fontSize: 15,
          fontWeight: 600,
          color: NEUTRAL_950,
          cursor: 'pointer',
          boxSizing: 'border-box',
        }}
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={onConfirm}
        style={{
          borderRadius: 12,
          background: ERROR_RED,
          display: 'flex',
          height: 48,
          padding: '8px 24px',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 8,
          flex: '1 0 0',
          border: 'none',
          fontFamily: 'Inter, sans-serif',
          fontSize: 15,
          fontWeight: 600,
          color: '#fff',
          cursor: 'pointer',
          boxSizing: 'border-box',
        }}
      >
        Delete
      </button>
    </div>
  </div>
);

export default Delete_Lead;
