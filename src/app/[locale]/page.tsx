import { setRequestLocale } from "next-intl/server";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/landing/hero";
import { SocialProof } from "@/components/landing/social-proof";
import { Stats } from "@/components/landing/stats";
import { Features } from "@/components/landing/features";
import { FeatureShowcase } from "@/components/landing/feature-showcase";
import { InteractiveDemo } from "@/components/landing/interactive-demo";
import { Steps } from "@/components/landing/steps";
import { WhyUs } from "@/components/landing/why-us";
import { Testimonials } from "@/components/landing/testimonials";
import { FAQ } from "@/components/landing/faq";
import { CTA } from "@/components/landing/cta";
import { PricingPage } from "@/components/pricing/pricing-page";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <SocialProof />
        <Stats />
        <Features />
        <FeatureShowcase />
        <InteractiveDemo />
        <Steps />
        <Testimonials />
        <WhyUs />
        <FAQ />
        <PricingPage embedded />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
