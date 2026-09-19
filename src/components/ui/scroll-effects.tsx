"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, useScroll, useSpring, AnimatePresence } from "motion/react";
import { ArrowUp } from "lucide-react";
import { WhatsAppIcon } from "@/components/brand/whatsapp-icon";
import { cn } from "@/lib/utils/cn";

const WHATSAPP_NUMBER = "966550000000";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-ink-violet rtl:origin-right"
      aria-hidden="true"
    />
  );
}

export function BackToTop() {
  const t = useTranslations("scrollEffects");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={handleClick}
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.9 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "fixed bottom-6 end-6 z-[60] inline-flex size-11 items-center justify-center rounded-full",
            "bg-primary-600 text-ink-violet transition-colors",
            "hover:bg-primary-700 active:scale-[0.98]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          )}
          aria-label={t("backToTop")}
        >
          <ArrowUp className="size-5 rtl:rotate-180" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export function WhatsAppFloat() {
  const t = useTranslations("scrollEffects");

  return (
    <motion.a
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 16, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1], delay: 1 }}
      className={cn(
        "fixed bottom-6 start-6 z-[60] inline-flex size-11 items-center justify-center rounded-full",
        "bg-[#25D366] text-white transition-colors",
        "hover:bg-[#1EBE5A] hover:active:scale-[0.98]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      )}
      aria-label={t("whatsApp")}
    >
      <WhatsAppIcon className="size-5" />
    </motion.a>
  );
}
