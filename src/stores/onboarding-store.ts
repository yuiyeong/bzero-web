import { create } from "zustand";
import { combine, persist, devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

const MAX_STEP = 3;

interface OnboardingState {
  isCompleted: boolean;
  step: number;
}

interface OnboardingActions {
  actions: {
    makeCompleted: () => void;
  };
}

const onboardingState: OnboardingState = {
  isCompleted: false,
  step: 0,
};

export const useOnboardingStore = create(
  devtools(
    persist(
      immer(
        combine(onboardingState, (set) => {
          const onboardingActions: OnboardingActions = {
            actions: {
              makeCompleted: () =>
                set((state) => {
                  state.isCompleted = true;
                  state.step = MAX_STEP;
                }),
            },
          };
          return onboardingActions;
        })
      ),
      {
        name: "onboardingStore",
        partialize: (store): OnboardingState => ({
          isCompleted: store.isCompleted,
          step: store.step,
        }),
      }
    ),
    {
      name: "onboardingStore",
      enabled: import.meta.env.DEV,
    }
  )
);

export const useOnboardingIsCompleted = () => useOnboardingStore((store) => store.isCompleted);

export const useOnboardingStep = () => useOnboardingStore((store) => store.step);

export const useOnboardingMakeCompleted = () => useOnboardingStore((store) => store.actions.makeCompleted);
