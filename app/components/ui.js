import Link from "next/link";

export function Arrow({ diagonal = false, className = "" }) {
  return <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{diagonal ? <path d="M6 18 18 6M6 6h12v12" /> : <path d="M4 12h15m-6-6 6 6-6 6" />}</svg>;
}

export function PageIntro({ label, title, children }) {
  return <div className="page-intro"><p className="eyebrow">{label}</p><h1>{title}</h1>{children && <p className="page-description">{children}</p>}</div>;
}

export function ProjectCTA() {
  return <section className="project-cta container"><div><p className="eyebrow">YOUR NEXT PROJECT</p><h2>Let’s make it happen.</h2></div><Link className="button" href="/contact">Start a conversation <Arrow /></Link></section>;
}
