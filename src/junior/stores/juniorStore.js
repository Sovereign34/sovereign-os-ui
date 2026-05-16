import { create } from "zustand";

export const useJuniorStore = create((set) => ({
  decisions: [],
  autoApprovedCount: 0,

  addDecision: (decision) =>
    set((state) => {
      if (decision.status === "AUTO_APPROVED" && decision.riskScore <= 3) {
        return { autoApprovedCount: state.autoApprovedCount + 1 };
      }
      return { decisions: [decision, ...state.decisions] };
    }),

  approveDecision: (id) =>
    set((state) => ({
      decisions: state.decisions.map((d) =>
        d.id === id ? { ...d, status: "AUTO_APPROVED" } : d
      ),
    })),

  rejectDecision: (id) =>
    set((state) => ({
      decisions: state.decisions.filter((d) => d.id !== id),
    })),

  incrementAutoApproved: () =>
    set((state) => ({
      autoApprovedCount: state.autoApprovedCount + 1,
    })),

  clearDecisions: () =>
    set({ decisions: [], autoApprovedCount: 0 }),
}));
