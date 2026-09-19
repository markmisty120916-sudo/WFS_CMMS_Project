import type { DriverPortalLocale } from "./driver-portal.interface";

const LABELS: Record<DriverPortalLocale, Readonly<Record<string, string>>> = {
  en: {
    portal: "Driver Portal",
    submit: "Submit",
    acknowledge: "Acknowledge",
    notes: "Notes",
    photos: "Photos",
    voice: "Voice note",
    category: "Category",
    description: "Description",
    denied: "role unauthorized",
  },
  es: {
    portal: "Portal del conductor",
    submit: "Enviar",
    acknowledge: "Confirmar",
    notes: "Notas",
    photos: "Fotos",
    voice: "Nota de voz",
    category: "Categoria",
    description: "Descripcion",
    denied: "rol no autorizado",
  },
  fr: {
    portal: "Portail conducteur",
    submit: "Envoyer",
    acknowledge: "Confirmer",
    notes: "Notes",
    photos: "Photos",
    voice: "Note vocale",
    category: "Categorie",
    description: "Description",
    denied: "role non autorise",
  },
  de: {
    portal: "Fahrerportal",
    submit: "Senden",
    acknowledge: "Bestaetigen",
    notes: "Notizen",
    photos: "Fotos",
    voice: "Sprachnotiz",
    category: "Kategorie",
    description: "Beschreibung",
    denied: "rolle nicht berechtigt",
  },
  pt: {
    portal: "Portal do motorista",
    submit: "Enviar",
    acknowledge: "Confirmar",
    notes: "Notas",
    photos: "Fotos",
    voice: "Nota de voz",
    category: "Categoria",
    description: "Descricao",
    denied: "funcao nao autorizada",
  },
  zh: {
    portal: "驾驶员门户",
    submit: "提交",
    acknowledge: "确认",
    notes: "备注",
    photos: "照片",
    voice: "语音备注",
    category: "类别",
    description: "说明",
    denied: "角色未授权",
  },
  ar: {
    portal: "بوابة السائق",
    submit: "إرسال",
    acknowledge: "تأكيد",
    notes: "ملاحظات",
    photos: "صور",
    voice: "ملاحظة صوتية",
    category: "فئة",
    description: "وصف",
    denied: "الدور غير مصرح",
  },
};

export function driverPortalLabel(locale: DriverPortalLocale, key: string): string {
  const pack = LABELS[locale];
  if (pack[key] !== undefined) {
    return pack[key];
  }
  return key;
}
