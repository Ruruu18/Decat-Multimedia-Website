"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

const services = [
  ["01", "Corporate events", "Run-of-show, technical direction and flawless show calling."],
  ["02", "Multimedia", "Screens content, motion graphics and playback built as one system."],
  ["03", "Livestreaming", "Broadcast-grade, multi-camera streams with remote contributors."],
  ["04", "Photography", "Editorial event coverage delivered fast and ready for press."],
  ["05", "Film", "Brand stories, highlights and social cuts that keep the room alive."],
  ["06", "LED + staging", "High-refresh LED, engineered rigging and scenic integration."],
  ["07", "Sound systems", "Clean, consistent coverage for every seat and every stream."],
];

const projects = [
  {
    tag: "Brand experience",
    title: "Signal / Product One",
    meta: "1,200 guests · 18m LED canvas",
    className: "project-blue",
  },
  {
    tag: "Global livestream",
    title: "All Hands / Everywhere",
    meta: "14 markets · 620K views",
    className: "project-grid",
  },
  {
    tag: "Leadership summit",
    title: "Ideas in Motion",
    meta: "3 days · 42 sessions",
    className: "project-red",
  },
];

const packages = [
  {
    id: "essential",
    eyebrow: "Essential",
    price: 85000,
    unit: "from",
    desc: "A polished technical setup for presentations, panels and intimate launches.",
    features: ["Up to 150 guests", "PA + 4 wireless mics", "Presentation display", "On-site technical crew"],
  },
  {
    id: "signature",
    eyebrow: "Signature",
    price: 195000,
    unit: "from",
    desc: "Our complete production package for high-stakes corporate moments.",
    features: ["Up to 500 guests", "LED stage canvas", "Multi-camera recording", "Show caller + full crew"],
    featured: true,
  },
  {
    id: "broadcast",
    eyebrow: "Broadcast+",
    price: 350000,
    unit: "from",
    desc: "A scalable show and livestream system for audiences in-room and everywhere.",
    features: ["Up to 1,500 guests", "Broadcast livestream", "Custom scenic + content", "Redundant signal path"],
  },
];

const addons = [
  ["livestream", "Global livestream", 75000],
  ["photo", "Event photography", 25000],
  ["film", "Highlight film", 55000],
  ["led", "Additional LED wall", 95000],
];

function Icon({ name, size = 20 }) {
  const paths = {
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    down: <><path d="M6 9l6 6 6-6"/></>,
    play: <path d="m9 7 8 5-8 5z"/>,
    check: <path d="m5 12 4 4L19 6"/>,
    plus: <><path d="M12 5v14"/><path d="M5 12h14"/></>,
    menu: <><path d="M4 8h16"/><path d="M4 16h16"/></>,
    close: <><path d="m6 6 12 12"/><path d="m18 6-12 12"/></>,
    calendar: <><path d="M5 4v3M19 4v3M4 9h16"/><rect x="4" y="6" width="16" height="14" rx="2"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function Logo() {
  return (
    <a className="logo" href="#top" aria-label="DECAT Multimedia home">
      <Image src="/images/Logo-DarkTheme.png" alt="DECAT Multimedia" width={400} height={120} sizes="400px" priority />
    </a>
  );
}

function Header({ onBook }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header className="site-header">
      <Logo />
      <button className="menu-button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
        <Icon name={open ? "close" : "menu"} size={24}/>
      </button>
      <nav className={open ? "nav open" : "nav"} aria-label="Main navigation">
        <a href="#services" onClick={close}>Services</a>
        <a href="#work" onClick={close}>Work</a>
        <a href="#pricing" onClick={close}>Pricing</a>
        <button className="nav-cta" onClick={() => { close(); onBook(); }}>Book a production <Icon name="arrow" size={17}/></button>
      </nav>
    </header>
  );
}

function SectionIntro({ label, title, copy }) {
  return (
    <div className="section-intro reveal">
      <p className="kicker"><span/> {label}</p>
      <h2>{title}</h2>
      {copy && <p className="section-copy">{copy}</p>}
    </div>
  );
}

function Pricing({ onChoose }) {
  return (
    <section id="pricing" className="pricing section-pad">
      <SectionIntro label="Starting investments" title={<>A clear starting point.<br/><em>Every show, made yours.</em></>} copy="Use these packages to scope your production. We’ll turn your venue, audience and ambition into a firm proposal."/>
      <div className="pricing-grid">
        {packages.map((pkg) => (
          <article className={pkg.featured ? "price-card featured" : "price-card"} key={pkg.id}>
            {pkg.featured && <div className="popular">MOST BOOKED</div>}
            <p className="price-eyebrow">{pkg.eyebrow}</p>
            <div className="price"><small>{pkg.unit}</small><span>₱{pkg.price.toLocaleString()}</span></div>
            <p>{pkg.desc}</p>
            <ul>{pkg.features.map((item) => <li key={item}><Icon name="check" size={17}/>{item}</li>)}</ul>
            <button onClick={() => onChoose(pkg.id)}>Choose {pkg.eyebrow} <Icon name="arrow" size={18}/></button>
          </article>
        ))}
      </div>
      <p className="pricing-note">Pricing shown in PHP, excluding venue fees, travel and applicable taxes. Your tailored estimate is confirmed after a technical discovery call.</p>
    </section>
  );
}

function Booking({ chosenPackage, bookingRef }) {
  const [selected, setSelected] = useState(chosenPackage || "signature");
  const [attendance, setAttendance] = useState(300);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [sent, setSent] = useState(false);
  useEffect(() => setSelected(chosenPackage), [chosenPackage]);
  const active = packages.find((pkg) => pkg.id === selected);
  const estimate = useMemo(() => {
    const extraGuests = Math.max(0, attendance - (selected === "essential" ? 150 : selected === "signature" ? 500 : 1500));
    return active.price + Math.ceil(extraGuests / 100) * 15000 + selectedAddons.reduce((sum, id) => sum + addons.find((a) => a[0] === id)[2], 0);
  }, [active.price, attendance, selected, selectedAddons]);

  const toggleAddon = (id) => setSelectedAddons((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const submit = (e) => { e.preventDefault(); setSent(true); };

  return (
    <section id="booking" ref={bookingRef} className="booking section-pad">
      <div className="booking-title">
        <p className="kicker"><span/> Start a project</p>
        <h2>Let’s put your<br/><em>show in motion.</em></h2>
        <p>Share the shape of your event. We’ll respond with availability and a production path within one business day.</p>
      </div>
      {sent ? (
        <div className="success-card" role="status">
          <span className="success-icon"><Icon name="check" size={32}/></span>
          <p className="kicker">REQUEST RECEIVED</p>
          <h3>Your production is on our board.</h3>
          <p>Thanks—we’ve captured your brief and indicative budget of <b>₱{estimate.toLocaleString()}</b>. In a live deployment this connects directly to your CRM or booking inbox.</p>
          <button onClick={() => setSent(false)}>Start another request</button>
        </div>
      ) : (
        <form className="booking-form" onSubmit={submit}>
          <div className="form-step"><span>01</span><div><b>Production level</b><small>Pick a starting point</small></div></div>
          <div className="package-options">
            {packages.map((pkg) => <label className={selected === pkg.id ? "package-radio selected" : "package-radio"} key={pkg.id}>
              <input type="radio" name="package" value={pkg.id} checked={selected === pkg.id} onChange={() => setSelected(pkg.id)}/>
              <span><b>{pkg.eyebrow}</b><small>From ₱{pkg.price.toLocaleString()}</small></span><i/>
            </label>)}
          </div>
          <div className="form-step"><span>02</span><div><b>Event details</b><small>Help us size the room</small></div></div>
          <div className="input-grid">
            <label>Event type<select required defaultValue=""><option value="" disabled>Select event type</option><option>Corporate conference</option><option>Product launch</option><option>Town hall</option><option>Awards / gala</option><option>Concert / live show</option><option>Broadcast only</option></select></label>
            <label>Event date<span className="input-icon"><input type="date" required/><Icon name="calendar" size={18}/></span></label>
            <label>Venue / city<input type="text" placeholder="Venue or city" required/></label>
            <label>Expected guests<input type="number" min="1" value={attendance} onChange={(e) => setAttendance(Number(e.target.value))} required/></label>
          </div>
          <div className="form-step"><span>03</span><div><b>Add to the show</b><small>Optional production layers</small></div></div>
          <div className="addons">
            {addons.map(([id, label, price]) => <label className={selectedAddons.includes(id) ? "addon checked" : "addon"} key={id}>
              <input type="checkbox" checked={selectedAddons.includes(id)} onChange={() => toggleAddon(id)}/>
              <span><Icon name={selectedAddons.includes(id) ? "check" : "plus"} size={17}/></span><b>{label}</b><small>+₱{price.toLocaleString()}</small>
            </label>)}
          </div>
          <div className="form-step"><span>04</span><div><b>Your details</b><small>Where should we send the proposal?</small></div></div>
          <div className="input-grid">
            <label>Name<input type="text" placeholder="Your full name" required/></label>
            <label>Work email<input type="email" placeholder="you@company.com" required/></label>
            <label className="wide">Anything we should know?<textarea placeholder="Tell us about the audience, venue, creative idea or technical challenge…" rows="4"/></label>
          </div>
          <div className="estimate-row"><div><small>INDICATIVE STARTING ESTIMATE</small><strong>₱{estimate.toLocaleString()}</strong><span>Final quote follows technical review</span></div><button type="submit">Request availability <Icon name="arrow" size={19}/></button></div>
        </form>
      )}
    </section>
  );
}

export default function Home() {
  const [chosenPackage, setChosenPackage] = useState("signature");
  const scrollToBooking = () => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
  const choosePackage = (id) => { setChosenPackage(id); setTimeout(scrollToBooking, 0); };

  return (
    <main id="top">
      <Header onBook={scrollToBooking}/>
      <section className="hero">
        <Image className="hero-image" src="/decat-event-hero.png" alt="Large corporate event stage with LED screens, lights and a camera operator" fill priority sizes="100vw"/>
        <div className="hero-scrim"/>
        <div className="hero-grid" aria-hidden="true"/>
        <div className="hero-copy">
          <p className="kicker"><span/> LIVE EVENTS · BROADCAST · FILM</p>
          <h1>Every signal.<br/>Every second.<br/><em>Made unforgettable.</em></h1>
          <p className="hero-sub">We design and deliver high-stakes events for brands that can’t afford an ordinary show.</p>
          <div className="hero-actions"><button onClick={scrollToBooking}>Book your production <Icon name="arrow"/></button><a href="#work"><span><Icon name="play" size={18}/></span> Play showreel</a></div>
        </div>
        <div className="hero-side"><span>01 / 04</span><p>ONE TEAM.<br/>END-TO-END CONTROL.</p></div>
        <a className="scroll-cue" href="#services"><span>SCROLL TO EXPLORE</span><Icon name="down" size={16}/></a>
      </section>

      <div className="signal-strip">
        <div className="marquee-track">
          <div className="marquee-group">
            <span>STRATEGY</span><i/> <span>SCENIC</span><i/> <span>CONTENT</span><i/> <span>SHOW CONTROL</span><i/> <span>BROADCAST</span><i/> <span>DELIVERY</span><i/>
          </div>
          <div className="marquee-group">
            <span>STRATEGY</span><i/> <span>SCENIC</span><i/> <span>CONTENT</span><i/> <span>SHOW CONTROL</span><i/> <span>BROADCAST</span><i/> <span>DELIVERY</span><i/>
          </div>
        </div>
      </div>

      <section id="services" className="services section-pad">
        <SectionIntro label="One partner, every discipline" title={<>The room. The screen.<br/><em>Everything between.</em></>} copy="From the first cue to the final frame, one senior team owns the complete technical and creative picture."/>
        <div className="service-list">
          {services.map(([num, title, desc]) => <a href="#booking" className="service-row" key={num}><span>{num}</span><h3>{title}</h3><p>{desc}</p><i><Icon name="arrow" size={21}/></i></a>)}
        </div>
      </section>

      <section className="stats" aria-label="Company statistics">
        <div><strong>450<sup>+</sup></strong><span>shows delivered</span></div>
        <div><strong>98.7<sup>%</sup></strong><span>on-time cue rate</span></div>
        <div><strong>2.4<sup>M</sup></strong><span>livestream viewers</span></div>
        <div><strong>24<sup>/7</sup></strong><span>show-critical support</span></div>
      </section>

      <section id="work" className="work section-pad">
        <div className="work-head"><SectionIntro label="Selected work" title={<>When it has<br/><em>to land.</em></>}/><a href="#booking">View all projects <Icon name="arrow"/></a></div>
        <div className="projects">
          {projects.map((project, index) => <article className={`project-card ${project.className}`} key={project.title}>
            <div className="project-visual"><span className="project-number">0{index + 1}</span><div className="stage-lines"/><button aria-label={`View ${project.title}`}><Icon name="arrow" size={22}/></button></div>
            <p>{project.tag}</p><h3>{project.title}</h3><span>{project.meta}</span>
          </article>)}
        </div>
      </section>

      <Pricing onChoose={choosePackage}/>

      <section className="testimonial section-pad">
        <p className="kicker"><span/> FROM THE CONTROL ROOM</p>
        <blockquote>“DECAT didn’t feel like a supplier. They felt like the calmest, smartest people on our team—especially when the brief changed two hours before doors.”</blockquote>
        <div><span className="avatar">AM</span><p><b>Avery Morgan</b><small>Director of Brand Experience · North/One</small></p></div>
      </section>

      <Booking chosenPackage={chosenPackage}/>

      <footer>
        <div className="footer-top"><Logo/><h2>Make the next<br/>one <em>matter.</em></h2><button onClick={scrollToBooking}>Start a project <Icon name="arrow"/></button></div>
        <div className="footer-grid"><div><small>NEW BUSINESS</small><a href="mailto:hello@decatmultimedia.com">hello@decatmultimedia.com</a><a href="tel:+639171234567">+63 917 123 4567</a></div><div><small>STUDIO</small><p>Philippines<br/>Available nationwide</p></div><div><small>FOLLOW</small><a href="#">Facebook</a><a href="#">Instagram</a><a href="#">LinkedIn</a></div></div>
        <div className="footer-bottom"><span>© 2026 DECAT MULTIMEDIA</span><span>Built for live moments</span><a href="#top">Back to top ↑</a></div>
      </footer>
    </main>
  );
}
