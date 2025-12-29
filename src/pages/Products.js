import React, { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Products2 from "../components/Products2";

export default function Products({ mode = "all" }) {
  const PAGE_SIZE = mode === "home" ? 3 : 16;

  const [items, setItems] = useState([]);
  const [firstLoad, setFirstLoad] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [err, setErr] = useState("");
  const [hasMore, setHasMore] = useState(mode !== "home");

  // ✅ Filters
  const [search, setSearch] = useState("");
  const [gov, setGov] = useState("all");
  const [type, setType] = useState("all"); // all | sale | donate | exchange | product
  const [sort, setSort] = useState("newest"); // newest | oldest | price_asc | price_desc

  const offsetRef = useRef(0);
  const seenRef = useRef(new Set());
  const sentinelRef = useRef(null);
  const inFlightRef = useRef(false);

  // استخراج المحافظة (يدعم governorate أو address)
  const getGov = (p) => {
    if (p?.governorate) return String(p.governorate).trim();
    const a = String(p?.address || "").trim();
    if (!a) return "";
    return a.split("-")[0].split("،")[0].trim();
  };

  const fetchBatch = async (isFirst = false) => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;

    try {
      if (isFirst) {
        setErr("");
        offsetRef.current = 0;
        seenRef.current = new Set();
        setLoading(true);
        setItems([]);
        setHasMore(mode !== "home");
      } else {
        setLoadingMore(true);
      }

      const from = offsetRef.current;
      const to = from + PAGE_SIZE - 1;

      const { data, error } = await supabase
        .from("all_products")
        .select("*")
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;

      const batch = Array.isArray(data) ? data : [];

      // dedupe
      const deduped = [];
      for (const x of batch) {
        const key = `${x.type}-${x.id}`;
        if (!seenRef.current.has(key)) {
          seenRef.current.add(key);
          deduped.push(x);
        }
      }

      setItems((prev) => (isFirst ? deduped : [...prev, ...deduped]));

      if (mode === "home") {
        setHasMore(false);
      } else {
        if (batch.length < PAGE_SIZE) setHasMore(false);
      }

      offsetRef.current += PAGE_SIZE;
    } catch (e) {
      console.error(e);
      setErr(e?.message || "فشل جلب المنتجات");
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setFirstLoad(false);
      inFlightRef.current = false;
    }
  };

  // أول تحميل
  useEffect(() => {
    fetchBatch(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // infinite scroll فقط في صفحة المنتجات
  useEffect(() => {
    if (mode === "home") return;
    const el = sentinelRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !loading && !loadingMore && hasMore) {
          fetchBatch(false);
        }
      },
      { root: null, rootMargin: "300px", threshold: 0 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [mode, hasMore, loading, loadingMore]);

  // ✅ قوائم المحافظات من البيانات المحمّلة
  const governorates = useMemo(() => {
    const set = new Set();
    items.forEach((p) => {
      const g = getGov(p);
      if (g) set.add(g);
    });
    return ["all", ...Array.from(set).sort((a, b) => a.localeCompare(b, "ar"))];
  }, [items]);

  // ✅ تطبيق الفلاتر
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    let arr = items.filter((p) => {
      // فلتر المحافظة
      if (gov !== "all") {
        const g = getGov(p);
        if (g !== gov) return false;
      }

      // فلتر النوع
      if (type !== "all") {
        const t = String(p?.type || "product");
        if (t !== type) return false;
      }

      // البحث
      if (q) {
        const name = String(p?.name || "").toLowerCase();
        const desc = String(p?.description || "").toLowerCase();
        const addr = String(p?.address || "").toLowerCase();
        if (!name.includes(q) && !desc.includes(q) && !addr.includes(q)) return false;
      }

      return true;
    });

    // الفرز
    arr.sort((a, b) => {
      if (sort === "oldest") return new Date(a.created_at) - new Date(b.created_at);
      if (sort === "price_asc") return (Number(a.price) || 0) - (Number(b.price) || 0);
      if (sort === "price_desc") return (Number(b.price) || 0) - (Number(a.price) || 0);
      return new Date(b.created_at) - new Date(a.created_at);
    });

    return arr;
  }, [items, search, gov, type, sort]);

  const showEmpty = !firstLoad && !loading && !filtered.length && !err;

  return (
    <div className="container py-3">
      {/* ✅ شريط الفلاتر (فقط products page) */}
      {mode !== "home" && (
        <div className="card mb-3" style={{ borderRadius: 12, border: "1px solid #eee" }}>
          <div className="card-body">
            <div className="row g-2 align-items-center">
              <div className="col-12 col-md-5 m-0">
                <div className="input-group">
                  <input
                    className="form-control"
                    placeholder="ابحث عن منتج..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-6 col-md-3">
                <select className="form-select" value={gov} onChange={(e) => setGov(e.target.value)}>
                  {governorates.map((g) => (
                    <option key={g} value={g}>
                      {g === "all" ? "كل المحافظات" : g}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-6 col-md-2">
                <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="all">كل الأنواع</option>
                  <option value="sale">بيع</option>
                  <option value="exchange">تبادل</option>
                  <option value="donate">تبرع</option>
                  <option value="product">منتج</option>
                </select>
              </div>

              <div className="col-12 col-md-2">
                <select className="form-select" value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="newest">الأحدث</option>
                  <option value="oldest">الأقدم</option>
                  <option value="price_asc">السعر: الأقل</option>
                  <option value="price_desc">السعر: الأعلى</option>
                </select>
              </div>
            </div>

            <div className="d-flex justify-content-between mt-2">
              <small className="text-muted">النتائج: {filtered.length}</small>

              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => {
                  setSearch("");
                  setGov("all");
                  setType("all");
                  setSort("newest");
                }}
              >
                تصفير الفلاتر
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Errors */}
      {err && (
        <div style={{ padding: 20, textAlign: "center" }}>
          <p style={{ color: "red" }}>{err}</p>
          <button className="btn btn-success" onClick={() => fetchBatch(true)}>
            إعادة المحاولة
          </button>
        </div>
      )}

      {/* First load */}
      {firstLoad && loading && <p style={{ padding: 20, textAlign: "center" }}>Loading...</p>}

      {/* Empty */}
      {showEmpty && <p style={{ padding: 20, textAlign: "center" }}>لا يوجد منتجات حالياً.</p>}

      {/* Products */}
      {!!filtered.length && <Products2 products={filtered} />}

      {/* Sentinel + footer */}
      {mode !== "home" && (
        <>
          <div ref={sentinelRef} style={{ height: 1 }} />
          {!firstLoad && !!filtered.length && (
            <div className="d-flex justify-content-center my-4">
              {hasMore ? (
                loadingMore ? (
                  <div className="d-flex align-items-center gap-2">
                    <div className="spinner-border text-success" role="status" />
                    <span className="text-muted">جاري تحميل المزيد...</span>
                  </div>
                ) : (
                  <span className="text-muted">انزل لتظهر منتجات أكثر…</span>
                )
              ) : (
                <span className="text-muted">وصلت لآخر المنتجات!</span>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
