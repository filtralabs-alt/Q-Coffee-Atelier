import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useLocation, useSearch } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/lib/i18n";
import { ATELIER_THEMES, COFFEE_KNOWLEDGE_LEVELS, HOME_BREW_METHODS, EVENT_GOALS } from "@/lib/constants";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Atelier, AtelierTestimonial } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Calendar, Clock, MapPin, Coffee, Star, MessageSquarePlus, ChevronLeft, ChevronRight, Euro, CalendarCheck, Linkedin } from "lucide-react";
import { SiInstagram } from "react-icons/si";
import crisPhoto from "@assets/cris-duarte-bio.png";

function formatPrice(price: string): { value: string; hasIcon: boolean } {
  const match = price.match(/[\d]+(?:[.,]\d+)?/);
  return match ? { value: match[0], hasIcon: true } : { value: price, hasIcon: false };
}

function themeLabel(theme: string, lang: "fr" | "pt") {
  const found = ATELIER_THEMES.find((t) => t.id === theme);
  return found ? found[lang] : theme;
}

const BANNER_BG = "#1E39B0";
const BANNER_TEXT = "#F0DAB2";

function ThemeBanners() {
  const { lang } = useI18n();
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const scrollToIndex = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(ATELIER_THEMES.length - 1, i));
    track.scrollTo({ left: clamped * track.clientWidth, behavior: "smooth" });
    setActive(clamped);
  };

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    setActive(Math.round(track.scrollLeft / track.clientWidth));
  };

  return (
    <div className="relative -mx-5">
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar"
        data-testid="carousel-atelier-themes"
      >
        {ATELIER_THEMES.map((theme) => {
          const Wrapper = theme.href ? Link : "div";
          const wrapperProps = theme.href ? { href: theme.href } : {};
          return (
            <Wrapper
              key={theme.id}
              {...(wrapperProps as any)}
              className={`relative w-full shrink-0 snap-center flex items-center justify-center px-8 ${theme.href ? "cursor-pointer" : ""}`}
              style={{
                height: 340,
                backgroundColor: BANNER_BG,
                backgroundImage: theme.image ? `linear-gradient(0deg, rgba(30,57,176,0.6), rgba(30,57,176,0.6)), url(${theme.image})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              data-testid={`banner-theme-${theme.id}`}
            >
              <h2
                className="text-center text-4xl leading-tight italic"
                style={{ fontFamily: "'Playfair Display', serif", color: BANNER_TEXT }}
              >
                {theme[lang]}
              </h2>
            </Wrapper>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => scrollToIndex(active - 1)}
        className="absolute left-2 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
        data-testid="button-carousel-prev"
      >
        <ChevronLeft className="h-7 w-7" />
      </button>
      <button
        type="button"
        onClick={() => scrollToIndex(active + 1)}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
        data-testid="button-carousel-next"
      >
        <ChevronRight className="h-7 w-7" />
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {ATELIER_THEMES.map((theme, i) => (
          <button
            key={theme.id}
            type="button"
            onClick={() => scrollToIndex(i)}
            className={`h-1.5 rounded-full transition-all ${i === active ? "w-4 bg-white" : "w-1.5 bg-white/50"}`}
            data-testid={`button-carousel-dot-${i}`}
          />
        ))}
      </div>
    </div>
  );
}

function AboutHost() {
  const { t } = useI18n();
  return (
    <Card className="p-5 space-y-3" data-testid="card-about-host">
      <div className="flex items-center gap-3">
        <img
          src={crisPhoto}
          alt="Cris Duarte"
          className="h-14 w-14 rounded-full object-cover shrink-0"
          data-testid="img-about-host"
        />
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{t("ateliers.about.title")}</h2>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">{t("ateliers.about.bio")}</p>
      <div className="flex items-center gap-3">
        <a
          href="https://www.linkedin.com/in/cris-chal-duarte/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground"
          data-testid="link-about-linkedin"
        >
          <Linkedin className="h-4 w-4" />
        </a>
        <a
          href="https://www.instagram.com/obaristech/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground"
          data-testid="link-about-instagram"
        >
          <SiInstagram className="h-4 w-4" />
        </a>
      </div>
      <div className="flex flex-wrap gap-1.5 pt-1">
        <Badge variant="secondary" className="text-[10px] font-normal whitespace-normal text-left max-w-full">{t("ateliers.about.polygone")}</Badge>
        <Badge variant="secondary" className="text-[10px] font-normal whitespace-normal text-left max-w-full">{t("ateliers.about.worldOfCoffee")}</Badge>
        <Badge variant="secondary" className="text-[10px] font-normal whitespace-normal text-left max-w-full">{t("ateliers.about.clermontWeek")}</Badge>
      </div>
    </Card>
  );
}

function ReviewDialog({ atelier, onClose }: { atelier: Atelier; onClose: () => void }) {
  const { t, lang } = useI18n();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submitMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/ateliers/${atelier.id}/testimonials`, {
        name,
        email,
        rating,
        comment,
      });
    },
    onSuccess: () => {
      setSubmitted(true);
    },
    onError: () => {
      toast({ title: t("common.error"), variant: "destructive" });
    },
  });

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent data-testid="dialog-review">
        <DialogHeader>
          <DialogTitle>{t("ateliers.leaveReview")}</DialogTitle>
        </DialogHeader>

        {submitted ? (
          <div className="py-4 text-center text-sm text-muted-foreground" data-testid="text-review-success">
            {t("ateliers.review.success")}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="review-name">{t("ateliers.review.name")}</Label>
              <Input id="review-name" value={name} onChange={(e) => setName(e.target.value)} data-testid="input-review-name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="review-email">{t("ateliers.review.email")}</Label>
              <Input id="review-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} data-testid="input-review-email" />
              <p className="text-[11px] text-muted-foreground">{t("ateliers.review.emailNote")}</p>
            </div>
            <div className="space-y-2">
              <Label>{t("ateliers.review.rating")}</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    data-testid={`button-rating-${n}`}
                  >
                    <Star className={`h-6 w-6 ${n <= rating ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="review-comment">{t("ateliers.review.comment")}</Label>
              <Textarea id="review-comment" rows={3} value={comment} onChange={(e) => setComment(e.target.value)} data-testid="textarea-review-comment" />
            </div>
          </div>
        )}

        <DialogFooter>
          {submitted ? (
            <Button onClick={onClose} data-testid="button-review-done">{t("common.save")}</Button>
          ) : (
            <>
              <Button variant="outline" onClick={onClose} data-testid="button-review-cancel">
                {t("ateliers.review.cancel")}
              </Button>
              <Button
                onClick={() => submitMutation.mutate()}
                disabled={!name.trim() || !email.trim() || !comment.trim() || submitMutation.isPending}
                data-testid="button-review-submit"
              >
                {submitMutation.isPending ? t("ateliers.review.submitting") : t("ateliers.review.submit")}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ReservationDialog({ atelier, onClose }: { atelier: Atelier; onClose: () => void }) {
  const { t, lang } = useI18n();
  const { toast } = useToast();
  const questionsMode: "team" | "kids" | "coffee" =
    atelier.theme === "team-building" ? "team" : atelier.theme === "peinture-enfants" ? "kids" : "coffee";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [seats, setSeats] = useState("1");
  const [coffeeKnowledge, setCoffeeKnowledge] = useState("");
  const [homeBrewMethod, setHomeBrewMethod] = useState("");
  const [learningGoal, setLearningGoal] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [eventGoal, setEventGoal] = useState("");
  const [childAges, setChildAges] = useState<string[]>([""]);
  const [parentAccompanying, setParentAccompanying] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [reservationId, setReservationId] = useState<string | null>(null);
  const [policyAccepted, setPolicyAccepted] = useState(false);

  const submitMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/ateliers/${atelier.id}/reservations`, {
        name,
        email,
        phone: phone || undefined,
        seats,
        coffeeKnowledge: questionsMode === "coffee" ? coffeeKnowledge || undefined : undefined,
        homeBrewMethod: questionsMode === "coffee" ? homeBrewMethod || undefined : undefined,
        learningGoal: questionsMode === "coffee" ? learningGoal || undefined : undefined,
        companyName: questionsMode === "team" ? companyName || undefined : undefined,
        eventGoal: questionsMode === "team" ? eventGoal || undefined : undefined,
        childAges: questionsMode === "kids"
          ? childAges.slice(0, Number(seats) || 1).map((a) => (a ? parseInt(a, 10) : null)).filter((a): a is number => a != null)
          : undefined,
        parentAccompanying: questionsMode === "kids" && parentAccompanying ? parentAccompanying === "yes" : undefined,
        message: message || undefined,
      });
      return res.json();
    },
    onSuccess: (created: { id: string }) => {
      setSubmitted(true);
      setReservationId(created.id);
      queryClient.invalidateQueries({ queryKey: ["/api/ateliers"] });
    },
    onError: (error: any) => {
      const isFull = error?.message?.includes("409");
      toast({
        title: isFull ? t("ateliers.reservation.full") : t("ateliers.reservation.error"),
        variant: "destructive",
      });
    },
  });

  const acceptPolicyMutation = useMutation({
    mutationFn: async () => {
      if (!reservationId) return;
      await apiRequest("PATCH", `/api/reservations/${reservationId}/accept-policy`);
    },
    onSuccess: () => setPolicyAccepted(true),
  });

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent data-testid="dialog-reservation">
        <DialogHeader>
          <DialogTitle>{t("ateliers.reservation.title")}</DialogTitle>
        </DialogHeader>

        {submitted ? (
          <div className="py-2 space-y-4" data-testid="text-reservation-success">
            <p className="text-center text-sm text-muted-foreground">{t("ateliers.reservation.success")}</p>
            <div className="flex items-start gap-2 rounded-md border p-3">
              <Checkbox
                id="reservation-policy"
                checked={policyAccepted}
                onCheckedChange={(v) => v === true && acceptPolicyMutation.mutate()}
                disabled={policyAccepted || acceptPolicyMutation.isPending}
                data-testid="checkbox-reservation-policy"
              />
              <Label htmlFor="reservation-policy" className="text-xs font-normal leading-snug text-muted-foreground">
                {t("ateliers.reservation.policy")}
              </Label>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reservation-name">{t("ateliers.reservation.name")}</Label>
              <Input id="reservation-name" value={name} onChange={(e) => setName(e.target.value)} data-testid="input-reservation-name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reservation-email">{t("ateliers.reservation.email")}</Label>
              <Input id="reservation-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} data-testid="input-reservation-email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reservation-phone">{t("ateliers.reservation.phone")}</Label>
              <Input id="reservation-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} data-testid="input-reservation-phone" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reservation-seats">{t("ateliers.reservation.seats")}</Label>
              <Input
                id="reservation-seats"
                type="number"
                min={1}
                max={atelier.seatsAvailable ?? 20}
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
                data-testid="input-reservation-seats"
              />
            </div>
            {questionsMode === "coffee" && (
              <>
                <div className="space-y-2">
                  <Label>{t("ateliers.reservation.coffeeKnowledge")}</Label>
                  <Select value={coffeeKnowledge} onValueChange={setCoffeeKnowledge}>
                    <SelectTrigger data-testid="select-reservation-coffee-knowledge">
                      <SelectValue placeholder={t("ateliers.reservation.selectPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {COFFEE_KNOWLEDGE_LEVELS.map((level) => (
                        <SelectItem key={level.id} value={level.id}>{level[lang]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t("ateliers.reservation.homeBrewMethod")}</Label>
                  <Select value={homeBrewMethod} onValueChange={setHomeBrewMethod}>
                    <SelectTrigger data-testid="select-reservation-brew-method">
                      <SelectValue placeholder={t("ateliers.reservation.selectPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {HOME_BREW_METHODS.map((method) => (
                        <SelectItem key={method.id} value={method.id}>{method[lang]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reservation-learning-goal">{t("ateliers.reservation.learningGoal")}</Label>
                  <Textarea
                    id="reservation-learning-goal"
                    rows={2}
                    value={learningGoal}
                    onChange={(e) => setLearningGoal(e.target.value)}
                    data-testid="textarea-reservation-learning-goal"
                  />
                </div>
              </>
            )}
            {questionsMode === "team" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="reservation-company">{t("ateliers.reservation.companyName")}</Label>
                  <Input id="reservation-company" value={companyName} onChange={(e) => setCompanyName(e.target.value)} data-testid="input-reservation-company" />
                </div>
                <div className="space-y-2">
                  <Label>{t("ateliers.reservation.eventGoal")}</Label>
                  <Select value={eventGoal} onValueChange={setEventGoal}>
                    <SelectTrigger data-testid="select-reservation-event-goal">
                      <SelectValue placeholder={t("ateliers.reservation.selectPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {EVENT_GOALS.map((goal) => (
                        <SelectItem key={goal.id} value={goal.id}>{goal[lang]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            {questionsMode === "kids" && (
              <>
                {Array.from({ length: Math.max(1, Number(seats) || 1) }).map((_, i) => (
                  <div className="space-y-2" key={i}>
                    <Label htmlFor={`reservation-child-age-${i}`}>
                      {t("ateliers.reservation.childAge")}{Number(seats) > 1 ? ` #${i + 1}` : ""}
                    </Label>
                    <Input
                      id={`reservation-child-age-${i}`}
                      type="number"
                      min={0}
                      max={17}
                      value={childAges[i] ?? ""}
                      onChange={(e) => {
                        const next = [...childAges];
                        next[i] = e.target.value;
                        setChildAges(next);
                      }}
                      data-testid={`input-reservation-child-age-${i}`}
                    />
                  </div>
                ))}
                <div className="space-y-2">
                  <Label>{t("ateliers.reservation.parentAccompanying")}</Label>
                  <Select value={parentAccompanying} onValueChange={setParentAccompanying}>
                    <SelectTrigger data-testid="select-reservation-parent-accompanying">
                      <SelectValue placeholder={t("ateliers.reservation.selectPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">{t("ateliers.reservation.yes")}</SelectItem>
                      <SelectItem value="no">{t("ateliers.reservation.no")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="reservation-message">{t("ateliers.reservation.message")}</Label>
              <Textarea id="reservation-message" rows={2} value={message} onChange={(e) => setMessage(e.target.value)} data-testid="textarea-reservation-message" />
            </div>
          </div>
        )}

        <DialogFooter>
          {submitted ? (
            <Button onClick={onClose} data-testid="button-reservation-done">{t("common.save")}</Button>
          ) : (
            <>
              <Button variant="outline" onClick={onClose} data-testid="button-reservation-cancel">
                {t("ateliers.reservation.cancel")}
              </Button>
              <Button
                onClick={() => submitMutation.mutate()}
                disabled={!name.trim() || !email.trim() || !seats || submitMutation.isPending}
                data-testid="button-reservation-submit"
              >
                {submitMutation.isPending ? t("ateliers.reservation.submitting") : t("ateliers.reservation.submit")}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AtelierCard({ atelier, testimonials, isPast, onReview, onReserve }: {
  atelier: Atelier;
  testimonials: AtelierTestimonial[];
  isPast: boolean;
  onReview: () => void;
  onReserve: () => void;
}) {
  const { t, lang } = useI18n();
  const date = new Date(atelier.dateTime);
  const description = lang === "fr" ? atelier.descriptionFr : atelier.descriptionPt;
  const full = atelier.seatsAvailable !== null && atelier.seatsAvailable !== undefined && atelier.seatsAvailable <= 0;

  return (
    <Card className="p-5 space-y-3" data-testid={`card-atelier-${atelier.id}`}>
      <div>
        <h3 className="font-semibold text-sm" data-testid={`text-atelier-theme-${atelier.id}`}>
          {themeLabel(atelier.theme, lang)}
        </h3>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          {date.toLocaleDateString(lang === "fr" ? "fr-FR" : "pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {date.toLocaleTimeString(lang === "fr" ? "fr-FR" : "pt-BR", { hour: "2-digit", minute: "2-digit" })}
        </span>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(atelier.location)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 underline decoration-dotted hover:text-foreground"
          data-testid={`link-atelier-location-${atelier.id}`}
        >
          <MapPin className="h-3.5 w-3.5" />
          {atelier.location}
        </a>
      </div>

      {atelier.coffees && atelier.coffees.length > 0 && (
        <div className="space-y-1">
          <p className="text-[11px] text-muted-foreground flex items-center gap-1">
            <Coffee className="h-3 w-3" /> {t("ateliers.coffees")}
          </p>
          <div className="flex flex-wrap gap-1">
            {atelier.coffees.map((c) => (
              <Badge key={c} variant="secondary" className="text-[10px]">{c}</Badge>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-1 border-t text-xs">
        {atelier.price && (() => {
          const { value, hasIcon } = formatPrice(atelier.price);
          return (
            <span className="font-medium flex items-center gap-1">
              {hasIcon && <Euro className="h-3.5 w-3.5" />}
              {value}
            </span>
          );
        })()}
        {!isPast && (
          <span className={full ? "text-destructive font-medium" : "text-muted-foreground"}>
            {full
              ? t("ateliers.seatsFull")
              : atelier.seatsAvailable !== null && atelier.seatsAvailable !== undefined
                ? `${atelier.seatsAvailable} ${t("ateliers.seats")}`
                : ""}
          </span>
        )}
      </div>

      {!isPast && !full && (
        <Button size="sm" className="w-full" onClick={onReserve} data-testid={`button-reserve-${atelier.id}`}>
          <CalendarCheck className="h-3.5 w-3.5 mr-1.5" />
          {t("ateliers.reserve")}
        </Button>
      )}

      {isPast && (
        <div className="pt-2 border-t space-y-2">
          <p className="text-xs font-medium">{t("ateliers.reviews")}</p>
          {testimonials.length === 0 ? (
            <p className="text-xs text-muted-foreground">{t("ateliers.noReviews")}</p>
          ) : (
            <div className="space-y-2">
              {testimonials.map((rev) => (
                <div key={rev.id} className="text-xs space-y-0.5" data-testid={`testimonial-${rev.id}`}>
                  <div className="flex items-center gap-1">
                    {rev.rating != null && (
                      <span className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-3 w-3 ${i < (rev.rating ?? 0) ? "fill-primary text-primary" : "text-muted-foreground/40"}`} />
                        ))}
                      </span>
                    )}
                    <span className="font-medium">{rev.name}</span>
                  </div>
                  <p className="text-muted-foreground italic">"{rev.comment}"</p>
                </div>
              ))}
            </div>
          )}
          <Button variant="outline" size="sm" onClick={onReview} data-testid={`button-review-${atelier.id}`}>
            <MessageSquarePlus className="h-3.5 w-3.5 mr-1.5" />
            {t("ateliers.leaveReview")}
          </Button>
        </div>
      )}
    </Card>
  );
}

export default function AteliersPage() {
  const { t } = useI18n();
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const search = useSearch();
  const [reviewAtelier, setReviewAtelier] = useState<Atelier | null>(null);
  const [reservationAtelier, setReservationAtelier] = useState<Atelier | null>(null);
  const deepLinkHandled = useRef(false);

  const handleReserve = (atelier: Atelier) => {
    if (!user) {
      const next = `/ateliers?reservar=${atelier.theme}`;
      setLocation(`/?next=${encodeURIComponent(next)}`);
      return;
    }
    setReservationAtelier(atelier);
  };

  const { data: ateliers, isLoading } = useQuery<Atelier[]>({ queryKey: ["/api/ateliers"] });
  const { data: testimonials = [] } = useQuery<AtelierTestimonial[]>({ queryKey: ["/api/testimonials"] });

  // Deep link from marketing pages, e.g. /ateliers?reservar=peinture-enfants
  // opens the reservation form for the matching upcoming atelier straight away.
  useEffect(() => {
    if (deepLinkHandled.current) return;
    if (authLoading) return;
    if (!ateliers || ateliers.length === 0) return;
    const theme = new URLSearchParams(search).get("reservar");
    if (!theme) return;

    const now = new Date();
    const match = ateliers
      .filter((a) => a.theme === theme && new Date(a.dateTime) >= now)
      .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())[0];
    if (!match) return;

    deepLinkHandled.current = true;
    handleReserve(match);
  }, [ateliers, search, user, authLoading]);

  const testimonialsByAtelier = useMemo(() => {
    const map = new Map<string, AtelierTestimonial[]>();
    for (const rev of testimonials) {
      const list = map.get(rev.atelierId) ?? [];
      list.push(rev);
      map.set(rev.atelierId, list);
    }
    return map;
  }, [testimonials]);

  const { upcoming, past } = useMemo(() => {
    const now = new Date();
    const upcoming: Atelier[] = [];
    const past: Atelier[] = [];
    for (const a of ateliers ?? []) {
      if (new Date(a.dateTime) >= now) upcoming.push(a);
      else past.push(a);
    }
    past.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
    return { upcoming, past };
  }, [ateliers]);

  const closeReview = () => {
    setReviewAtelier(null);
    queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
  };

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-5 pt-5 pb-2">
        <h1 className="font-serif text-xl font-semibold" data-testid="text-ateliers-title">{t("ateliers.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("ateliers.subtitle")}</p>
      </div>

      <div className="px-5 pt-2">
        <ThemeBanners />
      </div>

      <div className="px-5 pt-4">
        <AboutHost />
      </div>

      <div className="flex-1 px-5 pb-4 space-y-6">
        {isLoading ? (
          <div className="space-y-3 pt-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <Card key={i} className="p-5 space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
              </Card>
            ))}
          </div>
        ) : (
          <>
            <section className="space-y-3 pt-2">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{t("ateliers.upcoming")}</h2>
              {upcoming.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">{t("ateliers.empty.upcoming")}</p>
              ) : (
                <div className="space-y-3">
                  {upcoming.map((a) => (
                    <AtelierCard
                      key={a.id}
                      atelier={a}
                      testimonials={[]}
                      isPast={false}
                      onReview={() => {}}
                      onReserve={() => handleReserve(a)}
                    />
                  ))}
                </div>
              )}
            </section>

            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{t("ateliers.past")}</h2>
              {past.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">{t("ateliers.empty.past")}</p>
              ) : (
                <div className="space-y-3">
                  {past.map((a) => (
                    <AtelierCard
                      key={a.id}
                      atelier={a}
                      testimonials={testimonialsByAtelier.get(a.id) ?? []}
                      isPast
                      onReview={() => setReviewAtelier(a)}
                      onReserve={() => {}}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>

      {reviewAtelier && <ReviewDialog atelier={reviewAtelier} onClose={closeReview} />}
      {reservationAtelier && (
        <ReservationDialog atelier={reservationAtelier} onClose={() => setReservationAtelier(null)} />
      )}
    </div>
  );
}
