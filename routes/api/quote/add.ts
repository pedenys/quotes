import { createClient } from "@supabase/supabase-js";
import { FreshContext } from "$fresh/server.ts";

const supabase = createClient(
  Deno.env.get("DB_URL"),
  Deno.env.get("DB_API_KEY")
);

export const handler = (_req: Request, _ctx: FreshContext): Response => {
  return new Response(Deno.env.get("SUPABASE_URL"));
};
