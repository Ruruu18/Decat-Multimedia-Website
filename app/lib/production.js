export const disciplines = [
  { id: "live", number: "01", title: "Live production", description: "From the first cue to the final applause.", items: [["Corporate events", "Planning, technical direction, and show calling."], ["LED & staging", "Screens, rigging, and scenic integration."], ["Sound systems", "Clear, consistent audio across the room."]] },
  { id: "broadcast", number: "02", title: "Broadcast", description: "Bring every audience into the room.", items: [["Livestreaming", "Multi-camera streams and remote contributors."]] },
  { id: "content", number: "03", title: "Visual content", description: "Make the moment last beyond the event.", items: [["Photography", "Event coverage, portraits, and press-ready images."], ["Videography", "Same-day edits (SDE), highlights, and social cuts."]] },
];

export const packages = [
  { id: "essential", name: "Essential", price: 85000, guests: 150, description: "For focused, smaller events.", features: ["PA + 4 wireless mics", "Presentation display", "On-site technical crew"] },
  { id: "signature", name: "Signature", price: 195000, guests: 500, description: "A complete event production.", features: ["LED stage canvas", "Multi-camera recording", "Show caller + full crew"] },
  { id: "broadcast", name: "Broadcast+", price: 350000, guests: 1500, description: "In the room. Around the world.", features: ["Broadcast livestream", "Custom scenic + content", "Redundant signal path"] },
];

export const addons = [
  { id: "livestream", name: "Livestream", price: 75000 },
  { id: "photo", name: "Photography", price: 25000 },
  { id: "film", name: "Highlight video", price: 55000 },
  { id: "led", name: "Extra LED wall", price: 95000 },
];

export const currency = (value) => `₱${value.toLocaleString("en-PH")}`;

export function getEstimate(packageId, attendance, addonIds) {
  const selected = packages.find((item) => item.id === packageId);
  if (!selected) return null;
  const extraGuests = Math.max(0, Number(attendance || 0) - selected.guests);
  return selected.price + Math.ceil(extraGuests / 100) * 15000 + addons.filter((item) => addonIds.includes(item.id)).reduce((total, item) => total + item.price, 0);
}
