// src/stores/juniorStore.ts
import { create } from "zustand";

export interface DecisionCard {
  id:                string;
  status:            "AUTO_APPROVED" | "PENDING_HUMAN" | "BLOCKED";
  riskScore:         number;
  affectedArea:      string;
  humanLabel:        string;
  timestamp:         string;
  originalDecision:  any;
  filePath?:         string;
  fileContent?:      string;
}

interface JuniorState {
  decisions:          DecisionCard[];
  autoApprovedCount:  number;
  addDecision:        (d: DecisionCard) => void;
  approveDecision:    (id: string) => void;
  rejectDecision:     (id: string) => void;
  clearDecisions:     () => void;
}

export const useJuniorStore = create<JuniorState>((set) => ({
  decisions:         [],
  autoApprovedCount: 0,

  addDecision: (d) =>
    set((state) => {
      if (d.status === "AUTO_APPROVED" && d.riskScore <= 3) {
        return { autoApprovedCount: state.autoApprovedCount + 1 };
      }
      return { decisions: [d, ...state.decisions] };
    }),

  approveDecision: (id) =>
    set((state) => ({
      decisions: state.decisions.map((d) =>
        d.id === id ? { ...d, status: "AUTO_APPROVED" as const } : d
      ),
    })),

  rejectDecision: (id) =>
    set((state) => ({
      decisions: state.decisions.filter((d) => d.id !== id),
    })),

  clearDecisions: () => set({ decisions: [], autoApprovedCount: 0 }),
}));
  
