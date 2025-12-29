import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function MyRequests() {
  const BUCKET = "product-images";

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // صور جديدة (متعددة)
  const [newFiles, setNewFiles] = useState([]); // File[]
  const [newPreviews, setNewPreviews] = useState([]); // string[]

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    desired_item: "",
    phone: "",
    address: "",
  });

  const getImages = (p) => (Array.isArray(p?.images) ? p.images : []);

  const badge = (type) => {
    if (type === "sale") return "بيع";
    if (type === "donate") return "تبرع";
    if (type === "exchange") return "تبادل";
    return "منتج";
  };

  // استخراج مسار الملف من publicUrl
  // https://xxx.supabase.co/storage/v1/object/public/product-images/<PATH>
  const extractStoragePathFromPublicUrl = (publicUrl) => {
    if (!publicUrl) return null;
    const marker = `/storage/v1/object/public/${BUCKET}/`;
    const idx = publicUrl.indexOf(marker);
    if (idx === -1) return null;
    return publicUrl.substring(idx + marker.length); // "userid/filename.png"
  };

  const removeFromStorageIfPossible = async (publicUrl) => {
    const path = extractStoragePathFromPublicUrl(publicUrl);
    if (!path) return;

    const { error } = await supabase.storage.from(BUCKET).remove([path]);
    if (error) {
      // ما نوقف التطبيق بسبب فشل الحذف، بس بنحذّر
      console.warn("Storage remove failed:", error.message);
    }
  };

  const loadMyRequests = async () => {
    setLoading(true);
    setErr("");

    const { data: u } = await supabase.auth.getUser();
    const user = u?.user;

    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("all_products")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setErr(error.message || "فشل جلب طلباتك");
      setItems([]);
    } else {
      setItems(Array.isArray(data) ? data : []);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadMyRequests();
  }, []);

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      name: item.name || "",
      description: item.description || "",
      price: item.price ?? "",
      desired_item: item.desired_item || "",
      phone: item.phone || "",
      address: item.address || "",
    });

    // reset new images
    newPreviews.forEach((u) => URL.revokeObjectURL(u));
    setNewFiles([]);
    setNewPreviews([]);

    setErr("");
    setEditOpen(true);
  };

  const closeEdit = () => {
    setEditOpen(false);
    setEditing(null);

    newPreviews.forEach((u) => URL.revokeObjectURL(u));
    setNewFiles([]);
    setNewPreviews([]);
    setErr("");
  };

  // =========================
  // Upload images (multiple)
  // =========================
  const uploadManyAndGetUrls = async (files) => {
    const { data: u } = await supabase.auth.getUser();
    const user = u?.user;
    if (!user) throw new Error("يجب تسجيل الدخول");

    setUploading(true);
    try {
      const urls = [];

      for (const file of files) {
        const ext = file.name.split(".").pop();
        const fileName = `${user.id}/${Date.now()}-${Math.random()
          .toString(16)
          .slice(2)}.${ext}`;

        const { error: upErr } = await supabase.storage
          .from(BUCKET)
          .upload(fileName, file, { upsert: false });

        if (upErr) throw upErr;

        const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
        const url = data?.publicUrl;
        if (!url) throw new Error("فشل استخراج رابط الصورة");

        urls.push(url);
      }

      return urls;
    } finally {
      setUploading(false);
    }
  };

  // =========================
  // DB update/delete helpers
  // =========================
  const updateInCorrectTable = async (item, payload, nextImages) => {
    const realId = item.id;

    if (item.type === "sale") {
      return supabase
        .from("sales")
        .update({
          product_name: payload.name,
          product_description: payload.description,
          price: payload.price,
          phone: payload.phone,
          address: payload.address,
          images: nextImages,
        })
        .eq("id", realId);
    }

    if (item.type === "donate") {
      return supabase
        .from("donations")
        .update({
          item_name: payload.name,
          item_description: payload.description,
          phone: payload.phone,
          address: payload.address,
          images: nextImages,
        })
        .eq("id", realId);
    }

    if (item.type === "exchange") {
      return supabase
        .from("exchanges")
        .update({
          offered_item: payload.name,
          description: payload.description,
          desired_item: payload.desired_item,
          phone: payload.phone,
          address: payload.address,
          images: nextImages,
        })
        .eq("id", realId);
    }

    // لو عندك products
    return supabase
      .from("products")
      .update({
        name: payload.name,
        description: payload.description,
        price: payload.price,
        // images: nextImages, // فعّلها إذا جدول products فيه images
      })
      .eq("id", realId);
  };

  const deleteFromCorrectTable = async (item) => {
    const realId = item.id;

    if (item.type === "sale") return supabase.from("sales").delete().eq("id", realId);
    if (item.type === "donate") return supabase.from("donations").delete().eq("id", realId);
    if (item.type === "exchange") return supabase.from("exchanges").delete().eq("id", realId);

    return supabase.from("products").delete().eq("id", realId);
  };

  // =========================
  // UI actions
  // =========================
  const onPickNewImages = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // تنظيف previews القديمة
    newPreviews.forEach((u) => URL.revokeObjectURL(u));

    setNewFiles(files);
    setNewPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const buildPayload = () => ({
    name: form.name.trim(),
    description: form.description.trim(),
    desired_item: form.desired_item.trim(),
    phone: form.phone.trim(),
    address: form.address.trim(),
    price:
      form.price === "" || form.price === null || form.price === undefined
        ? null
        : Number(form.price),
  });

  // ⭐ جعل صورة رئيسية
  const makePrimary = async (index) => {
    if (!editing) return;
    const imgs = getImages(editing);
    if (!imgs.length) return;

    const picked = imgs[index];
    const next = [picked, ...imgs.filter((_, i) => i !== index)];

    setSaving(true);
    setErr("");
    try {
      const payload = buildPayload();
      const { error } = await updateInCorrectTable(editing, payload, next);
      if (error) throw error;

      setEditing((prev) => ({ ...prev, images: next }));
      await loadMyRequests();
    } catch (e) {
      console.error(e);
      setErr(e?.message || "فشل تعيين الصورة الرئيسية");
    } finally {
      setSaving(false);
    }
  };

  // 🗑 حذف صورة من المعرض (DB + Storage)
  const deleteImageAt = async (index) => {
    if (!editing) return;
    const imgs = getImages(editing);
    const target = imgs[index];
    const next = imgs.filter((_, i) => i !== index);

    setSaving(true);
    setErr("");
    try {
      const payload = buildPayload();
      const { error } = await updateInCorrectTable(editing, payload, next);
      if (error) throw error;

      // حذف من التخزين (محاولة)
      await removeFromStorageIfPossible(target);

      setEditing((prev) => ({ ...prev, images: next }));
      await loadMyRequests();
    } catch (e) {
      console.error(e);
      setErr(e?.message || "فشل حذف الصورة");
    } finally {
      setSaving(false);
    }
  };

  // حفظ + إضافة صور (بدون حذف القديم)
  const saveAddImages = async () => {
    if (!editing) return;

    setSaving(true);
    setErr("");
    try {
      const payload = buildPayload();
      const oldImages = getImages(editing);

      let uploadedUrls = [];
      if (newFiles.length) uploadedUrls = await uploadManyAndGetUrls(newFiles);

      const nextImages = uploadedUrls.length ? [...uploadedUrls, ...oldImages] : oldImages;

      const { error } = await updateInCorrectTable(editing, payload, nextImages);
      if (error) throw error;

      closeEdit();
      await loadMyRequests();
    } catch (e) {
      console.error(e);
      setErr(e?.message || "فشل الحفظ");
    } finally {
      setSaving(false);
    }
  };

  // استبدال الرئيسية + حذف القديمة
  const saveReplacePrimary = async () => {
    if (!editing) return;

    if (!newFiles.length) {
      setErr("اختر صورة جديدة أولاً لاستبدال الرئيسية.");
      return;
    }

    setSaving(true);
    setErr("");
    try {
      const payload = buildPayload();
      const oldImages = getImages(editing);
      const oldPrimary = oldImages[0] || null;

      const uploadedUrls = await uploadManyAndGetUrls(newFiles);

      // اجعل أول uploaded هو الرئيسي، ثم باقي الصور الجديدة، ثم بقية القديمة بدون الأولى
      let nextImages = [uploadedUrls[0], ...oldImages.slice(1)];
      if (uploadedUrls.length > 1) {
        nextImages = [uploadedUrls[0], ...uploadedUrls.slice(1), ...oldImages.slice(1)];
      }

      const { error } = await updateInCorrectTable(editing, payload, nextImages);
      if (error) throw error;

      // حذف القديمة الرئيسية من Storage
      if (oldPrimary) await removeFromStorageIfPossible(oldPrimary);

      closeEdit();
      await loadMyRequests();
    } catch (e) {
      console.error(e);
      setErr(e?.message || "فشل استبدال الصورة الرئيسية");
    } finally {
      setSaving(false);
    }
  };

  // حذف الطلب بالكامل + حذف كل الصور
  const deleteRequest = async () => {
    if (!editing) return;
    const ok = window.confirm("متأكد بدك تحذف الطلب نهائيًا؟");
    if (!ok) return;

    setSaving(true);
    setErr("");
    try {
      const imgs = getImages(editing);

      // 1) حذف الصف
      const { error: delErr } = await deleteFromCorrectTable(editing);
      if (delErr) throw delErr;

      // 2) حذف الصور من Storage (محاولة)
      for (const url of imgs) {
        await removeFromStorageIfPossible(url);
      }

      closeEdit();
      await loadMyRequests();
    } catch (e) {
      console.error(e);
      setErr(e?.message || "فشل حذف الطلب");
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // Render
  // =========================
  if (loading) return <p className="text-center p-4">Loading...</p>;

  return (
    <div className="container py-4">
      <h3 className="mb-3">طلباتي</h3>

      {err && !editOpen && <p className="text-danger">{err}</p>}

      {items.length === 0 ? (
        <p className="text-muted">لا يوجد طلبات.</p>
      ) : (
        <div className="row g-3">
          {items.map((it) => {
            const imgs = getImages(it);
            const img = imgs[0];

            return (
              <div className="col-12 col-md-6 col-lg-4" key={`${it.type}-${it.id}`}>
                <div className="card h-100">
                  {img && (
                    <img
                      src={img}
                      alt={it.name}
                      style={{ height: 180, objectFit: "cover" }}
                      className="card-img-top"
                    />
                  )}

                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h5 className="card-title mb-1">{it.name}</h5>
                        <span className="badge bg-secondary">{badge(it.type)}</span>
                      </div>

                      <button
                        className="btn btn-sm btn-outline-success"
                        onClick={() => openEdit(it)}
                      >
                        تعديل
                      </button>
                    </div>

                    {it.description && (
                      <p className="card-text mt-2" style={{ color: "#666" }}>
                        {it.description}
                      </p>
                    )}

                    {it.type === "sale" && it.price != null && (
                      <p className="fw-bold mb-0">{it.price} $</p>
                    )}

                    {imgs.length > 1 && (
                      <p className="text-muted mt-2 mb-0" style={{ fontSize: 12 }}>
                        صور: {imgs.length}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {editOpen && editing && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.4)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">تعديل الطلب</h5>
                <button className="btn-close" onClick={closeEdit}></button>
              </div>

              <div className="modal-body">
                {/* معرض الصور */}
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <label className="form-label m-0">معرض الصور</label>
                    <small className="text-muted">الصورة الأولى هي الرئيسية</small>
                  </div>

                  <div className="d-flex flex-wrap gap-2 mt-2">
                    {getImages(editing).length === 0 && (
                      <div className="text-muted">لا يوجد صور</div>
                    )}

                    {getImages(editing).map((url, idx) => (
                      <div
                        key={`${url}-${idx}`}
                        style={{
                          width: 120,
                          border: "1px solid #eee",
                          borderRadius: 8,
                          overflow: "hidden",
                          position: "relative",
                          background: "#fff",
                        }}
                      >
                        <img
                          src={url}
                          alt={`img-${idx}`}
                          style={{ width: "100%", height: 90, objectFit: "cover" }}
                        />

                        {idx === 0 && (
                          <span
                            style={{
                              position: "absolute",
                              top: 6,
                              left: 6,
                              background: "rgba(0,0,0,0.6)",
                              color: "#fff",
                              fontSize: 11,
                              padding: "2px 6px",
                              borderRadius: 6,
                            }}
                          >
                            رئيسية
                          </span>
                        )}

                        <div className="p-1 d-flex gap-1 justify-content-between">
                          <button
                            className="btn btn-sm btn-outline-success"
                            onClick={() => makePrimary(idx)}
                            disabled={saving}
                            title="اجعلها رئيسية"
                          >
                            ⭐
                          </button>

                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => deleteImageAt(idx)}
                            disabled={saving}
                            title="حذف"
                          >
                            🗑
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* إضافة صور جديدة */}
                <div className="mb-3">
                  <label className="form-label">إضافة صور جديدة (متعددة)</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="form-control"
                    onChange={onPickNewImages}
                  />

                  {newPreviews.length > 0 && (
                    <div className="d-flex flex-wrap gap-2 mt-2">
                      {newPreviews.map((p) => (
                        <img
                          key={p}
                          src={p}
                          alt="preview"
                          style={{
                            width: 120,
                            height: 90,
                            objectFit: "cover",
                            borderRadius: 8,
                            border: "1px solid #eee",
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {uploading && <small className="text-muted">جاري رفع الصور...</small>}
                </div>

                <hr />

                <label className="form-label">الاسم</label>
                <input
                  className="form-control mb-2"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                />

                <label className="form-label">الوصف</label>
                <textarea
                  className="form-control mb-2"
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                />

                {editing.type === "sale" && (
                  <>
                    <label className="form-label">السعر</label>
                    <input
                      type="number"
                      className="form-control mb-2"
                      value={form.price}
                      onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                    />
                  </>
                )}

                {editing.type === "exchange" && (
                  <>
                    <label className="form-label">المطلوب مقابل</label>
                    <input
                      className="form-control mb-2"
                      value={form.desired_item}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, desired_item: e.target.value }))
                      }
                    />
                  </>
                )}

                <label className="form-label">رقم الهاتف</label>
                <input
                  className="form-control mb-2"
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                />

                <label className="form-label">العنوان</label>
                <input
                  className="form-control"
                  value={form.address}
                  onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                />

                {err && <p className="text-danger mt-3 mb-0">{err}</p>}
              </div>

              <div className="modal-footer d-flex gap-2">
                {/* حذف الطلب بالكامل */}
                <button
                  className="btn btn-danger me-auto"
                  onClick={deleteRequest}
                  disabled={saving || uploading}
                  title="سيتم حذف الطلب وكل صوره"
                >
                  {saving ? "جارٍ الحذف..." : "حذف الطلب"}
                </button>

                <button className="btn btn-secondary" onClick={closeEdit} disabled={saving}>
                  إلغاء
                </button>

                {/* حفظ مع إضافة الصور الجديدة */}
                <button
                  className="btn btn-outline-success"
                  onClick={saveAddImages}
                  disabled={saving || uploading}
                >
                  {saving ? "جارٍ الحفظ..." : "حفظ + إضافة الصور"}
                </button>

                {/* استبدال الصورة الرئيسية مع حذف القديمة */}
                <button
                  className="btn btn-success"
                  onClick={saveReplacePrimary}
                  disabled={saving || uploading}
                  title="سيستبدل الرئيسية ويحذف القديمة من التخزين"
                >
                  {saving ? "جارٍ الحفظ..." : "استبدال الرئيسية"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
