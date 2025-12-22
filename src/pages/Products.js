import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Products2 from "../components/Products2"; // عدّل المسار إذا لزم

export default function Products() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchProducts = async () => {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (!mounted) return;

      if (error) {
        console.error("Fetch products error:", error);
        setError(error.message || "حدث خطأ أثناء جلب المنتجات");
        setProducts([]);
      } else {
        setProducts(Array.isArray(data) ? data : []);
      }

      setLoading(false);
    };

    fetchProducts();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;

    return products.filter((p) => {
      const name = (p.name || "").toLowerCase();
      const desc = (p.description || "").toLowerCase();
      return name.includes(q) || desc.includes(q);
    });
  }, [products, query]);

  return (
    <div style={{ paddingTop: "90px" }}>
      <div className="container">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
          <div>
            <h2 className="fw-bold" style={{ margin: 0 }}>
              منتجاتنا
            </h2>
            <p style={{ margin: 0, color: "#666" }}>
              تصفّح المنتجات وابحث بسهولة
            </p>
          </div>

          <div style={{ minWidth: 260, maxWidth: 420, width: "100%" }}>
            <input
              className="form-control"
              placeholder="ابحث عن منتج..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {loading && <p className="text-center p-4">جاري تحميل المنتجات...</p>}

        {!loading && error && (
          <p className="text-center p-4 text-danger">حدث خطأ: {error}</p>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <p className="text-center p-4">لا يوجد منتجات حاليًا.</p>
        )}

        {!loading && !error && filteredProducts.length > 0 && (
          <Products2 products={filteredProducts} />
        )}
      </div>
    </div>
  );
}
