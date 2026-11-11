"use client";

import { useLang } from "@/lib/lang";

export default function Footer({ contactUrl }: { contactUrl?: string }) {
  const { t } = useLang();
  return (
    <footer className="foot">
      <p>{t.footerNote}</p>
      {contactUrl ? (
        <p>
          {t.footerContact} <a href={contactUrl}>{t.footerContactLink}</a>.
        </p>
      ) : null}
    </footer>
  );
}
