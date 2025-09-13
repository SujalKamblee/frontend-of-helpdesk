import React from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import "./styles.css";

function Navbar() {
const linkClass = ({ isActive }) =>
"nav-link" + (isActive ? " active" : "");
return (
<header className="navbar">
<div className="container nav-inner">
<div className="brand">
<span className="logo-dot" />
Helpdesk Assistant
</div>
<nav className="nav-links">
<NavLink to="/" end className={linkClass}>Home</NavLink>
<NavLink to="/chat" className={linkClass}>Chat</NavLink>
<NavLink to="/admin" className={linkClass}>Admin</NavLink>
</nav>
</div>
</header>
);
}

export default function App() {
return (
<BrowserRouter>
<Navbar />
<main className="main-shell">
<Routes>
<Route path="/" element={<HomePage />} />
<Route path="/chat" element={<ChatPage />} />
<Route path="/admin" element={<AdminPage />} />
</Routes>
</main>
</BrowserRouter>
);
}