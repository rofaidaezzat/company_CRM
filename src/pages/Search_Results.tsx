  import { Search } from 'lucide-react';
import frameImage from '../assets/Frame 1321318261.svg';
import mailIcon from '../assets/message-text-02 (1).svg';
import whatsappIcon from '../assets/ic_baseline-whatsapp.svg';
import editPenIcon from '../assets/edit-04.svg';

const Search_Results = () => {
  return (
    <div style={{ width: "100%", paddingBottom: 24, paddingTop: 8 }}>
      
      {/* Container holding everything */}
      <div style={{ display: "flex", flexDirection: "column", gap: 24, width: 1274 }}>
        
        {/* Search Bar */}
        <div
          style={{
            background: "rgba(255, 255, 255, 1)",
            width: 1274,
            height: 56,
            borderRadius: 23,
            display: "flex",
            alignItems: "center",
            padding: 8,
            boxSizing: "border-box",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#F9FAFB", // Match icon background if needed, or transparent
              borderRadius: "50%",
            }}
          >
            <Search size={24} color="#00236F" style={{ opacity: 1 }} />
          </div>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 16, color: "#4B5563" }}>
            We searched for "Wael Metwally".
          </span>
        </div>

        {/* Main Results Container */}
        <div style={{ display: "flex", flexDirection: "column", gap: 32, width: 1274, minHeight: 698 }}>
          
          {/* Leads Section */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 32, color: "rgba(0, 35, 111, 1)", lineHeight: "100%" }}>
                Leads
              </div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#6B7280" }}>
                1 result
              </div>
            </div>

            {/* Leads Table */}
            <div style={{ width: "100%", border: "1px solid rgba(212, 213, 216, 1)", borderRadius: 12, overflow: "hidden", background: "#fff" }}>
              {/* Header */}
              <div style={{ background: "rgba(212, 213, 216, 1)", height: 48, display: "flex", alignItems: "center", padding: "0 12px" }}>
                <div style={{ flex: 1, fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13, color: "#141414" }}>Date</div>
                <div style={{ flex: 2, fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13, color: "#141414" }}>Lead info</div>
                <div style={{ flex: 1.6, fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13, color: "#141414" }}>Status</div>
                <div style={{ flex: 1.2, fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13, color: "#141414" }}>Phone number</div>
                <div style={{ flex: 0.8, fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13, color: "#141414" }}>Message</div>
                <div style={{ flex: 1, fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13, color: "#141414" }}>Priority</div>
                <div style={{ flex: 1, fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13, color: "#141414" }}>Lead Source</div>
                <div style={{ flex: 1.2, fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13, color: "#141414" }}>Next Followup</div>
                <div style={{ flex: 1.5, fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13, color: "#141414" }}>Actions</div>
              </div>
              {/* Row */}
              <div style={{ height: 72, display: "flex", alignItems: "center", padding: "0 12px" }}>
                <div style={{ flex: 1, fontFamily: "Inter, sans-serif", fontSize: 13, color: "#4B5563" }}>04/11/2026</div>
                <div style={{ flex: 2, display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: "#141414" }}>Wael Metwally</span>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#6B7280" }}>Elshayeeb Inc.</span>
                </div>
                <div style={{ flex: 1.6 }}>
                  <span style={{ background: "rgba(230, 233, 241, 1)", padding: "4px 8px", borderRadius: 12, fontSize: 13, color: "rgba(70, 70, 70, 1)", display: "inline-block" }}>
                    After meeting follow up
                  </span>
                </div>
                <div style={{ flex: 1.2, fontFamily: "Inter, sans-serif", fontSize: 13, color: "#4B5563" }}>+201121504065</div>
                <div style={{ flex: 0.8, display: "flex", alignItems: "center" }}>
                  <img src={mailIcon} alt="mail" width={24} height={24} style={{ cursor: "pointer" }} />
                </div>
                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "rgba(140, 106, 4, 1)", fontWeight: 500 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(140, 106, 4, 1)" }} /> Medium
                </div>
                <div style={{ flex: 1, fontSize: 13, color: "rgba(5, 150, 105, 1)", fontWeight: 500 }}>Website</div>
                <div style={{ flex: 1.2, fontSize: 13, color: "#4B5563" }}>25/12/2026</div>
                <div style={{ flex: 1.5, display: "flex", alignItems: "center", gap: 12 }}>
                  <img src={whatsappIcon} alt="wa" width={24} height={24} style={{ cursor: "pointer" }} />
                  <img src={mailIcon} alt="mail" width={24} height={24} style={{ cursor: "pointer" }} />
                  <img src={editPenIcon} alt="edit" width={24} height={24} style={{ cursor: "pointer" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Deals Section */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 32, color: "rgba(0, 35, 111, 1)", lineHeight: "100%" }}>
                Deals
              </div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#6B7280" }}>
                1 result
              </div>
            </div>

            {/* Deals Table */}
            <div style={{ width: "100%", border: "1px solid rgba(212, 213, 216, 1)", borderRadius: 12, overflow: "hidden", background: "#fff" }}>
              {/* Header */}
              <div style={{ background: "rgba(212, 213, 216, 1)", height: 48, display: "flex", alignItems: "center", padding: "0 12px" }}>
                <div style={{ flex: 1, fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13, color: "#141414" }}>Date</div>
                <div style={{ flex: 2, fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13, color: "#141414" }}>Customer Info</div>
                <div style={{ flex: 1.5, fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13, color: "#141414" }}>Phone number</div>
                <div style={{ flex: 1, fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13, color: "#141414" }}>City</div>
                <div style={{ flex: 1.5, fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13, color: "#141414" }}>Deal details</div>
                <div style={{ flex: 1.5, fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13, color: "#141414" }}>Value (EGP)</div>
                <div style={{ flex: 1, fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13, color: "#141414" }}>Actions</div>
              </div>
              {/* Row */}
              <div style={{ height: 72, display: "flex", alignItems: "center", padding: "0 12px" }}>
                <div style={{ flex: 1, fontFamily: "Inter, sans-serif", fontSize: 13, color: "#4B5563" }}>04/11/2026</div>
                <div style={{ flex: 2, display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: "#141414" }}>Wael Metwally</span>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#6B7280" }}>Elshayeeb inc.</span>
                </div>
                <div style={{ flex: 1.5, fontFamily: "Inter, sans-serif", fontSize: 13, color: "#4B5563" }}>+20112170891</div>
                <div style={{ flex: 1, fontFamily: "Inter, sans-serif", fontSize: 13, color: "#4B5563" }}>Alexandria</div>
                <div style={{ flex: 1.5, fontFamily: "Inter, sans-serif", fontSize: 13, color: "rgba(0, 35, 111, 1)", cursor: "pointer" }}>View Details</div>
                <div style={{ flex: 1.5, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#4B5563" }}>120,000,000</span>
                  <img src={editPenIcon} alt="edit" width={16} height={16} style={{ cursor: "pointer", opacity: 0.55 }} />
                </div>
                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12 }}>
                  <img src={whatsappIcon} alt="wa" width={24} height={24} style={{ cursor: "pointer" }} />
                  <img src={mailIcon} alt="mail" width={24} height={24} style={{ cursor: "pointer" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Footer No Results Info (Image and text) */}
          <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 40 }}>
            <img src={frameImage} alt="Search Graphic" />
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 24, fontWeight: 600, color: "rgba(30, 30, 30, 1)" }}>
                Don’t see your result ?
              </span>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 16, color: "rgba(100, 100, 100, 1)" }}>
                Try to search with date, name, price or different table items
              </span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Search_Results;