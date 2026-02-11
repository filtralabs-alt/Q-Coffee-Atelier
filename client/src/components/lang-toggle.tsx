import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export function LangToggle() {
  const { lang, setLang } = useI18n();

  return (
    <div className="flex items-center gap-1" data-testid="lang-toggle">
      <Button
        variant={lang === "fr" ? "default" : "ghost"}
        size="sm"
        onClick={() => setLang("fr")}
        data-testid="button-lang-fr"
        className="text-xs font-semibold px-2"
      >
        FR
      </Button>
      <span className="text-muted-foreground text-xs">|</span>
      <Button
        variant={lang === "pt" ? "default" : "ghost"}
        size="sm"
        onClick={() => setLang("pt")}
        data-testid="button-lang-pt"
        className="text-xs font-semibold px-2"
      >
        PT
      </Button>
    </div>
  );
}
