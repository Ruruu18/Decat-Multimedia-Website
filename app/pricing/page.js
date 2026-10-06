import Link from "next/link";
import { Arrow, PageIntro } from "../components/ui";
import { packages, currency } from "../lib/production";

export const metadata = { title: "Pricing", description: "Explore DECAT production packages for intimate events, full productions, and broadcasts." };

export default function Pricing() {
  return <div className="container page-content pricing-page"><PageIntro label="PRODUCTION PACKAGES" title={<>A clear <span>starting point.</span></>}>Choose your scale. We’ll take care of the details.</PageIntro><div className="pricing-grid">{packages.map((item) => <article className={`price-card${item.id === "signature" ? " featured" : ""}`} key={item.id}><div className="price-heading"><h2>{item.name}</h2>{item.id === "signature" && <span className="badge">Full production</span>}</div><p className="package-description">{item.description}</p><div className="price"><span>From</span><strong>{currency(item.price)}</strong></div><p className="guest-limit">Up to {item.guests.toLocaleString("en-PH")} guests</p><ul>{item.features.map((feature) => <li key={feature}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg>{feature}</li>)}</ul><Link className={`button${item.id === "signature" ? "" : " button-outline"}`} href={`/contact?package=${item.id}`}>Choose {item.name} <Arrow /></Link></article>)}</div><p className="pricing-note">PHP. Venue, travel, and taxes excluded. Final pricing follows a technical review.</p><div className="pricing-help"><div><h2>Something different in mind?</h2><p>We can build a production around your brief.</p></div><Link className="text-link" href="/contact">Let’s talk <Arrow diagonal /></Link></div></div>;
}
