import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Settings() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const BUCKET = "product-images";
  const FUNCTION_URL = `${
    process.env.REACT_APP_SUPABASE_URL || ""
  }/functions/v1/delete-account`;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast((tt) => ({ ...tt, show: false })), 2600);
  };

  const toastClass = useMemo(() => {
    if (toast.type === "success") return "bg-success text-white";
    if (toast.type === "error") return "bg-danger text-white";
    return "bg-dark text-white";
  }, [toast.type]);

  const extractStoragePathFromPublicUrl = (publicUrl) => {
    if (!publicUrl) return null;
    const marker = `/storage/v1/object/public/${BUCKET}/`;
    const idx = publicUrl.indexOf(marker);
    if (idx === -1) return null;
    return publicUrl.substring(idx + marker.length);
  };

  const removeFromStorageIfPossible = async (publicUrl) => {
    const path = extractStoragePathFromPublicUrl(publicUrl);
    if (!path) return;
    const { error } = await supabase.storage.from(BUCKET).remove([path]);
    if (error) console.warn("Avatar remove failed:", error.message);
  };

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;

      if (!user) {
        window.dispatchEvent(new Event("open-login"));
        navigate("/");
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", user.id)
        .single();

      if (error) {
        console.warn(error.message);
      } else {
        setFullName(profile?.full_name || "");
        setAvatarUrl(profile?.avatar_url || "");
      }

      setLoading(false);
    };

    load();

    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview, navigate]);

  const onPickAvatar = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (avatarPreview) URL.revokeObjectURL(avatarPreview);

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const uploadAvatarAndGetUrl = async (file) => {
    setUploadingAvatar(true);
    try {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!user) throw new Error(t("settings.authRequired"));

      const ext = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(16).slice(2)}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(fileName, file, {
          upsert: false,
        });
      if (upErr) throw upErr;

      const { data: pub } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(fileName);
      const url = pub?.publicUrl;
      if (!url) throw new Error(t("settings.avatarUrlFailed"));

      return url;
    } finally {
      setUploadingAvatar(false);
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!user) {
        window.dispatchEvent(new Event("open-login"));
        navigate("/");
        return;
      }

      let nextAvatarUrl = avatarUrl;

      if (avatarFile) {
        const uploadedUrl = await uploadAvatarAndGetUrl(avatarFile);

        nextAvatarUrl = uploadedUrl;

        if (avatarUrl) await removeFromStorageIfPossible(avatarUrl);

        setAvatarFile(null);
        if (avatarPreview) {
          URL.revokeObjectURL(avatarPreview);
          setAvatarPreview("");
        }
      }

      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName, avatar_url: nextAvatarUrl })
        .eq("id", user.id);

      if (error) throw error;

      setAvatarUrl(nextAvatarUrl);
      window.dispatchEvent(new Event("profile-updated"));
      showToast("success", t("settings.savedOk"));
    } catch (e) {
      console.error(e);
      showToast("error", e?.message || t("settings.saveFailed"));
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (!currentPassword) {
      showToast(
        "error",
        t("settings.currentPasswordRequired") || "Current password is required",
      );
      return;
    }

    if (newPassword.length < 6) {
      showToast("error", t("settings.pwdMin6"));
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("error", t("settings.pwdNotMatch"));
      return;
    }

    setSaving(true);
    try {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!user?.email) throw new Error(t("settings.authRequired"));

      const { error: reauthErr } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });
      if (reauthErr) {
        showToast(
          "error",
          t("settings.currentPasswordWrong") || reauthErr.message,
        );
        return;
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      showToast("success", t("settings.pwdChanged"));
    } catch (e) {
      console.error(e);
      showToast("error", e?.message || t("settings.pwdChangeFailed"));
    } finally {
      setSaving(false);
    }
  };

  const deleteAccount = async () => {
    const ok = window.confirm(t("settings.confirmDeleteAccount"));
    if (!ok) return;

    setSaving(true);
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session?.access_token) {
        showToast("error", t("settings.authRequired"));
        return;
      }

      const res = await fetch(
        "https://mnobcmagqhlzgitjhwby.supabase.co/functions/v1/delete-account",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        showToast("error", json?.error || t("settings.deleteFailed"));
        return;
      }

      await supabase.auth.signOut();
      showToast("success", t("settings.deletedOk"));
      navigate("/");
    } catch (e) {
      console.error(e);
      showToast("error", t("settings.deleteFailed"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-center p-4">{t("common.loading")}</p>;

  return (
    <div className="container py-4" style={{ maxWidth: 650 }}>
      <div
        style={{
          position: "fixed",
          top: 90,
          right: 16,
          zIndex: 9999,
          minWidth: 260,
        }}
      >
        {toast.show && (
          <div className={`toast show ${toastClass}`} role="alert">
            <div className="toast-body">{toast.message}</div>
          </div>
        )}
      </div>

      <h3 className="mb-4 text-center">{t("settings.pageTitle")}</h3>

      <div className="card mb-3">
        <div className="card-body">
          <h5 className="mb-3">{t("settings.accountData")}</h5>

          <div className="d-flex gap-3 align-items-start flex-wrap">
            <div style={{ width: 140 }}>
              <div
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "1px solid #eee",
                  background: "#f7f7f7",
                }}
              >
                <img
                  src={
                    avatarPreview ||
                    avatarUrl ||
                    "https://via.placeholder.com/120?text=Avatar"
                  }
                  alt="avatar"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              <input
                type="file"
                accept="image/*"
                className="form-control form-control-sm mt-2"
                onChange={onPickAvatar}
              />

              {uploadingAvatar && (
                <small className="text-muted">
                  {t("settings.uploadingAvatar")}
                </small>
              )}
            </div>

            <div style={{ flex: 1, minWidth: 240 }}>
              <label className="form-label">{t("settings.fullName")}</label>
              <input
                className="form-control mb-2"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />

              <button
                className="btn btn-success w-100"
                onClick={saveProfile}
                disabled={saving || uploadingAvatar}
              >
                {saving ? t("settings.saving") : t("settings.save")}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-3">
        <div className="card-body">
          <h5 className="mb-3">{t("settings.changePasswordTitle")}</h5>

          <label className="form-label">
            {t("settings.currentPasswordOptional")}
          </label>
          <input
            type="password"
            className="form-control mb-2"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="********"
          />

          <label className="form-label">{t("settings.newPassword")}</label>
          <input
            type="password"
            className="form-control mb-2"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="********"
          />

          <label className="form-label">
            {t("settings.confirmNewPassword")}
          </label>
          <input
            type="password"
            className="form-control mb-3"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="********"
          />

          <button
            className="btn btn-outline-success w-100"
            onClick={changePassword}
            disabled={saving}
          >
            {saving ? t("settings.changing") : t("settings.changePasswordBtn")}
          </button>
        </div>
      </div>

      <div className="card border-danger">
        <div className="card-body">
          <button
            className="btn btn-danger w-100"
            onClick={deleteAccount}
            disabled={saving}
          >
            {t("settings.deleteAccount")}
          </button>
        </div>
      </div>
    </div>
  );
}
