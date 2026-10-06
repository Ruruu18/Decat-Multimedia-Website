"use client";

import { useState } from "react";
import { packages, addons, currency, getEstimate } from "../lib/production";
import { Arrow } from "./ui";

export default function BookingForm({ initialPackage, service }) {
  const [selected, setSelected] = useState(initialPackage);
  const [attendance, setAttendance] = useState("");
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [draft, setDraft] = useState(null);
  const [copyStatus, setCopyStatus] = useState("");
  const estimate = getEstimate(selected, attendance, selectedAddons);
  const selectedPackage = packages.find((item) => item.id === selected);
  const toggleAddon = (id) => setSelectedAddons((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

  const prepareInquiry = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = [
      "Hello DECAT,", "", "I'd like to discuss a production.", "",
      `Name: ${data.get("name")}`, `Email: ${data.get("email")}`,
      `Event: ${data.get("eventType")}`, `Date: ${data.get("date") || "To be confirmed"}`,
      `Venue: ${data.get("venue") || "To be confirmed"}`, `Guests: ${attendance || "To be confirmed"}`,
      `Package: ${selectedPackage?.name || "Please recommend"}`,
      ...(service ? [`Interest: ${{ live: "Live production", broadcast: "Broadcast", content: "Visual content" }[service]}`] : []),
      `Extras: ${addons.filter((item) => selectedAddons.includes(item.id)).map((item) => item.name).join(", ") || "None"}`,
      ...(estimate !== null ? [`Starting estimate: ${currency(estimate)} (subject to technical review)`] : []),
      ...(data.get("notes") ? ["", `Notes: ${data.get("notes")}`] : []),
    ].join("\n");
    setCopyStatus("");
    setDraft({ body, url: `mailto:hello@decatmultimedia.com?subject=${encodeURIComponent(`Production inquiry — ${data.get("eventType")}`)}&body=${encodeURIComponent(body)}` });
  };

  async function copyInquiry() {
    try { await navigator.clipboard.writeText(draft.body); setCopyStatus("Inquiry copied."); }
    catch { setCopyStatus("Copy unavailable. Select the inquiry below to copy it."); }
  }

  return <div className="booking-panel">
    <form className="booking-form" onSubmit={prepareInquiry} onChange={() => { setDraft(null); setCopyStatus(""); }}>
      <div className="form-heading"><h2>Your project</h2><span>Let’s keep it simple.</span></div>
      <div className="input-grid">
        <label>Name<input autoComplete="name" name="name" placeholder="Your name" maxLength={100} required /></label>
        <label>Email<input autoComplete="email" type="email" name="email" placeholder="you@company.com" maxLength={160} required /></label>
        <label>Event type<select name="eventType" defaultValue={service === "broadcast" ? "Broadcast / livestream" : service === "content" ? "Photo / video production" : ""} required><option value="" disabled>Select an event</option><option>Corporate event</option><option>Product launch</option><option>Town hall</option><option>Awards / gala</option><option>Concert / live show</option><option>Broadcast / livestream</option><option>Photo / video production</option><option>Other</option></select></label>
        <label>Event date <span className="optional">Optional</span><input aria-label="Event date" type="date" name="date" /></label>
        <label>Venue / city <span className="optional">Optional</span><input name="venue" placeholder="Where is it happening?" maxLength={160} /></label>
        <label>Guests <span className="optional">Optional</span><input name="guests" type="number" min="1" max="1000000" step="1" inputMode="numeric" placeholder="Approx. number" value={attendance} onChange={(event) => setAttendance(event.target.value)} /></label>
        <label className="wide">Production package<select name="package" value={selected} onChange={(event) => setSelected(event.target.value)}><option value="">Help me choose</option>{packages.map((item) => <option value={item.id} key={item.id}>{item.name} — from {currency(item.price)}</option>)}</select></label>
      </div>
      <details className="optional-details"><summary><span>Extras & notes <small>Optional</small></span><span className="details-plus" aria-hidden="true">+</span></summary><div className="details-content"><fieldset className="addons"><legend className="sr-only">Production extras</legend>{addons.map((item) => <label className="addon" key={item.id}><input type="checkbox" name="extras" value={item.id} checked={selectedAddons.includes(item.id)} onChange={() => toggleAddon(item.id)} /><span>{item.name}<small>+{currency(item.price)}</small></span></label>)}</fieldset><label className="notes-label">Anything else?<textarea name="notes" rows="2" maxLength={1500} placeholder="A brief, an idea, or a specific requirement." /></label></div></details>
      <div className="form-bottom"><div className="estimate" aria-live="polite" aria-atomic="true"><span>{estimate === null ? "TAILORED TO YOUR EVENT" : "STARTING ESTIMATE"}</span><strong>{estimate === null ? "Let’s find the right fit." : currency(estimate)}</strong></div><button className="button" type="submit">Prepare inquiry <Arrow /></button></div>
      <p className="form-note">Review your inquiry, then send it with your email app.{estimate !== null && " Estimate excludes venue, travel, and taxes."}</p>
    </form>
    {draft && <div className="inquiry-draft"><div role="status"><h3>Your inquiry is ready.</h3><p>Open your email app to send it to DECAT.</p></div><div className="draft-actions"><a className="button button-small" href={draft.url}>Open email app <Arrow diagonal /></a><button className="text-link" type="button" onClick={copyInquiry}>Copy inquiry</button></div><details className="draft-preview"><summary>Review inquiry</summary><pre>{draft.body}</pre></details>{copyStatus && <p className="copy-status" role="status">{copyStatus}</p>}</div>}
  </div>;
}
