import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import type { CoffeeSpot } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, MapPin, Globe, Instagram, ChevronRight } from "lucide-react";
import { SiInstagram } from "react-icons/si";

function FeaturedCarousel({ spots }: { spots: CoffeeSpot[] }) {
  const { t } = useI18n();
  return (
    <div className="pt-2 pb-1 space-y-2">
      <h2 className="px-5 text-sm font-semibold text-muted-foreground uppercase tracking-wide">{t("spots.featured.title")}</h2>
      <div className="relative">
        <div className="flex gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-pl-6 scroll-pr-8 pl-6 pr-8 pb-1">
          {spots.map((spot) => (
            <a
              key={spot.id}
              href={`/api/coffee-spots/${spot.id}/click`}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 w-[47%] sm:w-40 snap-start rounded-2xl overflow-hidden block group"
              data-testid={`link-featured-spot-${spot.id}`}
            >
              {spot.featuredImageUrl ? (
                <img src={spot.featuredImageUrl} alt={spot.name} className="w-full aspect-square object-cover rounded-2xl transition-transform group-hover:scale-[1.02]" />
              ) : (
                <div className="w-full aspect-square bg-muted flex items-center justify-center text-muted-foreground text-xs px-3 text-center rounded-2xl">
                  {spot.name}
                </div>
              )}
              <div className="pt-2">
                <p className="text-xs font-medium truncate">{spot.name}</p>
                <p className="text-[10px] text-muted-foreground">{t("spots.featured.cta")}</p>
              </div>
            </a>
          ))}
        </div>
        <div className="pointer-events-none absolute right-0 top-0 bottom-6 w-10 bg-gradient-to-l from-background to-transparent flex items-center justify-end">
          <ChevronRight className="h-4 w-4 text-muted-foreground/60" />
        </div>
      </div>
    </div>
  );
}

export default function SpotsPage() {
  const { t } = useI18n();
  const [search, setSearch] = useState("");

  const { data: spots, isLoading } = useQuery<CoffeeSpot[]>({
    queryKey: ["/api/coffee-spots"],
  });

  const featured = spots?.filter((spot) => spot.featured && spot.featuredLinkUrl) ?? [];

  const filtered = spots?.filter(
    (spot) =>
      spot.name.toLowerCase().includes(search.toLowerCase()) ||
      spot.city.toLowerCase().includes(search.toLowerCase()) ||
      spot.tags?.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-5 pt-5 pb-2">
        <h1 className="font-serif text-xl font-semibold" data-testid="text-spots-title">{t("spots.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("spots.subtitle")}</p>
      </div>

      {!isLoading && featured.length > 0 && <FeaturedCarousel spots={featured} />}

      <div className="px-5 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("spots.search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-testid="input-spots-search"
          />
        </div>
      </div>

      <div className="flex-1 px-5 space-y-3 pb-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-5 space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-32" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
              </div>
            </Card>
          ))
        ) : !filtered?.length ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <MapPin className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground">{t("spots.noResults")}</p>
          </div>
        ) : (
          filtered.map((spot) => (
            <Card key={spot.id} className="p-5 hover-elevate" data-testid={`card-spot-${spot.id}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1 flex-1">
                  <h3 className="font-semibold text-sm" data-testid={`text-spot-name-${spot.id}`}>{spot.name}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {spot.city}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {spot.instagram && (
                    <Button variant="ghost" size="icon" asChild data-testid={`button-instagram-${spot.id}`}>
                      <a href={spot.instagram.startsWith("http") ? spot.instagram : `https://instagram.com/${spot.instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer">
                        <SiInstagram className="h-3.5 w-3.5" />
                      </a>
                    </Button>
                  )}
                  {spot.website && (
                    <Button variant="ghost" size="icon" asChild data-testid={`button-website-${spot.id}`}>
                      <a href={spot.website.startsWith("http") ? spot.website : `https://${spot.website}`} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-3.5 w-3.5" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
              {spot.tags && spot.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {spot.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>
                  ))}
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
