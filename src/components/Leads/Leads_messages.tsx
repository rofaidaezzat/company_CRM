import React from 'react';
import { X } from 'lucide-react';
import mailIcon from '../../assets/mail-04.svg';
import '../../styles/leads-modal-mobile.css';

const LeadsMessages = ({ onClose }: { onClose?: () => void }) => {
  return (
    <div className="leads-tw-modal w-[462px] h-[528px] opacity-100 flex flex-col">
      {/* the first part */}
      <div className="leads-tw-modal-header w-[462px] h-[91px] flex justify-between items-start opacity-100 rounded-tl-[12px] rounded-tr-[12px] p-[20px] bg-[rgba(245,246,250,1)] border-b-[1px] border-solid border-[rgba(212,213,216,1)]">
        <div className="flex gap-[12px]">
          <img src={mailIcon} alt="Mail" className="w-[24px] h-[24px]" />
          <div className="flex flex-col gap-1">
            <h2
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                fontSize: 19,
                color: "#141414",
                lineHeight: "100%",
                margin: 0,
              }}
            >
              Lead Messages
            </h2>
            <span className="text-[14px] text-[#6B7280]">for "leads name"</span>
          </div>
        </div>
        <button onClick={onClose} className="w-[32px] h-[32px] bg-white border border-[#D4D5D8] rounded-full flex items-center justify-center shrink-0 shadow-sm">
          <X className="w-[16px] h-[16px] text-[#111827]" />
        </button>
      </div>

      {/* second */}
      <div 
        className="leads-tw-modal-body w-[462px] h-[437px] opacity-100 rounded-br-[12px] rounded-bl-[12px] bg-[rgba(245,246,250,1)] relative"
        style={{ minHeight: 437 }}
      >
        {/* the card message */}
        <div className="leads-modal-inner w-[calc(100%-40px)] h-[124px] flex flex-col gap-[12px] opacity-100 p-[12px] mx-auto mt-[32px] rounded-[12px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.06)] bg-[rgba(255,255,255,1)]">
          {/* Date */}
          <div
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
              fontSize: 13,
              lineHeight: "140%",
              width: 119,
              height: 18,
              color: "#6B7280", // Using standard gray for date since not specified
            }}
          >
            25/03/2026 , 07:22
          </div>

          {/* Paragraph */}
          <div
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
              fontSize: 13,
              lineHeight: "140%",
              color: "rgba(70, 70, 70, 1)",
              width: "100%",
              height: 72,
            }}
          >
            Lorem ipsum dolor sit amet consectetur. Nec enim morbi tristique amet urna. Commodo venenatis libero in id aliquet morbi purus. Interdum commodo at amet eget. Tempor morbi tristique dapibus a dolor blandit.
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadsMessages;
