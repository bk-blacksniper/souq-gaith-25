
export function getUser() {
  try { return JSON.parse(localStorage.getItem('user')||'null'); } catch { return null; }
}
export function getToken() { return localStorage.getItem('token'); }
export function isAdmin() { return getUser()?.role === 'ADMIN'; }
export function requireAuthRedirect(navigate) {
  if (!getToken()) navigate('/login');
}
