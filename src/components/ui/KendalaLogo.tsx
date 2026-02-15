import React from 'react';

export const KendalaLogo = ({ size = 24, color = "currentColor" }: { size?: number, color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 22H22L12 2Z" fill={color} opacity="0.2"/>
    <path d="M12 6L4.5 21H19.5L12 6Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 12L9 18" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 12L15 18" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const KendalaWordmark = ({ size = "md", color = "currentColor" }: { size?: "sm" | "md" | "lg", color?: string }) => {
    const fontSize = size === "lg" ? "text-3xl" : size === "md" ? "text-xl" : "text-base";
    return (
        <div className={`font-sans font-black tracking-tighter flex items-center gap-2 ${fontSize}`} style={{ color }}>
            <KendalaLogo size={size === "lg" ? 32 : 24} color={color} />
            <span>KENDALA</span>
        </div>
    )
}
