'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

const INACTIVITY_TIMEOUT = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
const STORAGE_KEY = 'admin_last_activity';

export default function AutoLogout() {
  const router = useRouter();
  const checkingRef = useRef(false);

  useEffect(() => {
    // 1. Synchronously check on mount
    const lastStr = localStorage.getItem(STORAGE_KEY);
    const last = lastStr ? parseInt(lastStr, 10) : Date.now();
    
    if (Date.now() - last > INACTIVITY_TIMEOUT) {
      if (!checkingRef.current) {
        checkingRef.current = true;
        const supabase = createClient();
        supabase.auth.signOut().then(() => {
          localStorage.removeItem(STORAGE_KEY);
          router.push('/admin/login');
        });
      }
      return; // Do not attach listeners if already logged out
    }

    // Initialize or update timestamp on mount
    localStorage.setItem(STORAGE_KEY, Date.now().toString());

    // 2. Throttled activity handler
    let timeoutId: NodeJS.Timeout | null = null;
    const handleActivity = () => {
      if (!timeoutId) {
        timeoutId = setTimeout(() => {
          localStorage.setItem(STORAGE_KEY, Date.now().toString());
          timeoutId = null;
        }, 5000); // Throttled to max 1 update per 5 seconds
      }
    };

    // Attach event listeners for tracking user activity
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    // 3. Periodic check (every minute)
    const intervalId = setInterval(() => {
      const currentLastStr = localStorage.getItem(STORAGE_KEY);
      const currentLast = currentLastStr ? parseInt(currentLastStr, 10) : Date.now();
      
      if (Date.now() - currentLast > INACTIVITY_TIMEOUT) {
        if (!checkingRef.current) {
          checkingRef.current = true;
          const supabase = createClient();
          supabase.auth.signOut().then(() => {
            localStorage.removeItem(STORAGE_KEY);
            router.push('/admin/login');
          });
        }
      }
    }, 60000);

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      clearInterval(intervalId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [router]);

  return null;
}
