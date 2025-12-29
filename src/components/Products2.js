export default function Products2({ products = [] }) {
  if (!Array.isArray(products)) return null;

  const typeStyle = (type) => {
    switch (type) {
      case "sale":
        return { label: "بيع", color: "#198754" };
      case "donate":
        return { label: "تبرع", color: "#0d6efd" };
      case "exchange":
        return { label: "تبادل", color: "#fd7e14" };
      default:
        return { label: "منتج", color: "#6c757d" };
    }
  };

  const getFirstImage = (p) => {
    if (Array.isArray(p?.images) && p.images.length) return p.images[0];
    if (p?.image_url) return p.image_url;
    return null;
  };

  const normalizePhone = (phone) => String(phone || "").replace(/\D/g, "");

  return (
    <div className="products-wrapper" style={{ padding: "0" }}>
      <div
        className="products-grid"
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        }}
      >
        {products.map((p) => {
          const badge = typeStyle(p.type);
          const img = getFirstImage(p);

          const name = p?.name || "بدون اسم";
          const desc = p?.description || "";
          const price = p?.price;

          // بيانات تواصل (حسب الموجود في view)
          const contactName = p?.contact_name || p?.owner_name || "";
          const phone = p?.phone || "";
          const address = p?.address || "";

          const phoneClean = normalizePhone(phone);
          const hasContact = !!(contactName || phone || address);

          return (
            <div
              key={`${p.type}-${p.id}`}
              style={{
                border: "1px solid #eee",
                borderRadius: "12px",
                padding: "10px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                position: "relative",
                background: "#fff",
              }}
            >
              {/* Badge */}
              <span
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  backgroundColor: badge.color,
                  color: "#fff",
                  padding: "2px 8px",
                  fontSize: "0.75rem",
                  borderRadius: "12px",
                }}
              >
                {badge.label}
              </span>

              {/* Image */}
              {img ? (
                <img
                  src={img}
                  alt={name}
                  style={{
                    width: "100%",
                    height: "170px",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "170px",
                    borderRadius: "10px",
                    background: "#f5f5f5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#888",
                    fontSize: "0.9rem",
                  }}
                >
                  لا توجد صورة
                </div>
              )}

              {/* Title */}
              <h5 style={{ margin: "4px 0" }}>{name}</h5>

              {/* Description */}
              {desc ? (
                <p style={{ margin: 0, fontSize: "0.92rem", color: "#666" }}>
                  {desc}
                </p>
              ) : null}

              {/* Contact info */}
              {hasContact && (
                <div
                  style={{
                    marginTop: "4px",
                    paddingTop: "8px",
                    borderTop: "1px dashed #eee",
                    fontSize: "0.9rem",
                    color: "#444",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  {contactName && (
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-person-fill text-secondary"></i>
                      <span>{contactName}</span>
                    </div>
                  )}

                  {phone && (
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-telephone-fill text-success"></i>
                      <span>{phone}</span>

                      <div className="ms-auto d-flex gap-1">
                        <a
                          href={`tel:${phoneClean || phone}`}
                          className="btn btn-sm btn-outline-success"
                          title="اتصال"
                        >
                          <i className="bi bi-telephone"></i>
                        </a>

                        {phoneClean && (
                          <a
                            href={`https://wa.me/${phoneClean}`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-sm btn-success"
                            title="واتساب"
                          >
                            <i className="bi bi-whatsapp"></i>
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {address && (
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-geo-alt-fill text-danger"></i>
                      <span>{address}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Footer (price / empty) */}
              <div style={{ marginTop: "auto" }}>
                {price !== null && price !== undefined && price !== "" ? (
                  <p style={{ margin: "8px 0 0", fontWeight: "bold" }}>
                    {price} $
                  </p>
                ) : (
                  <p
                    style={{
                      margin: "8px 0 0",
                      color: "#888",
                      fontSize: "0.85rem",
                    }}
                  >
                    بدون سعر
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 992px) {
          .products-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
        }
        @media (max-width: 576px) {
          .products-grid { grid-template-columns: repeat(1, minmax(0, 1fr)) !important; }
        }
      `}</style>
    </div>
  );
}
