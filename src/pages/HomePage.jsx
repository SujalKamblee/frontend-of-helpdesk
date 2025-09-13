import React from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
const nav = useNavigate();
return (
<section className="home-hero">
<div className="hero-aurora" />
<div className="home-wrap">
<h1 className="home-title">Welcome to your Help Assistant</h1>
<p className="home-sub">Get quick, step-by-step guidance for common tasks.</p>
<button className="home-cta" onClick={() => nav("/chat")} aria-label="Go to chat">
<span>Start</span>
<svg className="home-arrow" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
<path d="M5 12h14M13 5l7 7-7 7"/>
</svg>
</button>
<div className="home-tip">Tip: Try “reset password” or “apply leave”.</div>
</div>
</section>
);
}