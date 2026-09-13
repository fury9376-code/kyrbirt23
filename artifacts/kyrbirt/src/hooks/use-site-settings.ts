import { useQuery } from "@tanstack/react-query";
import { FAM_FALLBACK_URL } from "@/lib/assets";

export type SiteSettings = {
  main_bg_image: string;
  drop_name: string;
  drop_target_date: string;
  drop_bg_image: string;
  drop_subtitle: string;
  contact_phone: string;
  contact_whatsapp: string;
  contact_address: string;
  contact_email: string;
  contact_hours: string;
  contact_instagram: string;
  footer_description: string;
  footer_instagram: string;
  footer_whatsapp: string;
  footer_payment_methods: string;
  footer_credits: string;
  fam_photos: string;
  size_guide: string;
};

const DEFAULTS: SiteSettings = {
  main_bg_image: "",
  drop_name: "DROP 5",
  drop_target_date: "2026-05-08T23:00:00.000Z",
  drop_bg_image: "",
  drop_subtitle: "Viernes 8 de Mayo — 20:00 hs Argentina",
  contact_phone: "+54 223 574-4381",
  contact_whatsapp: "2235744381",
  contact_address: "",
  contact_email: "",
  contact_hours: "",
  contact_instagram: "kyrbirt",
  footer_description: "Argentine streetwear brand. Built around street culture, local artists, and limited drops. Real recognizes real.",
  footer_instagram: "https://www.instagram.com/kyrbirt/",
  footer_whatsapp: "https://wa.me/2235744381",
  footer_payment_methods: "EFECTIVO,TRANSFERENCIA,MERCADOPAGO",
  footer_credits: "Diseñado por @_nico.esteban",
  fam_photos: JSON.stringify([FAM_FALLBACK_URL]),
  size_guide: JSON.stringify([
    { size: "S", chest: "50", length: "70" },
    { size: "M", chest: "52", length: "72" },
    { size: "L", chest: "54", length: "74" },
    { size: "XL", chest: "56", length: "76" },
  ]),
};

export function useSiteSettings() {
  const { data, isLoading, refetch } = useQuery<SiteSettings>({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const res = await fetch("/api/settings");
      if (!res.ok) return DEFAULTS;
      return res.json();
    },
    staleTime: 30_000,
  });

  return { settings: data ?? DEFAULTS, isLoading, refetch };
}
