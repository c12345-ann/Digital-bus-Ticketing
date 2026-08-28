import Link from "next/link";

function formatSegment(segment: string) {
  return segment
    .split("-")
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

export function Breadcrumb({ pathname }: { pathname: string }) {
  const segments = pathname.split("/").filter(Boolean);

  // If on the root dashboard of a role (e.g. /passenger/dashboard), display single clean breadcrumb
  let crumbs: Array<{ href: string; isLast: boolean; label: string }> = [];

  if (segments.length === 2 && segments[1] === "dashboard") {
    crumbs = [
      {
        href: pathname,
        isLast: true,
        label: `${formatSegment(segments[0])} Dashboard`,
      },
    ];
  } else {
    crumbs = segments.map((segment, index) => {
      let href = `/${segments.slice(0, index + 1).join("/")}`;
      if (href === "/passenger") href = "/passenger/dashboard";
      if (href === "/conductor") href = "/conductor/dashboard";
      if (href === "/admin") href = "/admin/dashboard";

      const isLast = index === segments.length - 1;
      return { href, isLast, label: formatSegment(segment) };
    });
  }

  return (
    <nav aria-label="Breadcrumb" className="text-xs sm:text-sm text-slate-500">
      <ol className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        <li>
          <Link
            href="/"
            className="font-medium text-slate-600 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition"
          >
            Home
          </Link>
        </li>
        {crumbs.map((crumb, idx) => (
          <li key={`${crumb.href}-${idx}`} className="flex items-center gap-1.5 sm:gap-2">
            <span aria-hidden="true" className="text-slate-300">/</span>
            {crumb.isLast ? (
              <span aria-current="page" className="font-semibold text-slate-900">
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="font-medium text-slate-600 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition"
              >
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
