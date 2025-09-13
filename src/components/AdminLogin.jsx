import React, { useState } from "react";
import { api } from "../lib/api.js";

export default function AdminLogin({ onToken }) {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [status, setStatus] = useState("");

const submit = async (e) => {
e.preventDefault();
setStatus("Logging in…");
try {
const token = await api.login(email, password);
onToken(token);
} catch (e) {
setStatus(String(e));
}
};

return (
<div className="panel">
<h4>Login</h4>
<form onSubmit={submit} className="form">
<label>Email</label>
<input value={email} onChange={(e) => setEmail(e.target.value)} />
<label>Password</label>
<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
<button className="primary" type="submit">Login</button>
</form>
{status && <div className="muted">{status}</div>}
</div>
);
}