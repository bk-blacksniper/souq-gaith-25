import { createClient } from "https://esm.sh/@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: corsHeaders }
      );
    }

    const token = authHeader.replace("Bearer ", "");

    const supabaseAdmin = createClient(
      Deno.env.get("SB_URL")!,
      Deno.env.get("SB_SERVICE_ROLE_KEY")!
    );

    const {
      data: { user },
      error: userErr,
    } = await supabaseAdmin.auth.getUser(token);

    if (userErr || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid user token" }),
        { status: 401, headers: corsHeaders }
      );
    }

    const userId = user.id;

    await supabaseAdmin.from("profiles").delete().eq("id", userId);
    await supabaseAdmin.auth.admin.deleteUser(userId);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: corsHeaders }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e.message || "Delete failed" }),
      { status: 500, headers: corsHeaders }
    );
  }
});
