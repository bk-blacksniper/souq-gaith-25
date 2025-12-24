import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import Loader from "./Loader";

const ProtectedRoute = ({ children, openLogin }) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        // فتح نافذة تسجيل الدخول
        if (openLogin) openLogin();
        navigate("/", { replace: true });
      }

      setLoading(false);
    };

    checkAuth();
  }, [navigate, openLogin]);

  if (loading) return <Loader />;

  return children;
};

export default ProtectedRoute;
