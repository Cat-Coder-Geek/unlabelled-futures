import { supabase } from "@/integrations/supabase/client";

export type Impact = {
  myths_challenged: number;
  stories_shared: number;
  resources_explored: number;
  reports_submitted: number;
};

export async function fetchImpact(): Promise<Impact> {
  const { data, error } = await supabase.rpc("get_impact");
  if (error) throw error;
  return data as unknown as Impact;
}

export type CounterKey = "myths_challenged" | "stories_shared" | "resources_explored";

export async function bumpCounter(key: CounterKey) {
  await supabase.rpc("increment_counter", { _key: key });
}
