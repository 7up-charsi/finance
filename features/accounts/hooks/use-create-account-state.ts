import { create } from 'zustand';

type State = {
  open: boolean;
  onOpen: () => void;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
};

export const useCreateAccountState = create<State>((set) => ({
  open: false,
  onOpen: () => set({ open: true }),
  onOpenChange: (open) => set({ open }),
  onClose: () => set({ open: false }),
}));
