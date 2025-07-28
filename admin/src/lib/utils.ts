/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx"
import { createTransform } from "redux-persist";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface PersistedState {
  [key: string]: any;
  _persistedAt?: number;
}

export const expireTransform = createTransform<PersistedState, PersistedState | undefined>(
  (inboundState) => {
    return {
      ...inboundState,
      _persistedAt: Date.now(),
    };
  },
  (outboundState: any) => {
    const expiryDuration = 1000 * 60 * 60 * 24;

    if (outboundState?._persistedAt) {
      const isExpired =
        Date.now() - outboundState._persistedAt > expiryDuration;

      if (isExpired) {
        console.log(`[redux-persist] Expired state`);
        return undefined;
      }
    }

    return outboundState;
  }
);