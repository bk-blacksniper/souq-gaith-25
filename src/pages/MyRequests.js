import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function MyRequests() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sales, setSales] = useState([]);
  const [donations, setDonations] = useState([]);
  const [exchanges, setExchanges] = useState([]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);
      setError("");

      const { data: uData, error: uErr } = await supabase.auth.getUser();
      if (uErr || !uData?.user) {
        setError("يجب تسجيل الدخول لعرض طلباتك");
        setLoading(false);
        return;
      }
      const userId = uData.user.id;

      const [s, d, e] = await Promise.all([
        supabase.from("sales").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
        supabase.from("donations").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
        supabase.from("exchanges").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      ]);

      if (!mounted) return;

      if (s.error || d.error || e.error) {
        setError(s.error?.message || d.error?.message || e.error?.message || "حدث خطأ");
      } else {
        setSales(s.data || []);
        setDonations(d.data || []);
        setExchanges(e.data || []);
      }

      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <p className="text-center p-4">جاري التحميل...</p>;
  if (error) return <p className="text-center p-4 text-danger">{error}</p>;

  const Empty = <p className="text-center p-4">لا يوجد طلبات.</p>;

  return (
    <div style={{ paddingTop: "90px" }}>
      <div className="container">        

        {/* SALES */}
        <section className="mb-4">
          <h4>طلبات البيع</h4>
          {sales.length === 0 ? Empty : (
            <ul className="list-group">
              {sales.map((x) => (
                <li key={x.id} className="list-group-item">
                  <strong>{x.product_name}</strong> — السعر: {x.price}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* DONATIONS */}
        <section className="mb-4">
          <h4>طلبات التبرع</h4>
          {donations.length === 0 ? Empty : (
            <ul className="list-group">
              {donations.map((x) => (
                <li key={x.id} className="list-group-item">
                  <strong>{x.item_name}</strong>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* EXCHANGES */}
        <section className="mb-4">
          <h4>طلبات التبادل</h4>
          {exchanges.length === 0 ? Empty : (
            <ul className="list-group">
              {exchanges.map((x) => (
                <li key={x.id} className="list-group-item">
                  <strong>{x.offered_item}</strong>
                  {x.desired_item ? ` ↔ ${x.desired_item}` : ""}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
