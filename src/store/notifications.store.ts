"use client";

import { create } from "zustand";
import type { Notification } from "@/types";
import { MOCK_NOTIFICATIONS } from "@/lib/mock-data/transactions";

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  loadForUser: (userId: string) => void;
  markAsRead: (id: string) => void;
  markAllRead: () => void;
}

export const useNotificationsStore = create<NotificationsState>((set) => ({
  notifications: [],
  unreadCount: 0,
  loadForUser: (userId) => {
    const userNotifs = MOCK_NOTIFICATIONS.filter((n) => n.userId === userId);
    set({
      notifications: userNotifs,
      unreadCount: userNotifs.filter((n) => !n.isRead).length,
    });
  },
  markAsRead: (id) =>
    set((state) => {
      const updated = state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      );
      return { notifications: updated, unreadCount: updated.filter((n) => !n.isRead).length };
    }),
  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    })),
}));
