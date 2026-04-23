import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import { AROMA_TAGS, PROCESSES, METHODS } from "@/lib/constants";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { CoffeeSpot } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, Save, X, Check } from "lucide-react";

interface TastingWizardProps {
  onClose: () => void;
}

export function TastingWizard({ onClose }: TastingWizardProps) {
  const { t, lang } = useI18n();
  const { toast } = useToast();
  const [step, setStep] = useState(1);

  const [coffeeName, setCoffeeName] = useState("");
  const [origin, setOrigin] = useState("");
  const [variety, setVariety] = useState("");
  const [process, setProcess] = useState("");
  const [roastDate, setRoastDate] = useState("");
  const [method, setMethod] = useState("V60");
  const [methodOther, setMethodOther] = useState("");
  const [aromaTags, setAromaTags] = useState<string[]>([]);
  const [acidity, setAcidity] = useState(3);
  const [bitterness, setBitterness] = useState(3);
  const [sweetness, setSweetness] = useState(3);
  const [notes, setNotes] = useState("");
  const [spotId, setSpotId] = useState("");
  const [serviceNotes, setServiceNotes] = useState("");
  const [favoriteMethod, setFavoriteMethod] = useState(false);
  const [wouldDrinkAgain, setWouldDrinkAgain] = useState("maybe");

  const { data: spots = [] } = useQuery<CoffeeSpot[]>({ queryKey: ["/api/coffee-spots"] });

  const saveMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/tastings", {
        coffeeName,
        origin: origin || null,
        variety: variety || null,
        process: process || null,
        roastDate: roastDate || null,
        method,
        methodOther: method === "Other" ? methodOther : null,
        aromaTags,
        acidity,
        bitterness,
        sweetness,
        notes: notes || null,
        spotId: spotId || null,
        serviceNotes: serviceNotes || null,
        favoriteMethod,
        wouldDrinkAgain,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tastings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/tastings/summary"] });
      toast({ title: lang === "fr" ? "Dégustation enregistrée !" : "Degustação salva!" });
      onClose();
    },
    onError: () => {
      toast({ title: t("common.error"), variant: "destructive" });
    },
  });

  const toggleAroma = (id: string) => {
    setAromaTags((prev) => prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]);
  };

  const canProceed = () => {
    if (step === 1) return coffeeName.trim().length > 0;
    if (step === 2) return method.length > 0;
    return true;
  };

  const processLabels: Record<string, string> = {
    natural: t("wizard.process.natural"),
    washed: t("wizard.process.washed"),
    honey: t("wizard.process.honey"),
    pulped: t("wizard.process.pulped"),
    other: t("wizard.process.other"),
  };

  return (
    <div className="flex flex-col min-h-full ">
      <div className="px-5 pt-5 pb-2 flex items-center justify-between gap-2">
        <h1 className="font-serif text-xl font-semibold">{t("wizard.title")}</h1>
        <Button variant="ghost" size="icon" onClick={onClose} data-testid="button-close-wizard">
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="px-5 mb-4">
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`h-1.5 flex-1 rounded-full transition-colors ${s <= step ? "bg-primary" : "bg-muted"}`} />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-1.5 text-xs text-muted-foreground">
          <span className={step === 1 ? "text-primary font-medium" : ""}>{t("wizard.step1")}</span>
          <span className={step === 2 ? "text-primary font-medium" : ""}>{t("wizard.step2")}</span>
          <span className={step === 3 ? "text-primary font-medium" : ""}>{t("wizard.step3")}</span>
        </div>
      </div>

      <div className="flex-1 px-5 space-y-4">
        {step === 1 && (
          <Card className="p-5 space-y-4" data-testid="wizard-step1">
            <div className="space-y-2">
              <Label htmlFor="coffeeName">{t("wizard.coffeeName")}</Label>
              <Input
                id="coffeeName"
                value={coffeeName}
                onChange={(e) => setCoffeeName(e.target.value)}
                placeholder={lang === "fr" ? "Ex: Ethiopia Yirgacheffe" : "Ex: Ethiopia Yirgacheffe"}
                data-testid="input-coffee-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="origin">{t("wizard.origin")}</Label>
              <Input
                id="origin"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder={lang === "fr" ? "Ex: Éthiopie, Sidamo" : "Ex: Etiópia, Sidamo"}
                data-testid="input-origin"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="variety">{t("wizard.variety")}</Label>
              <Input
                id="variety"
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                placeholder={lang === "fr" ? "Ex: Heirloom, Bourbon" : "Ex: Heirloom, Bourbon"}
                data-testid="input-variety"
              />
            </div>
            <div className="space-y-2">
              <Label>{t("wizard.process")}</Label>
              <Select value={process} onValueChange={setProcess}>
                <SelectTrigger data-testid="select-process">
                  <SelectValue placeholder={lang === "fr" ? "Sélectionnez..." : "Selecione..."} />
                </SelectTrigger>
                <SelectContent>
                  {PROCESSES.map((p) => (
                    <SelectItem key={p} value={p}>{processLabels[p]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="roastDate">{t("wizard.roastDate")}</Label>
              <Input
                id="roastDate"
                type="date"
                value={roastDate}
                onChange={(e) => setRoastDate(e.target.value)}
                data-testid="input-roast-date"
              />
            </div>
          </Card>
        )}

        {step === 2 && (
          <Card className="p-5 space-y-4" data-testid="wizard-step2">
            <div className="space-y-3">
              <Label>{t("wizard.method")}</Label>
              <RadioGroup value={method} onValueChange={setMethod} className="space-y-2">
                {METHODS.map((m) => (
                  <div key={m} className="flex items-center gap-3">
                    <RadioGroupItem value={m} id={`method-${m}`} data-testid={`radio-method-${m}`} />
                    <Label htmlFor={`method-${m}`} className="cursor-pointer font-normal">{m === "Other" ? (lang === "fr" ? "Autre" : "Outro") : m}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            {method === "Other" && (
              <div className="space-y-2">
                <Label htmlFor="methodOther">{t("wizard.methodOther")}</Label>
                <Input
                  id="methodOther"
                  value={methodOther}
                  onChange={(e) => setMethodOther(e.target.value)}
                  placeholder={lang === "fr" ? "Ex: Aeropress, French Press..." : "Ex: Aeropress, Prensa Francesa..."}
                  data-testid="input-method-other"
                />
              </div>
            )}
          </Card>
        )}

        {step === 3 && (
          <Card className="p-5 space-y-5" data-testid="wizard-step3">
            <div className="space-y-2">
              <Label>{t("wizard.aromas")}</Label>
              <div className="flex flex-wrap gap-1.5">
                {AROMA_TAGS.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant={aromaTags.includes(tag.id) ? "default" : "outline"}
                    className="cursor-pointer toggle-elevate"
                    onClick={() => toggleAroma(tag.id)}
                    data-testid={`badge-aroma-${tag.id}`}
                  >
                    {tag[lang]}
                    {aromaTags.includes(tag.id) && <Check className="ml-1 h-3 w-3" />}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>{t("wizard.acidity")}</Label>
                  <span className="text-sm font-medium text-primary">{acidity}/5</span>
                </div>
                <Slider value={[acidity]} onValueChange={([v]) => setAcidity(v)} min={1} max={5} step={1} data-testid="slider-acidity" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>{t("wizard.bitterness")}</Label>
                  <span className="text-sm font-medium text-primary">{bitterness}/5</span>
                </div>
                <Slider value={[bitterness]} onValueChange={([v]) => setBitterness(v)} min={1} max={5} step={1} data-testid="slider-bitterness" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>{t("wizard.sweetness")}</Label>
                  <span className="text-sm font-medium text-primary">{sweetness}/5</span>
                </div>
                <Slider value={[sweetness]} onValueChange={([v]) => setSweetness(v)} min={1} max={5} step={1} data-testid="slider-sweetness" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">{t("wizard.notes")}</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={lang === "fr" ? "Vos impressions..." : "Suas impressões..."}
                rows={3}
                data-testid="textarea-notes"
              />
            </div>

            <div className="space-y-2">
              <Label>{t("wizard.spot")}</Label>
              <Select value={spotId} onValueChange={setSpotId}>
                <SelectTrigger data-testid="select-spot">
                  <SelectValue placeholder={t("wizard.spotNone")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t("wizard.spotNone")}</SelectItem>
                  {spots.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {spotId && (
              <div className="space-y-2">
                <Label htmlFor="serviceNotes">{t("wizard.serviceNotes")}</Label>
                <Textarea
                  id="serviceNotes"
                  value={serviceNotes}
                  onChange={(e) => setServiceNotes(e.target.value)}
                  placeholder={lang === "fr" ? "Accueil, qualité du service..." : "Atendimento, qualidade do serviço..."}
                  rows={2}
                  data-testid="textarea-service-notes"
                />
              </div>
            )}

            <div className="flex items-center gap-2">
              <Checkbox
                id="favoriteMethod"
                checked={favoriteMethod}
                onCheckedChange={(checked) => setFavoriteMethod(checked === true)}
                data-testid="checkbox-favorite"
              />
              <Label htmlFor="favoriteMethod" className="font-normal cursor-pointer">{t("wizard.favoriteMethod")}</Label>
            </div>

            <div className="space-y-2">
              <Label>{t("wizard.wouldDrinkAgain")}</Label>
              <RadioGroup value={wouldDrinkAgain} onValueChange={setWouldDrinkAgain} className="flex gap-4">
                {[
                  { value: "yes", label: t("journal.yes") },
                  { value: "no", label: t("journal.no") },
                  { value: "maybe", label: t("journal.maybe") },
                ].map((opt) => (
                  <div key={opt.value} className="flex items-center gap-1.5">
                    <RadioGroupItem value={opt.value} id={`drink-${opt.value}`} data-testid={`radio-drink-${opt.value}`} />
                    <Label htmlFor={`drink-${opt.value}`} className="font-normal cursor-pointer text-sm">{opt.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </Card>
        )}
      </div>

      <div className="px-5 py-4 flex items-center justify-between gap-3">
        <Button
          variant="outline"
          onClick={() => step === 1 ? onClose() : setStep(step - 1)}
          data-testid="button-wizard-prev"
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          {step === 1 ? t("common.cancel") : t("wizard.previous")}
        </Button>

        {step < 3 ? (
          <Button
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
            data-testid="button-wizard-next"
          >
            {t("wizard.next")}
            <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        ) : (
          <Button
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending || !canProceed()}
            data-testid="button-wizard-save"
          >
            <Save className="h-4 w-4 mr-1.5" />
            {saveMutation.isPending ? t("wizard.saving") : t("wizard.save")}
          </Button>
        )}
      </div>
    </div>
  );
}
