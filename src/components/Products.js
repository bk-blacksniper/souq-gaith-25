import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Products2 from "../components/Products2";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const { data, error } = await supabase
        .from("sale")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Fetch error:", error);
        setProducts([]);
      } else {
        console.log("ALL_PRODUCTS FROM DB:", data); // 👈 مهم
        setProducts(data || []);
      }

      setLoading(false);
    };

    fetchAll();
  }, []);

  if (loading) {
    return <p style={{ padding: 20, textAlign: "center" }}>Loading...</p>;
  }

  return (
    <div style={{ paddingTop: "90px" }}>
      <Products2 products={products} />
    </div>
  );
}
