import Link from "next/link";
import { Arrow, PageIntro, ProjectCTA } from "../components/ui";

export const metadata = { title: "Our Work", description: "See DECAT Multimedia in action. Watch our production showreel." };

export default function Work() {
  return <><div className="container page-content work-page"><PageIntro label="OUR WORK" title={<>See it <span>in motion.</span></>}>A closer look at what we bring to the stage.</PageIntro><figure className="showreel"><video controls playsInline preload="none" poster="/decat-event-hero.png" aria-label="DECAT Multimedia production showreel"><source src="/videos/DeCat%202.mp4" type="video/mp4" />Your browser does not support this video. <a href="/videos/DeCat%202.mp4">Download the showreel</a>.</video><figcaption><span>DECAT Multimedia — Showreel</span><span>Live events / Broadcast / Videography</span></figcaption></figure><div className="work-note"><p>Every production starts with a conversation.</p><Link className="text-link" href="/services">Explore our services <Arrow /></Link></div></div><ProjectCTA /></>;
}
