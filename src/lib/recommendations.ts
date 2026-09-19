const TAG_RECOMMENDATIONS: Record<string, string> = {
  "subject-verb-agreement": "راجع دروس تطابق الفعل مع الفاعل، خصوصًا حالات الفاعل الجمعي والمفرد الخادعة.",
  tenses: "ركّز على مراجعة الأزمنة (خصوصًا الماضي التام) والفرق بينها.",
  "past-perfect": "تدرّب على استخدام الماضي التام لوصف حدث سابق لحدث ماضٍ آخر.",
  prepositions: "راجع حروف الجر الشائعة في الجمل السلبية والوصفية.",
  "passive-voice": "تدرّب على تحويل الجمل بين المبني للمعلوم والمبني للمجهول.",
  conditionals: "راجع الجمل الشرطية، خصوصًا النوع الثاني (احتمال غير واقعي).",
  "relative-clauses": "ركّز على استخدام who/which/whose في الجمل الوصفية.",
  comparatives: "راجع صيغ المقارنة الشاذة مثل good/better/best.",
  subjunctive: "تدرّب على تراكيب would rather وصيغة الفعل المرافقة لها.",
  "reading-comprehension": "تدرّب على استخراج الفكرة الرئيسية والتفاصيل الداعمة من النصوص.",
  "listening-comprehension": "تدرّب على تحديد التفاصيل المحددة أثناء الاستماع للمحادثات.",
  "listening-inference": "ركّز على الاستنتاج من سياق المحادثة، لا الكلمات الحرفية فقط.",
  "error-identification": "راجع أخطاء القواعد الشائعة في الجمل المكتوبة (تطابق الفعل، أدوات التعريف).",
  "countable-uncountable": "راجع الفرق بين الأسماء المعدودة وغير المعدودة (fewer/less, many/much).",
  "dangling-modifiers": "انتبه للعبارات الافتتاحية التي يجب أن تصف فاعل الجملة الرئيسي.",
};

const DEFAULT_RECOMMENDATION = "راجع الدروس الأساسية في هذا القسم لتثبيت المفاهيم.";

export function generateRecommendations(weakSkills: string[]): string[] {
  if (weakSkills.length === 0) {
    return ["أداء ممتاز في جميع الأقسام — تابع مع اختبارات تجريبية أصعب للحفاظ على مستواك."];
  }

  return weakSkills.map((tag) => TAG_RECOMMENDATIONS[tag] ?? DEFAULT_RECOMMENDATION);
}
