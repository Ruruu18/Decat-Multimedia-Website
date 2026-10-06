import { PageIntro, Arrow } from "../components/ui";
import BookingForm from "../components/booking-form";
import { packages } from "../lib/production";

export const metadata = { title: "Contact", description: "Tell us about your next event. Plan your production with DECAT Multimedia." };

export default async function Contact({ searchParams }) {
  const query = await searchParams;
  const initialPackage = packages.some((item) => item.id === query.package) ? query.package : "";
  const service = ["live", "broadcast", "content"].includes(query.service) ? query.service : "";
  return <div className="container contact-page"><div className="contact-intro"><PageIntro label="START A PROJECT" title={<>Good things<br /><span>start here.</span></>}>A few details are all we need to get started.</PageIntro><div className="contact-details"><span className="eyebrow">PREFER A CONVERSATION?</span><a className="text-link" href="mailto:hello@decatmultimedia.com">hello@decatmultimedia.com <Arrow diagonal /></a><p>Surigao, Philippines.<br />Available nationwide.</p></div></div><BookingForm key={`${initialPackage}-${service}`} initialPackage={initialPackage} service={service} /></div>;
}
