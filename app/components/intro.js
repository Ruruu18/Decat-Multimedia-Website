"use client";

import { useEffect, useRef, useState } from "react";
import Logo from "./logo";

// Timings in ms. The CSS for each phase lives under "Loading intro" in globals.css.
const MIN_LOADING = 1200; // earliest the wordmark may appear, measured from navigation start
const MAX_LOADING = 4500; // stop waiting on a slow page
const REVEAL = 1500; // wordmark build plus a short hold
const EXIT = 2200; // chevron wipe plus the hero entrance it starts
const NEXT = { loading: ["reveal", MAX_LOADING + 1000], reveal: ["exit", REVEAL], exit: ["done", EXIT] };

export default function Intro() {
  const [phase, setPhase] = useState("loading");
  const loaded = useRef(false);
  const covering = phase === "loading" || phase === "reveal";

  useEffect(() => {
    const markLoaded = () => { loaded.current = true; };
    if (document.readyState === "complete") markLoaded();
    else window.addEventListener("load", markLoaded, { once: true });
    return () => window.removeEventListener("load", markLoaded);
  }, []);

  useEffect(() => {
    if (!NEXT[phase]) return;
    const [next, delay] = NEXT[phase];
    const timer = setTimeout(() => setPhase(next), delay);
    return () => clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (!covering) return;
    document.documentElement.classList.add("intro-lock");
    return () => document.documentElement.classList.remove("intro-lock");
  }, [covering]);

  // The arrows keep pointing until the page is ready, then hand over between pulses so nothing jumps.
  const onPulse = (event) => {
    if (event.animationName !== "intro-point-lead") return;
    const now = performance.now();
    if (now >= MIN_LOADING && (loaded.current || now >= MAX_LOADING)) setPhase((current) => (current === "loading" ? "reveal" : current));
  };

  if (phase === "done") return null;

  return (
    <div className={`intro is-${phase}`} aria-hidden="true" onAnimationIteration={onPulse}>
      <noscript><style>{".intro{display:none}"}</style></noscript>
      <div className="intro-wipe"><span className="intro-stripe" /><span className="intro-panel" /></div>
      <Logo />
    </div>
  );
}
