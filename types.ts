export type MutationOptions = {
  onSuccess?: () => void;
  onError?: () => void;
  onSettled?: () => void;
};

export type QueryOptions = {
  enabled?: boolean;
};
