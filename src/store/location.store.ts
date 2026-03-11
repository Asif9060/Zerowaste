"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { matchToKnownLocation } from "@/lib/location";
import { toast } from "sonner";
import type { Country } from "@/types";

export interface DetectedLocation {
  country: Country;
  province: string;
  city: string;
}

interface LocationState {
  detectedLocation: DetectedLocation | null;
  isDetecting: boolean;
  permissionDenied: boolean;
  detectionFailed: boolean;
  rawDetectedCountry: string | null; // ISO country code Nominatim returned (for user feedback)
  detectLocation: () => Promise<void>;
  setLocation: (loc: DetectedLocation) => void;
  clearLocation: () => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      detectedLocation: null,
      isDetecting: false,
      permissionDenied: false,
      detectionFailed: false,
      rawDetectedCountry: null,

      detectLocation: async () => {
        if (typeof navigator === "undefined" || !navigator.geolocation) {
          toast.error("Geolocation is not supported by your browser.");
          return;
        }

        set({ isDetecting: true, permissionDenied: false, detectionFailed: false });

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            try {
              const res = await fetch(
                `/api/geocode/reverse?lat=${latitude}&lon=${longitude}`
              );

              if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                toast.error(`Location lookup failed: ${err?.error ?? res.statusText}`);
                set({ isDetecting: false, detectionFailed: true });
                return;
              }

              const address = await res.json();
              const matched = matchToKnownLocation(address);

              if (matched) {
                set({ detectedLocation: matched, isDetecting: false, detectionFailed: false, rawDetectedCountry: null });
                toast.success(`📍 Location detected: ${matched.city}, ${matched.province}`);
              } else {
                // Nominatim returned a country outside ZA / ZW — show exact country to user
                const detectedCountry = (address.country_code ?? "").toUpperCase() || "unknown";
                toast.error(
                  `Your device's GPS places you in "${detectedCountry}" which is outside our supported regions (ZA 🇿🇦, ZW 🇿🇼). Please set your location manually below.`
                );
                set({ isDetecting: false, detectionFailed: true, rawDetectedCountry: address.country_code ?? null });
              }
            } catch {
              toast.error("Location lookup failed — check your internet connection.");
              set({ isDetecting: false, detectionFailed: true });
            }
          },
          (err) => {
            if (err.code === err.PERMISSION_DENIED) {
              toast.error(
                "Location permission denied. Enable it in your browser settings, then try again."
              );
              set({ isDetecting: false, permissionDenied: true });
            } else {
              toast.error("Could not get your GPS position. Try again or select location manually.");
              set({ isDetecting: false, detectionFailed: true });
            }
          },
          { timeout: 10000, maximumAge: 300_000 }
        );
      },

      setLocation: (loc) =>
        set({ detectedLocation: loc, permissionDenied: false, detectionFailed: false, rawDetectedCountry: null }),

      clearLocation: () =>
        set({ detectedLocation: null, permissionDenied: false, detectionFailed: false, rawDetectedCountry: null }),
    }),
    {
      name: "zerowaste-location",
      partialize: (state) => ({
        detectedLocation: state.detectedLocation,
        permissionDenied: state.permissionDenied,
      }),
    }
  )
);
