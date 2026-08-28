import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/lib/i18n";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { User, Sprout } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const { t } = useI18n();
  const { toast } = useToast();

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [isSaving, setIsSaving] = useState(false);

  const { data: play } = useQuery<{ totalGraos: number; level: { key: string }; currentStreak: number; badges: string[] }>({
    queryKey: ["/api/play/progress"],
    enabled: !!user,
  });

  useEffect(() => {
    setFirstName(user?.firstName || "");
    setLastName(user?.lastName || "");
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await apiRequest("PATCH", "/api/user", { firstName, lastName });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({ description: t("profile.saved") });
    } catch {
      toast({ description: "Erreur", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-5 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="h-5 w-5 text-primary" />
        </div>
        <h1 className="font-sans text-2xl font-semibold">{t("profile.title")}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">{t("profile.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1.5">
              <Label>{t("profile.email")}</Label>
              <Input value={user?.email || ""} disabled className="opacity-60" />
              <p className="text-xs text-muted-foreground">{t("profile.emailNote")}</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="firstName">{t("profile.firstName")}</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder={t("profile.firstName")}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName">{t("profile.lastName")}</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder={t("profile.lastName")}
              />
            </div>
            <Button type="submit" disabled={isSaving} className="w-full">
              {isSaving ? "..." : t("profile.save")}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Sprout className="h-4 w-4 text-primary" /> {t("profile.play.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {play && play.totalGraos > 0 ? (
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold">{t(`play.level.${play.level.key}`)}</span>
              <span className="text-primary font-bold">{play.totalGraos} {t("play.graos.unit")}</span>
              {play.currentStreak > 0 && (
                <span className="text-xs text-muted-foreground">
                  {play.currentStreak} {t("play.graos.streak")}
                </span>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{t("profile.play.empty")}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
