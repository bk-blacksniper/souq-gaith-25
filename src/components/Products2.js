export default function Products2({ products = [] }) {
  if (!Array.isArray(products)) {
    console.error("Products2: 'products' prop is not an array:", products)
    return null
  }

  return (
    <div className="products-wrapper" style={{ padding: "1rem" }}>
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
                alt={p.name}
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
  )
}
