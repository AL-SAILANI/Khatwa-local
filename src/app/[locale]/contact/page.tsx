import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { InfoPage } from "@/components/layout/info-page";

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "contactPage" });
  const email = "support@khatwa.app";

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <InfoPage
          namespace="contactPage"
          extra={[`${t("emailLabel")} ${email}`]}
        />
      </main>
      <Footer />
    </>
  );
}
