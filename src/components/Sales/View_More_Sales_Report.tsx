import React from "react";
import closeIcon from "../../assets/x-02.svg";
import coinIcon from "../../assets/coin-unbroken.svg";
import checkIcon from "../../assets/check-02.svg";
import starsIcon from "../../assets/stars.svg";

interface ViewMoreSalesReportProps {
  onClose: () => void;
}

const View_More_Sales_Report: React.FC<ViewMoreSalesReportProps> = ({ onClose }) => {
  const stats = [
    { label: "Deals Closed", value: "14", icon: checkIcon, color: "#10B981" },
    { label: "Revenue Generated", value: "245,000 EGP", icon: coinIcon, color: "#00236F" },
    { label: "Comm. Earned", value: "24,500 EGP", icon: starsIcon, color: "#F59E0B" }
  ];

  const salesActivity = [
    { name: "John Dorgham", deals: 4, revenue: "95,000 EGP", status: "Active" },
    { name: "Amr Abdelaziz", deals: 3, revenue: "70,000 EGP", status: "Active" },
    { name: "Sara Elmasry", deals: 4, revenue: "50,000 EGP", status: "Active" },
    { name: "Mustafa Mahmoud", deals: 2, revenue: "20,000 EGP", status: "Break" },
    { name: "Youssef Hassan", deals: 1, revenue: "10,000 EGP", status: "Active" },
  ];

  return (
    <div
      style={{
        display: "flex",
        width: 521,
        maxHeight: "90vh",
        flexDirection: "column",
        alignItems: "flex-start",
        background: "#FFFFFF",
        borderRadius: 16,
        boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.12)",
        overflow: "hidden",
        boxSizing: "border-box",
        padding: 24,
        position: "relative",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: 20, fontWeight: 700, color: "#141414" }}>
          Daily Sales Report
        </h2>
        <button
          onClick={onClose}
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "1px solid rgba(212, 213, 216, 1)",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <img src={closeIcon} alt="Close" width={14} height={14} />
        </button>
      </div>

      {/* Content wrapper */}
      <div
        className="custom-scrollbar"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          width: "100%",
          overflowY: "auto",
          maxHeight: "65vh",
          paddingRight: 4,
          boxSizing: "border-box",
        }}
      >
        {/* KPI Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, width: "100%" }}>
          {stats.map((stat, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                padding: 12,
                background: "#F8F9FC",
                borderRadius: 12,
                border: "1px solid #EDEFF2",
                boxSizing: "border-box",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 11,
                    fontWeight: 500,
                    color: "#747474",
                  }}
                >
                  {stat.label}
                </span>
              </div>
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 15,
                  fontWeight: 700,
                  color: stat.color,
                }}
              >
                {stat.value}
              </span>
            </div>
          ))}
        </div>

        {/* Rep Performance Table */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
          <h3 style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 600, color: "#141414" }}>
            Sales Rep Performance
          </h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              border: "1px solid #EDEFF2",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            {/* Table Header */}
            <div
              style={{
                display: "flex",
                background: "#F1F3F9",
                padding: "10px 12px",
                justifyContent: "space-between",
                alignItems: "center",
                fontFamily: "Inter, sans-serif",
                fontSize: 12,
                fontWeight: 600,
                color: "#464646",
              }}
            >
              <span style={{ width: 140 }}>Sales Rep</span>
              <span style={{ width: 60, textAlign: "center" }}>Deals</span>
              <span style={{ width: 100, textAlign: "right" }}>Revenue</span>
            </div>

            {/* Table Rows */}
            {salesActivity.map((row, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  padding: "12px 12px",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "#FFFFFF",
                  borderBottom: idx < salesActivity.length - 1 ? "1px solid #EDEFF2" : "none",
                  fontFamily: "Inter, sans-serif",
                  fontSize: 13,
                  color: "#141414",
                }}
              >
                <span style={{ width: 140, fontWeight: 500 }}>{row.name}</span>
                <span style={{ width: 60, textAlign: "center", color: "#464646" }}>{row.deals}</span>
                <span style={{ width: 100, textAlign: "right", fontWeight: 600, color: "#00236F" }}>{row.revenue}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default View_More_Sales_Report;
