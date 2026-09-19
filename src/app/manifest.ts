import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "خطوة — منصة الاستعداد لاختبار STEP",
    short_name: "خطوة",
    description: "منصة تعلّم ذكية للاستعداد لاختبار STEP بخطة دراسية شخصية واختبارات تجريبية.",
    start_url: "/",
    display: "standalone",
    background_color: "#fffcf7",
    theme_color: "#0d0129",
    lang: "ar",
    dir: "rtl",
    categories: ["education", "productivity"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "لوحة التحكم",
        short_name: "الرئيسية",
        description: "انتقل إلى لوحة التحكم لمتابعة خطتك الدراسية.",
        url: "/dashboard",
        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
      {
        name: "الاختبارات التجريبية",
        short_name: "الاختبارات",
        description: "ابدأ اختبارًا تجريبيًا محاكيًا لاختبار STEP.",
        url: "/mock-exams",
        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
    ],
  };
}
