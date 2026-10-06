import Link from "next/link";
import Logo from "./logo";
import { Arrow } from "./ui";
import { disciplines } from "../lib/production";

const pages = [["/services", "Services"], ["/work", "Work"], ["/pricing", "Pricing"], ["/contact", "Contact"]];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link className="logo" href="/" aria-label="DECAT Multimedia home"><Logo /></Link>
            <p>Full-service sound, stage &amp; visual production.</p>
          </div>
          <nav className="footer-nav" aria-label="Footer">
            <div>
              <h2>Explore</h2>
              <ul>{pages.map(([href, label]) => <li key={href}><Link href={href}>{label}</Link></li>)}</ul>
            </div>
            <div>
              <h2>Services</h2>
              <ul>{disciplines.map((group) => <li key={group.id}><Link href={`/services#${group.id}`}>{group.title}</Link></li>)}</ul>
            </div>
          </nav>
          <div className="footer-contact">
            <h2>Contact</h2>
            <a href="mailto:hello@decatmultimedia.com">hello@decatmultimedia.com</a>
            <p>Surigao, Philippines<br />Available nationwide</p>
            <Link className="text-link" href="/contact">Start a project <Arrow diagonal /></Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} DECAT Multimedia</span>
          <a href="#main">Back to top</a>
        </div>
      </div>
    </footer>
  );
}
