import React from 'react';
import { Skeleton } from './ui/skeleton';

interface TableSkeletonProps {
  columnWidths: number[];
  rowCount?: number;
  rowHeight?: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  columnWidths,
  rowCount = 10,
  rowHeight = 72,
}) => {
  return (
    <div style={{ width: "100%", background: "#fff" }}>
      {Array.from({ length: rowCount }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="responsive-table-row"
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            padding: "16px 12px",
            boxSizing: "border-box",
            height: rowHeight,
            borderBottom: "1px solid rgba(212, 213, 216, 1)",
            justifyContent: "space-between",
          }}
        >
          {columnWidths.map((width, colIndex) => {
            // For the second column (usually 'info' or 'name'), show a two-line skeleton
            const isInfoColumn = colIndex === 1;
            return (
              <div
                key={colIndex}
                style={{
                  width: width,
                  flexShrink: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  justifyContent: "center",
                }}
              >
                {isInfoColumn ? (
                  <>
                    <Skeleton style={{ height: 14, width: "80%", borderRadius: 4 }} />
                    <Skeleton style={{ height: 11, width: "55%", borderRadius: 4 }} />
                  </>
                ) : (
                  <Skeleton style={{ height: 14, width: "70%", borderRadius: 4 }} />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
