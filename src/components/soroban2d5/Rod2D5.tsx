import React from "react";

type Props = {
  beadSize?: number;
  beadGap?: number;
  columnIndex?: number;
};

export default function Rod2D5({
  beadSize = 34,
  beadGap = 4,
  columnIndex = 0,
}: Props) {
  const beadHeight = beadSize * 0.42;
  const gap = beadGap;
  const step = beadHeight + gap;

  const beadBase: React.CSSProperties = {
    width: beadSize,
    height: beadHeight,
    flex: "0 0 auto",
    borderRadius: "45% 45% 48% 48%",
    boxSizing: "border-box",
  };

  return (
    <div data-column={columnIndex} style={{
      position: "relative", display: "flex", flexDirection: "column",
      alignItems: "center", flex: "0 1 auto", minWidth: 0,
      width: beadSize * 1.3, boxSizing: "border-box"
    }}>
      <div aria-hidden style={{
        position: "absolute", top: 0, bottom: 0, left: "50%",
        width: Math.max(1, beadSize * 0.055), transform: "translateX(-50%)",
        borderRadius: 999,
        background: "linear-gradient(90deg, #9b7a3c, #ffe7a1, #a87524)"
      }} />
      <div style={{
        position: "relative", zIndex: 1, display: "flex",
        flexDirection: "column", alignItems: "center", gap, width: "100%"
      }}>
        <div style={{
          ...beadBase,
          background: "radial-gradient(circle at 30% 24%, #fff4c7 0%, #ffc45c 28%, #c97518 68%, #78400c 100%)",
          border: "1px solid rgba(255,236,174,.9)",
          boxShadow: "inset -2px -2px 4px rgba(91,42,0,.42), inset 2px 2px 4px rgba(255,255,255,.72), 0 1px 5px rgba(255,177,55,.38)"
        }} />
        <div aria-hidden style={{
          width: "100%", height: Math.max(2, beadSize * 0.12),
          margin: `${Math.max(2, beadSize * 0.08)}px 0`,
          borderRadius: 999,
          background: "linear-gradient(180deg, rgba(190,249,255,.95), rgba(35,113,145,.9))",
          boxShadow: "0 0 5px rgba(90,220,255,.35)"
        }} />
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} style={{
            ...beadBase,
            background: "radial-gradient(circle at 28% 22%, #b5f7ff 0%, #287f9a 30%, #07506b 67%, #032b40 100%)",
            border: "1px solid rgba(107,222,241,.9)",
            boxShadow: "inset -2px -2px 4px rgba(0,15,28,.55), inset 2px 2px 4px rgba(225,255,255,.48), 0 1px 5px rgba(0,35,55,.55)"
          }} />
        ))}
      </div>
    </div>
  );
}
