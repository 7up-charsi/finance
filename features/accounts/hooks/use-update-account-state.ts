import { create } from 'zustand';

type State = {
  id?: string;
  open: boolean;
  onOpen: (id: string) => void;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
};

export const useUpdateAccountState = create<State>((set) => ({
  id: undefined,
  open: false,
  onOpen: (id) => set({ open: !!id, id }),
  onOpenChange: (open) =>
    set((prev) => ({ open, id: !open ? undefined : prev.id })),
  onClose: () => set({ open: false, id: undefined }),
}));
