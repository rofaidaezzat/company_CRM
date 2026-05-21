import { X } from 'lucide-react';
import chevronRight from '../../assets/chevron-right.svg';
import messageIcon from '../../assets/message-text-02.svg';
import trashIcon from '../../assets/trash-02.svg';
import markerIcon from '../../assets/marker-01.svg';
import messageText021 from '../../assets/message-text-02 (1).svg';
import '../../styles/leads-modal-mobile.css';

const Notes = ({ onClose }: { onClose?: () => void }) => {
  return (
    <div className="leads-tw-modal w-[462px] h-[528px] opacity-100 flex flex-col">
      {/* the first part */}
      <div className="leads-tw-modal-header w-[462px] h-[91px] flex justify-between items-start opacity-100 rounded-tl-[12px] rounded-tr-[12px] p-[20px] bg-[rgba(245,246,250,1)] border-b-[1px] border-solid border-[rgba(212,213,216,1)]">
        <div className="flex gap-[12px]">
          <img src={messageIcon} alt="Notes" className="w-[24px] h-[24px]" />
          <div className="flex flex-col gap-1">
            <h2 className="text-[18px] font-bold text-[#111827] leading-none">Notes</h2>
            <span className="text-[14px] text-[#6B7280]">for "leads name"</span>
          </div>
        </div>
        <button onClick={onClose} className="w-[32px] h-[32px] bg-white border border-[#D4D5D8] rounded-full flex items-center justify-center shrink-0 shadow-sm">
          <X className="w-[16px] h-[16px] text-[#111827]" />
        </button>
      </div>

      {/* second part */}
      <div className="leads-tw-modal-body w-[462px] h-[437px] opacity-100 rounded-br-[12px] rounded-bl-[12px] bg-[rgba(245,246,250,1)] relative flex flex-col items-center">
        
        {/* top tab section */}
        <div className="w-[462px] h-[35px] border-b-[1px] border-[rgba(212,213,216,1)] flex items-center px-[32px] mt-[16px]">
          <span className="text-[#374151] font-medium text-[14px]">type="private"</span>
        </div>

        {/* Notes list */}
        <div className="flex flex-col w-[398px] mt-[16px] gap-[12px]"> 
          {/* date and icon */}
          <div className="w-[398px] h-[24px] flex justify-between items-center opacity-100">
            <span className="text-[#6B7280] text-[12px] font-medium font-['Inter']">12 April, 2026</span>
            
            {/* and the icon only */}
            <div className="w-[88px] h-[24px] flex gap-[8px] opacity-100">
              <button className="w-[24px] h-[24px] flex items-center justify-center bg-white border border-[#D4D5D8] rounded-[4px] shadow-sm"><img src={messageText021} alt="Message" /></button>
              <button className="w-[24px] h-[24px] flex items-center justify-center bg-white border border-[#D4D5D8] rounded-[4px] shadow-sm"><img src={markerIcon} alt="Pin" /></button>
              <button className="w-[24px] h-[24px] flex items-center justify-center bg-white border border-[#D4D5D8] rounded-[4px] shadow-sm"><img src={trashIcon} alt="Delete" /></button>
            </div>
          </div>
          <div className="w-[398px]">
            <p className="text-[14px] text-[#111827] font-['Inter']">
              This is a placeholder for the private note content.
            </p>
          </div>

        </div>

        {/* last input */}
        <div className="w-[422px] h-[85px] flex gap-[8px] opacity-100 absolute top-[332px] left-[20px] bg-white border border-[rgba(212,213,216,1)] rounded-[12px] focus-within:border-[rgba(0,35,111,1)] p-[12px] transition-colors">
          <textarea 
            className="flex-1 h-full resize-none outline-none bg-transparent font-['Inter'] text-[14px]"
            placeholder="Type your note..."
          />
          
          {/* the button */}
          <button className="w-[36px] h-[36px] opacity-100 rounded-[12px] bg-[rgba(0,35,111,1)] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.11)] flex items-center justify-center self-end shrink-0">
            <img src={chevronRight} alt="Submit" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default Notes;
