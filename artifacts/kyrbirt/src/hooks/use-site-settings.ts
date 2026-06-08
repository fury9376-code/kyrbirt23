import { useQuery } from "@tanstack/react-query";

export type SiteSettings = {
  drop_name: string;
  drop_target_date: string;
  drop_bg_image: string;
  drop_subtitle: string;
  hero_bg_image: string;
  footer_description: string;
  footer_instagram: string;
  footer_whatsapp: string;
  footer_payment_methods: string;
  footer_credits: string;
};

const DEFAULTS: SiteSettings = {
  drop_name: "DROP 5",
  drop_target_date: "2026-05-08T23:00:00.000Z",
  drop_bg_image: "",
  hero_bg_image: "",
  drop_subtitle: "Viernes 8 de Mayo — 20:00 hs Argentina",
  footer_description: "Argentine streetwear brand. Built around street culture, local artists, and limited drops. Real recognizes real.",
  footer_instagram: "https://www.instagram.com/kyrbirt/",
  footer_whatsapp: "https://wa.me/2235744381",
  footer_payment_methods: "EFECTIVO,TRANSFERENCIA,MERCADOPAGO",
  footer_credits: "Diseñado por @_nico.esteban",
};

export function useSiteSettings() {
  const { data, isLoading, refetch } = useQuery<SiteSettings>({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const res = await fetch("/api/settings");
      if (!res.ok) return DEFAULTS;
      const raw = await res.json();
      return { ...DEFAULTS, ...raw };
    },
    staleTime: 30_000,
  });

  return { settings: data ?? DEFAULTS, isLoading, refetch };
}
