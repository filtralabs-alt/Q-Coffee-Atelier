import { useI18n } from "@/lib/i18n";
import { Coffee, BookOpen, Map, Gamepad2, BarChart3, Calendar, LogIn } from "lucide-react";

export function useNavItems(publicMode = false) {
  const { t } = useI18n();

  return publicMode
    ? [
        { href: "/library", icon: BookOpen, label: t("nav.library") },
        { href: "/play", icon: Gamepad2, label: t("nav.play") },
        { href: "/ateliers", icon: Calendar, label: t("nav.ateliers") },
        { href: "/", icon: LogIn, label: t("nav.login") },
      ]
    : [
        { href: "/journal", icon: Coffee, label: t("nav.journal") },
        { href: "/summary", icon: BarChart3, label: t("nav.summary") },
        { href: "/ateliers", icon: Calendar, label: t("nav.ateliers") },
        { href: "/spots", icon: Map, label: t("nav.spots") },
        { href: "/library", icon: BookOpen, label: t("nav.library") },
        { href: "/play", icon: Gamepad2, label: t("nav.play") },
      ];
}
