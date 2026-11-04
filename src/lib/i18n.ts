import { useSettings } from "./settings";

const dict = {
  home: { en: "Home", ar: "الرئيسية" },
  dashboard: { en: "Dashboard", ar: "لوحة البيانات" },
  bias: { en: "Break the Bias", ar: "اكسر التحيّز" },
  explore: { en: "Explore", ar: "استكشف" },
  speak: { en: "Speak Up", ar: "تحدّث" },
  settings: { en: "Settings", ar: "الإعدادات" },
  signin: { en: "Sign in", ar: "تسجيل الدخول" },
  signout: { en: "Sign out", ar: "تسجيل الخروج" },
  tagline: { en: "Your potential has no stereotype.", ar: "إمكاناتك لا تعرف الصور النمطية." },
  tagline2: { en: "Neither should your education.", ar: "ولا ينبغي لتعليمك أن يعرفها." },
  heroBody: {
    en: "An interactive digital movement challenging stereotypes in education, making opportunities visible and giving every student a voice.",
    ar: "حركة رقمية تفاعلية تتحدى الصور النمطية في التعليم، وتُظهر الفرص، وتمنح كل طالب صوتاً.",
  },
  ctaEvidence: { en: "Explore the Evidence", ar: "استكشف الأدلة" },
  ctaBias: { en: "Break the Bias", ar: "اكسر التحيّز" },
  ctaSpeak: { en: "Speak Up", ar: "تحدّث" },
  closing: { en: "Education should expand possibilities, not define them.", ar: "التعليم يجب أن يوسّع الآفاق، لا أن يحدّها." },
  footer: {
    en: "Your potential is not determined by your gender. Your future should be determined by your ambitions.",
    ar: "إمكاناتك لا يحددها جنسك. مستقبلك يجب أن تحدده طموحاتك.",
  },
} as const;

export type TKey = keyof typeof dict;
export function useT() {
  const { settings } = useSettings();
  return (k: TKey) => dict[k][settings.lang];
}
