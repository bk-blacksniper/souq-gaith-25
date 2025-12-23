// src/components/Products.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient"; // انتبه للمسار

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (!isMounted) return;

      if (error) {
        console.error(error);
        setError(error.message);
        setProducts([]);
      } else {
        setProducts(Array.isArray(data) ? data : []);
      }

      setLoading(false);
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <p className="text-center p-4">جاري تحميل المنتجات...</p>;
  }

  if (error) {
    return (
      <p className="text-center p-4 text-red-600">
        حدث خطأ أثناء جلب المنتجات: {error}
      </p>
    );
  }

  if (products.length === 0) {
    return <p className="text-center p-4">لا يوجد منتجات حاليًا.</p>;
  }

  return (
    <div className="products-wrapper container" style={{ padding: "1rem" }}>
      <div
        className="products-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem",
        }}
      >
        {products.map((p) => (
          <div
            key={p.id}
            className="product-card"
            style={{
              border: "1px solid #eee",
              borderRadius: "10px",
              padding: "10px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {p.image_url && (
              <img
                src={p.image_url}
                alt={p.name || "product"}
                style={{
                  width: "100%",
                  height: "160px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            )}

            <h3 style={{ margin: "4px 0" }}>{p.name}</h3>

            {p.description && (
              <p style={{ margin: 0, fontSize: "0.9rem", color: "#666" }}>
                {p.description}
              </p>
            )}

            <p
              style={{
                marginTop: "auto",
                fontWeight: "bold",
                fontSize: "1rem",
              }}
            >
              {p.price} $
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
