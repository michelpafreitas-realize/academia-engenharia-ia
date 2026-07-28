import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadSerif } from "@remotion/google-fonts/SourceSerif4";
import { loadFont as loadSans } from "@remotion/google-fonts/SourceSans3";

export const { fontFamily: SERIF } = loadSerif("normal", {
  weights: ["400", "600", "700"],
  subsets: ["latin", "latin-ext"],
});
export const { fontFamily: SANS } = loadSans("normal", {
  weights: ["400", "600", "700"],
  subsets: ["latin", "latin-ext"],
});
export const MONO = "ui-monospace, 'Cascadia Mono', Consolas, monospace";

export const FPS = 30;

// Paleta do site da Academia (index.html)
export const CARDINAL = "#8C1515";
export const DARKRED = "#820000";
export const PAPER = "#f7f5ef";
export const CARD = "#fff";
export const INK = "#242321";
export const MUT = "#62605c";
export const LINE = "#dedbd4";
export const CODEBG = "#2b2926";
export const CREAM = "#f4d5d5";

export const typed = (text: string, frame: number, start: number, cps: number) =>
  text.slice(0, Math.max(0, Math.floor(((frame - start) / FPS) * cps)));

export const Rise: React.FC<{ delay?: number; children: React.ReactNode }> = ({
  delay = 0,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
    durationInFrames: 14,
  });
  return (
    <div style={{ opacity: p, transform: `translateY(${(1 - p) * 34}px)` }}>
      {children}
    </div>
  );
};

// Brasão da Academia: círculo cardinal, "IA" e "MMXXVI" (mesmo do site)
export const Crest: React.FC<{ size?: number; faint?: boolean }> = ({
  size = 60,
  faint = false,
}) => (
  <svg width={size} height={size} viewBox="0 0 60 60" style={{ display: "block" }}>
    <circle cx="30" cy="30" r="29" fill={faint ? "none" : CARDINAL} stroke={faint ? CARDINAL : DARKRED} strokeWidth="2" />
    <circle cx="30" cy="30" r="24" fill="none" stroke={faint ? CARDINAL : CREAM} strokeWidth="1" />
    <text x="30" y="36" textAnchor="middle" fill={faint ? CARDINAL : "#fff"} fontFamily="Georgia, serif" fontSize="18" fontWeight="bold">
      IA
    </text>
    <text x="30" y="50" textAnchor="middle" fill={faint ? CARDINAL : CREAM} fontFamily="Georgia, serif" fontSize="8">
      MMXXVI
    </text>
  </svg>
);

export const Kicker: React.FC<{ children: React.ReactNode; delay?: number }> = ({
  children,
  delay = 2,
}) => (
  <Rise delay={delay}>
    <div
      style={{
        fontFamily: SANS,
        fontSize: 30,
        fontWeight: 700,
        letterSpacing: 7,
        color: CARDINAL,
        textTransform: "uppercase",
        marginBottom: 28,
      }}
    >
      {children}
    </div>
  </Rise>
);

export const Rule: React.FC<{ width?: number; delay?: number }> = ({
  width = 120,
  delay = 6,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 200 }, durationInFrames: 18 });
  return <div style={{ width: width * p, height: 4, background: CARDINAL, margin: "34px 0" }} />;
};
