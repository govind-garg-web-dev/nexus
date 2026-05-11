"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  userId: string | null;
  collegeId: string | null;
  isProfileComplete: boolean;
  setAuth: (userId: string, collegeId: string) => void;
  setProfileComplete: (v: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userId: null,
      collegeId: null,
      isProfileComplete: false,
      setAuth: (userId, collegeId) => set({ userId, collegeId }),
      setProfileComplete: (v) => set({ isProfileComplete: v }),
      clearAuth: () => set({ userId: null, collegeId: null, isProfileComplete: false }),
    }),
    { name: "nexus-auth" },
  ),
);
