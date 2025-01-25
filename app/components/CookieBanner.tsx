'use client';
import './cookieBanner.css';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getLocalStorage, setLocalStorage } from '../lib/storageHelper';

export default function CookieBanner() {
  const [cookieConsent, setCookieConsent] = useState<boolean | null>(null);

  useEffect(() => {
    const storedCookieConsent = getLocalStorage('cookie_consent', null);
    setCookieConsent(storedCookieConsent);
  }, []);

  useEffect(() => {
    if (cookieConsent !== null) {
      const consentValue = cookieConsent ? 'granted' : 'denied';
      window.gtag('consent', 'update', {
        analytics_storage: consentValue,
      });
      setLocalStorage('cookie_consent', cookieConsent);
    }
  }, [cookieConsent]);

  if (cookieConsent !== null) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-live="polite">
      <div className="cookie-banner__message">
        <p>
          We use <span className="cookie-banner__cookie-text">cookies</span> to improve your experience.{' '}
          <Link href="/info/cookies" aria-label="Read more about cookies">
            Learn more
          </Link>
        </p>
      </div>
      <div className="cookie-banner__buttons">
        <button
          className="cookie-banner__decline"
          onClick={() => setCookieConsent(false)}
          aria-label="Decline cookies"
        >
          Decline
        </button>
        <button
          className="cookie-banner__accept"
          onClick={() => setCookieConsent(true)}
          aria-label="Allow cookies"
        >
          Allow Cookies
        </button>
      </div>
    </div>
  );
}
