import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import { AROMA_TAGS } from "@/lib/constants";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, Coffee, Droplets, Flame, Candy, Lightbulb, Heart } from "lucide-react";

interface TastingSummary {
  totalTastings: number;
  favoriteMethod: string | null;
  commonAromas: string[];
  avgAcidity: number;
  avgBitterness: number;
  avgSweetness: number;
  tip: { fr: string; pt: string };
}

export default function SummaryPage() {
  const { t, lang } = useI18n();

  const { data: summary, isLoading } = useQuery<TastingSummary>({
    queryKey: ["/api/tastings/summary"],
  });

  const getAromaLabel = (id: string) => {
    const tag = AROMA_TAGS.find((a) => a.id === id);
    return tag ? tag[lang] : id;
  };

  const renderBar = (value: number, label: string, icon: JSX.Element) => (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          {icon} {label}
        </span>
        <span className="font-semibold">{value.toFixed(1)}/5</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${(value / 5) * 100}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-4 pt-4 pb-2">
        <h1 className="font-serif text-xl font-bold" data-testid="text-summary-title">{t("summary.title")}</h1>
      </div>

      <div className="flex-1 px-4 space-y-4 pb-4">
        {isLoading ? (
          <>
            <Card className="p-4 space-y-3">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-40" />
            </Card>
            <Card className="p-4 space-y-3">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </Card>
          </>
        ) : !summary || summary.totalTastings === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <BarChart3 className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground">{t("summary.noData")}</p>
          </div>
        ) : (
          <>
            <Card className="p-4" data-testid="card-summary-overview">
              <div className="flex items-center gap-2 mb-3">
                <Coffee className="h-5 w-5 text-primary" />
                <span className="font-semibold text-sm">
                  {summary.totalTastings} {t("summary.tastings")}
                </span>
              </div>
              {summary.favoriteMethod && (
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">{t("summary.favoriteMethod")}:</span>
                  <Badge variant="secondary">{summary.favoriteMethod}</Badge>
                </div>
              )}
              {summary.commonAromas.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-sm text-muted-foreground">{t("summary.commonAromas")}:</span>
                  <div className="flex flex-wrap gap-1">
                    {summary.commonAromas.map((aroma) => (
                      <Badge key={aroma} variant="outline" className="text-xs">{getAromaLabel(aroma)}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            <Card className="p-4 space-y-4" data-testid="card-sensory-profile">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                {t("summary.sensorProfile")}
              </h3>
              {renderBar(summary.avgAcidity, t("summary.avgAcidity"), <Droplets className="h-3.5 w-3.5" />)}
              {renderBar(summary.avgBitterness, t("summary.avgBitterness"), <Flame className="h-3.5 w-3.5" />)}
              {renderBar(summary.avgSweetness, t("summary.avgSweetness"), <Candy className="h-3.5 w-3.5" />)}
            </Card>

            <Card className="p-4" data-testid="card-tip">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Lightbulb className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">{t("summary.tip")}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{summary.tip[lang]}</p>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
