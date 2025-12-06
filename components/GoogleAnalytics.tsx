"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

export default function GoogleAnalytics({ nonce }: { nonce?: string }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const [isConsented, setIsConsented] = useState(false);

  useEffect(() => {
    const checkConsent = () => {
      const cookies = document.cookie.split("; ");
      const consent = cookies.find((row) => row.startsWith("cookie_consent="));
      setIsConsented(consent?.includes("=true") ?? false);
    };

    checkConsent();
    window.addEventListener("cookie-consent", checkConsent);
    return () => window.removeEventListener("cookie-consent", checkConsent);
  }, []);

  if (!gaId || !isConsented) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="lazyOnload"
        nonce={nonce}
      />
      <Script id="google-analytics" strategy="lazyOnload" nonce={nonce}>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}
