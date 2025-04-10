
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import * as GooglePixel from '@/lib/pixels/googlePixel';
import * as FacebookPixel from '@/lib/pixels/facebookPixel';

// Pixel IDs
const GOOGLE_ADS_ID = 'AW-XXXXXXXXXX'; // Replace with your actual Google Ads ID
const FACEBOOK_PIXEL_ID = 'XXXXXXXXXX'; // Replace with your actual Facebook Pixel ID

interface UsePixelEventsProps {
  // Initialize pixels on component mount
  initialize?: boolean;
}

export const usePixelEvents = ({ initialize = false }: UsePixelEventsProps = {}) => {
  const location = useLocation();
  
  // Initialize pixels on component mount
  useEffect(() => {
    if (initialize && process.env.NODE_ENV === 'production') {
      // Initialize pixels
      GooglePixel.initGooglePixel(GOOGLE_ADS_ID);
      FacebookPixel.initFacebookPixel(FACEBOOK_PIXEL_ID);
      
      // Set global variables for access in window
      window.googleAdsId = GOOGLE_ADS_ID;
    }
  }, [initialize]);
  
  // Track page views on route change
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      // Track page view
      GooglePixel.trackPageView(location.pathname);
      FacebookPixel.trackPageView();
      
      // Check for specific pages to trigger events
      if (location.pathname.includes('/checkout/')) {
        // Begin checkout events
        GooglePixel.trackBeginCheckout();
        FacebookPixel.trackInitiateCheckout();
      }
    }
  }, [location.pathname]);
  
  // Event tracking functions
  const trackPurchase = (orderId: string, value: number) => {
    if (process.env.NODE_ENV === 'production') {
      GooglePixel.trackPurchase(orderId, value);
      FacebookPixel.trackPurchase(value);
    }
  };
  
  return {
    trackPurchase
  };
};

// Declare global window interface
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    fbq: (...args: any[]) => void;
    googleAdsId: string;
  }
}
