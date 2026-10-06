import Link from "next/link";
import { Arrow, PageIntro, ProjectCTA } from "../components/ui";
import { disciplines } from "../lib/production";

export const metadata = { title: "Services", description: "Live production, broadcast, photography, and videography. One team for every part of your event." };

export default function Services() {
  return <><div className="container page-content"><PageIntro label="OUR SERVICES" title={<>Everything your<br /><span>event needs.</span></>}>Creative and technical production, under one roof.</PageIntro><div className="service-groups">{disciplines.map((group) => <section className="service-group" id={group.id} key={group.id}><div className="service-group-title"><span className="index">{group.number}</span><h2>{group.title}</h2><p>{group.description}</p><Link href={`/contact?service=${group.id}`} className="text-link">Discuss your project <Arrow diagonal /></Link></div><div className="service-items">{group.items.map(([title, description]) => <div className="service-item" key={title}><h3>{title}</h3><p>{description}</p></div>)}</div></section>)}</div></div><ProjectCTA /></>;
}
