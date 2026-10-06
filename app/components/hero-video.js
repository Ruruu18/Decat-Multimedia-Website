export default function HeroVideo() {
  return (
    <video
      className="hero-video"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster="/decat-event-hero.png"
      aria-hidden="true"
      tabIndex={-1}
    >
      <source src="/videos/DeCat%202.mp4" type="video/mp4" />
    </video>
  );
}
