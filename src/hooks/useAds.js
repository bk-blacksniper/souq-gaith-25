
import { useEffect, useState } from 'react';
import { getAds } from '../lib/api';

export default function useAds(params) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(()=>{
    let ignore=false;
    setLoading(true);
    getAds(params).then(d=>{
      if (ignore) return;
      setItems(d.items||[]);
      setTotal(d.total||0);
    }).catch(e=> setError(e.message)).finally(()=> setLoading(false));
    return ()=>{ ignore=true; };
  }, [JSON.stringify(params)]);

  return { items, total, loading, error };
}
