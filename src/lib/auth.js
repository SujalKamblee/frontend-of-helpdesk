export function getToken() {
return sessionStorage.getItem("jwt") || null;
}
export function setToken(t) {
if (t) sessionStorage.setItem("jwt", t);
}
export function clearToken() {
sessionStorage.removeItem("jwt");
}