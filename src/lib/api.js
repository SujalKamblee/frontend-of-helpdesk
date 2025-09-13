const BASE_URL = "http://localhost:8080/api";

async function http(url, opts = {}) {
const res = await fetch(url, opts);
if (!res.ok) {
const text = await res.text().catch(() => "");
throw new Error(`HTTP ${res.status}${text ? `— ${text}` : ""}`);
}
const ct = res.headers.get("content-type") || "";
if (ct.includes("application/json")) return res.json();
return ct ? res.text() : null;
}

export const api = {
// Public
listTopics() {
return http(`${BASE_URL}/topics`, {
headers: { Accept: "application/json" }
});
},
getTopic(id) {
return http(`${BASE_URL}/topics/${id}`, {

headers: { Accept: "application/json" }
});
},
searchTopics(query) {
return http(`${BASE_URL}/topics/search?query=${encodeURIComponent(query)}`, {
headers: { Accept: "application/json" }
});
},

// Auth
async login(email, password) {
const data = await http(`${BASE_URL}/auth/login`, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ email, password })
});
return data.token;
},

// Admin
adminListTopics(token) {
return http(`${BASE_URL}/admin/topics`, {

headers: { Authorization: `Bearer ${token}`, Accept: "application/json" }
});
},
adminCreateTopic(token, payload) {
return http(`${BASE_URL}/admin/topics`, {
method: "POST",
headers: {
"Content-Type": "application/json",
Authorization: `Bearer ${token}`
},
body: JSON.stringify(payload)
});
},
adminUpdateTopic(token, id, payload) {
return http(`${BASE_URL}/admin/topics/${id}`, {
method: "PUT",
headers: {
"Content-Type": "application/json",
Authorization: `Bearer ${token}`
},
body: JSON.stringify(payload)
});
},
adminDeleteTopic(token, id) {
return http(`${BASE_URL}/admin/topics/${id}`, {

method: "DELETE",
headers: { Authorization: `Bearer ${token}` }
});
}
};