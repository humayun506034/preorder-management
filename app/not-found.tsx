import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center overflow-x-hidden bg-[#f3f3f3] px-3 py-8 text-neutral-900 sm:px-6 sm:py-10">
      <section className="w-full max-w-[560px] rounded-2xl border border-neutral-200 bg-white px-5 py-8 text-center shadow-sm sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-neutral-500 sm:text-sm sm:tracking-[0.24em]">
          404
        </p>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
          Page not found
        </h1>
        <p className="mx-auto mt-3 max-w-105 text-sm leading-6 text-slate-500">
          The page you are looking for does not exist or may have been moved.
          Return to the preorder dashboard to continue.
        </p>

        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">

          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-neutral-200 bg-white px-5 text-sm font-bold text-neutral-900 transition hover:bg-neutral-50"
          >
            View preorders
          </Link>
        </div>
      </section>
    </main>
  );
}
