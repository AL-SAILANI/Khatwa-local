import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/ui/container";

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const links = useTranslations("footerLinks");

  const columns = [
    {
      title: t("product"),
      links: [
        { id: "features", href: "/#features", label: nav("features") },
        { id: "steps", href: "/#steps", label: nav("steps") },
        { id: "faq", href: "/#faq", label: nav("faq") },
      ],
    },
    {
      title: t("company"),
      links: [
        { id: "about", href: "/about", label: links("about") },
        { id: "contact", href: "/contact", label: links("contact") },
      ],
    },
    {
      title: t("legal"),
      links: [
        { id: "privacy", href: "/privacy", label: links("privacy") },
        { id: "terms", href: "/terms", label: links("terms") },
      ],
    },
  ];

  return (
    // A full-bleed band this large takes deep teal, not yellow: Syllabus
    // reserves butter yellow for small accents and forbids it as a wash. Inside
    // the band, yellow returns as the column-heading label colour.
    <footer className="bg-deep-teal">
      <Container className="grid gap-10 py-16 text-cream-paper/75 sm:grid-cols-2 sm:gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <div className="text-cream-paper">
            <Logo className="text-cream-paper dark:text-cream-paper" />
          </div>
          <p className="mt-4 max-w-xs text-sm text-cream-paper/60">{t("tagline")}</p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-semibold text-butter-yellow">{col.title}</h3>
            <ul className="mt-4 space-y-3">
              {col.links.map((link) => (
                <li key={link.id}>
                  <Link href={link.href} className="text-sm text-cream-paper/70 transition-colors hover:text-butter-yellow">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>

      <div className="bg-ink-violet py-4">
        <Container className="text-center text-xs font-semibold text-cream-paper/70">
          © {new Date().getFullYear()} خطوة — {t("rights")}
        </Container>
      </div>
    </footer>
  );
}
