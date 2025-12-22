
const API = process.env.REACT_APP_API_BASE || 'http://localhost:4000/api';
const getLang = () => (process.env.REACT_APP_LANG || localStorage.getItem('lang') || 'en');

export async function apiFetch(path, { method='GET', headers={}, body, auth=false, formData=false }={}) {
  const opts = { method, headers: { 'Accept-Language': getLang(), ...headers } };
  if (auth) {
    const token = localStorage.getItem('token');
    if (token) opts.headers['Authorization'] = `Bearer ${token}`;
  }
  if (formData) {
    opts.body = body;
  } else {
    if (body) {
      opts.headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(body);
    }
  }
  const res = await fetch(`${API}${path}`, opts);
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Request failed');
  return data.data;
}

// Auth
export const register = (payload)=> apiFetch('/auth/register', { method:'POST', body: payload });
export const login = async (email, password)=> {
  const data = await apiFetch('/auth/login', { method:'POST', body:{ email, password } });
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data;
};
export const logout = ()=> { localStorage.removeItem('token'); localStorage.removeItem('user'); };

// Categories & Ads
export const getCategories = ()=> apiFetch('/categories');
export const getAds = (params={})=> {
  const url = new URL(`${API}/ads`);
  Object.entries(params).forEach(([k,v])=> (v!=null && v!=='') && url.searchParams.set(k, v));
  return apiFetch(url.pathname + url.search, {});
};
export const getAd = (id)=> apiFetch(`/ads/${id}`);
export const getMyAds = ()=> apiFetch('/ads/me/mine', { auth:true });

export const createAd = (payload, files=[])=> {
  const fd = new FormData();
  Object.entries(payload).forEach(([k,v])=> v!=null && fd.append(k, v));
  files.forEach(f=> fd.append('images', f));
  return apiFetch('/ads', { method:'POST', auth:true, formData:true, body:fd });
};

export const updateAd = (id, payload, files=[])=> {
  const fd = new FormData();
  Object.entries(payload).forEach(([k,v])=> v!=null && fd.append(k, v));
  files.forEach(f=> fd.append('images', f));
  return apiFetch(`/ads/${id}`, { method:'PUT', auth:true, formData:true, body:fd });
};

export const deleteAd = (id)=> apiFetch(`/ads/${id}`, { method:'DELETE', auth:true });

// Admin
export const approveAd = (id)=> apiFetch(`/ads/${id}/approve`, { method:'PUT', auth:true });
export const rejectAd = (id)=> apiFetch(`/ads/${id}/reject`, { method:'PUT', auth:true });

export default API;
