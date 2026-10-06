"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import Logo from "./logo";
import { Arrow } from "./ui";

const navigation = [["/", "Home"], ["/services", "Services"], ["/work", "Work"], ["/pricing", "Pricing"]];

export default function Header() {
  const pathname = usePathname();
  const [menuPath, setMenuPath] = useState(null);
  const menuButton = useRef(null);
  const open = menuPath === pathname;
  const close = () => setMenuPath(null);

  return (
    <header className="site-header" onKeyDown={(event) => { if (event.key === "Escape" && open) { close(); menuButton.current?.focus(); } }} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) close(); }}>
      <div className="header-inner container">
        <Link className="logo" href="/" aria-label="DECAT Multimedia home" onClick={close}>
          <Logo />
        </Link>
        <button ref={menuButton} className="menu-button" aria-expanded={open} aria-controls="main-navigation" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setMenuPath(open ? null : pathname)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d={open ? "m6 6 12 12M6 18 18 6" : "M4 8h16M4 16h16"} /></svg>
        </button>
        <nav id="main-navigation" className={`navigation${open ? " is-open" : ""}`} aria-label="Main navigation">
          {navigation.map(([href, label]) => <Link href={href} key={href} onClick={close} aria-current={pathname === href ? "page" : undefined}>{label}</Link>)}
          <Link href="/contact" className="button button-small" onClick={close} aria-current={pathname === "/contact" ? "page" : undefined}>Let’s talk <Arrow diagonal /></Link>
        </nav>
      </div>
    </header>
  );
}
