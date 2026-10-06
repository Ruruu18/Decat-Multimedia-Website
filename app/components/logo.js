import { useId } from "react";
import { DECAT, LOCKUP_VIEWBOX, MARK, MULTIMEDIA } from "../lib/logo-paths";

// The DECAT lockup as live vector shapes (gold mark, white wordmark) for dark surfaces.
// The header shows it as is; the loading intro animates the same pieces.
export default function Logo() {
  const gold = useId();

  return (
    <svg className="lockup" viewBox={LOCKUP_VIEWBOX} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={gold} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="176.9" y2="176.9"><stop stopColor="#fff8b0" /><stop offset="1" stopColor="#c19757" /></linearGradient>
      </defs>
      <g className="lockup-mark" fill={`url(#${gold})`}>
        <polygon points={MARK.bracket} />
        <polygon className="lockup-chevron" points={MARK.chevron} />
        <polygon className="lockup-chevron lockup-chevron-lead" points={MARK.leadChevron} />
      </g>
      <g className="lockup-word" fillRule="evenodd">{DECAT.map((d, i) => <path className="lockup-letter" style={{ "--i": i }} d={d} key={i} />)}</g>
      <g className="lockup-tag" fillRule="evenodd">{MULTIMEDIA.map((d, i) => <path className="lockup-letter" style={{ "--i": i }} d={d} key={i} />)}</g>
    </svg>
  );
}
