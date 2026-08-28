import { HelpCircle, ListOrdered, type LucideIcon } from "lucide-react";

export interface PlayGame {
  key: string;
  route: string;
  titleKey: string;
  descKey: string;
  icon: LucideIcon;
}

export const PLAY_GAMES: PlayGame[] = [
  {
    key: "quiz",
    route: "/play/quiz",
    titleKey: "play.quiz.title",
    descKey: "play.quiz.subtitle",
    icon: HelpCircle,
  },
  {
    key: "ordem",
    route: "/play/ordem",
    titleKey: "play.ordem.title",
    descKey: "play.ordem.cardDesc",
    icon: ListOrdered,
  },
];
