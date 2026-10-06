import Image from "next/image";
import Link from "next/link";
import { Arrow, ProjectCTA } from "./components/ui";
import HeroVideo from "./components/hero-video";
import { currency, disciplines, packages } from "./lib/production";

const steps = [
  ["01", "Brief", "Tell us the date, the venue, and what you have in mind."],
  ["02", "Plan", "We review the technical needs and send a clear quote."],
  ["03", "Show day", "Our crew sets up, runs the show, and packs down."],
  ["04", "Delivery", "Photos, recordings, and edits, ready to share."],
];

export default function Home() {
  return (
    <>
      <section className="home-hero">
        <HeroVideo />
        <div className="hero-content container">
          <div className="hero-copy">
            <p className="eyebrow">DECAT · SURIGAO, PHILIPPINES</p>
            <h1>Your event. <span>Our craft.</span></h1>
            <p className="hero-description">Full-service sound, stage &amp; visual production.</p>
            <div className="hero-actions">
              <Link className="button" href="/contact">Inquire <Arrow /></Link>
              <Link className="text-link" href="/work">Our work <Arrow diagonal /></Link>
            </div>
          </div>
        </div>
      </section>
      <section className="home-section container" aria-labelledby="home-services-title">
        <div className="section-heading">
          <div><p className="eyebrow">WHAT WE DO</p><h2 id="home-services-title">One team. Every detail.</h2></div>
          <div className="section-aside">
            <p>Sound, stage, screens, and cameras, handled by a single crew.</p>
            <Link href="/services" className="text-link">All services <Arrow /></Link>
          </div>
        </div>
        <div className="capabilities">
          {disciplines.map((group) => (
            <Link className="capability" href={`/services#${group.id}`} key={group.id}>
              <div className="capability-top"><span className="index">{group.number}</span><Arrow diagonal /></div>
              <h3>{group.title}</h3>
              <p>{group.description}</p>
              <ul>{group.items.map(([title]) => <li key={title}>{title}</li>)}</ul>
            </Link>
          ))}
        </div>
      </section>
      <section className="home-section home-work" aria-labelledby="home-work-title">
        <div className="container">
          <div className="section-heading">
            <div><p className="eyebrow">OUR WORK</p><h2 id="home-work-title">From the stage to the street.</h2></div>
            <div className="section-aside"><p>Concerts, festivals, and the moments in between.</p></div>
          </div>
          <div className="work-grid">
            <Link className="work-tile work-lead" href="/work">
              <Image src="/images/work/stage.jpg" alt="" fill sizes="(max-width: 760px) 100vw, (max-width: 1340px) 66vw, 820px" />
              <span className="work-label">
                <span className="work-play"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg></span>
                Watch the showreel
              </span>
            </Link>
            <figure className="work-tile">
              <Image src="/images/work/console.jpg" alt="A sound engineer adjusting a mixing console" fill sizes="(max-width: 760px) 50vw, (max-width: 1340px) 33vw, 400px" />
              <figcaption>Live sound</figcaption>
            </figure>
            <figure className="work-tile">
              <Image src="/images/work/festival.jpg" alt="Festival dancers in bright costumes on a city street" fill sizes="(max-width: 760px) 50vw, (max-width: 1340px) 33vw, 400px" />
              <figcaption>Festivals &amp; parades</figcaption>
            </figure>
          </div>
        </div>
      </section>
      <section className="home-section container" aria-labelledby="home-process-title">
        <div className="section-heading">
          <div><p className="eyebrow">HOW IT WORKS</p><h2 id="home-process-title">From first brief to final cue.</h2></div>
        </div>
        <ol className="steps">
          {steps.map(([number, title, description]) => (
            <li key={number}><span className="index">{number}</span><h3>{title}</h3><p>{description}</p></li>
          ))}
        </ol>
      </section>
      <section className="home-section home-packages container" aria-labelledby="home-packages-title">
        <div className="packages-intro">
          <p className="eyebrow">PACKAGES</p>
          <h2 id="home-packages-title">Choose your scale.</h2>
          <p>Every package is a starting point. Final pricing follows a technical review.</p>
          <Link href="/pricing" className="text-link">Compare packages <Arrow /></Link>
        </div>
        <ul className="package-list">
          {packages.map((item) => (
            <li key={item.id}>
              <div><h3>{item.name}</h3><p>{item.description}</p></div>
              <span className="package-guests">Up to {item.guests.toLocaleString("en-PH")} guests</span>
              <span className="package-price"><small>From</small>{currency(item.price)}</span>
            </li>
          ))}
        </ul>
      </section>
      <ProjectCTA />
    </>
  );
}
