import React from 'react';
import { useDeleteDealMutation } from '../../app/service/cruddeals';
import { toast } from 'sonner';

const NEUTRAL_25 = '#F5F6FA';
const NEUTRAL_50 = '#EDEFF2';
const NEUTRAL_100 = '#D4D5D8';
const NEUTRAL_950 = '#141414';
const ERROR_RED = '#A80D0B';

interface DeleteDealProps {
  dealId?: string;
  dealName?: string;
  dealDate?: string;
  onClose?: () => void;
  onConfirm?: () => void;
}

const Delete_Deal: React.FC<DeleteDealProps> = ({
  dealId,
  dealName = 'John Kraziniski',
  dealDate = '12/5/2026',
  onClose,
  onConfirm,
}) => {
  const [deleteDeal, { isLoading }] = useDeleteDealMutation();

  const handleDelete = async () => {
    if (dealId) {
      try {
        await deleteDeal(dealId).unwrap();
        toast.success("Deal deleted successfully");
        if (onConfirm) onConfirm();
      } catch (err: any) {
        console.error("Failed to delete deal:", err);
        const errMsg = err?.data?.message || err?.message || "Failed to delete deal";
        toast.error(Array.isArray(errMsg) ? errMsg.join(", ") : errMsg);
      }
    } else {
      if (onConfirm) onConfirm();
    }
  };

  return (
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
        gap: 24,
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
        Are you sure you want to delete this deal ?
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
          {dealName}
        </span>
        <span
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 14,
            fontWeight: 500,
            color: ERROR_RED,
          }}
        >
          {dealDate}
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
          disabled={isLoading}
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
            cursor: isLoading ? 'not-allowed' : 'pointer',
            boxSizing: 'border-box',
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isLoading}
          style={{
            borderRadius: 12,
            background: isLoading ? 'rgba(212, 213, 216, 1)' : ERROR_RED,
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
            color: isLoading ? '#9CA3AF' : '#fff',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            boxSizing: 'border-box',
          }}
        >
          {isLoading ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
};

export default Delete_Deal;
