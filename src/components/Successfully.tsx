import React from 'react';
import successGif from '../assets/021cdc25443adcea6d224afca74ea8b293c34440.gif';
interface SuccessfullyProps {
  isOpen: boolean;
  onClose: () => void;
}
export const Successfully: React.FC<SuccessfullyProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div
        className="bg-white w-[443px] h-[347px] rounded-3xl shadow-[0_2px_4px_rgba(0,0,0,0.17)] 
                   flex flex-col items-center justify-center relative overflow-hidden"
      >
        {/* Success Illustration */}
        <div className="absolute top-[50px] left-1/2 -translate-x-1/2 flex items-center justify-center">
          <img src={successGif} alt="Success" className="w-[150px] object-contain" />
        </div>

        {/* Success Text */}
        <div className="text-center mt-40">
          <p className="text-[19px] font-medium text-gray-800">
            Task added{' '}
            <span className="text-[#00236f] font-medium">successfully</span> !
          </p>
        </div>

        {/* Optional: Auto close button or manual close */}
        <button
          onClick={onClose}
          className="absolute bottom-8 px-8 py-3 text-[#00236f] font-medium hover:bg-gray-100 rounded-3xl transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
};