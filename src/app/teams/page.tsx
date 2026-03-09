import Link from "next/link";

export default function TeamsPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="w-full max-w-3xl p-8 sm:p-12">
                <section className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                    <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                        Teams
                    </h1>
                    <p className="mt-3 text-zinc-600 dark:text-zinc-300">
                        Module under construction.
                    </p>
                    <Link
                        href="/teams/create"
                        className="mt-6 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                        Create Team (coming soon)
                    </Link>
                </section>
            </main>
        </div>
    );
}
