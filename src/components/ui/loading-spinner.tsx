export function LoadingSpinner({ label = "Loading" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-600">
      <span
        aria-hidden="true"
        className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"
      />
      <span>{label}</span>
    </span>
  );
}
