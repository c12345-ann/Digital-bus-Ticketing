import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Pagination({
  page = 1,
  totalPages = 1,
  onPrevious,
  onNext,
}: {
  page?: number;
  totalPages?: number;
  onPrevious?: () => void;
  onNext?: () => void;
}) {
  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-between gap-3 text-sm text-slate-600"
    >
      <Button
        type="button"
        variant="secondary"
        disabled={page <= 1 || !onPrevious}
        onClick={onPrevious}
      >
        <ChevronLeft aria-hidden="true" className="h-4 w-4" />
        Previous
      </Button>
      <span>
        Page {page} of {totalPages}
      </span>
      <Button
        type="button"
        variant="secondary"
        disabled={page >= totalPages || !onNext}
        onClick={onNext}
      >
        Next
        <ChevronRight aria-hidden="true" className="h-4 w-4" />
      </Button>
    </nav>
  );
}
