import { LeaderboardService } from "@/api/leaderboardApi";
import ErrorAlert from "@/app/components/error-alert";
import EmptyState from "@/app/components/empty-state";
import { serverAuthProvider } from "@/lib/authProvider";
import { parseErrorMessage } from "@/types/errors";
import type { LeaderboardItem } from "@/types/leaderboard";
import Link from "next/link";

interface LeaderboardPageProps {
    readonly params: Promise<{ id: string }>;
    readonly searchParams?: Promise<{ page?: string; size?: string }>;
}

export default async function LeaderboardPage(props: Readonly<LeaderboardPageProps>) {
    const { id } = await props.params;
    const searchParams = (await props.searchParams) ?? {};
    const page = Number(searchParams.page ?? "0");
    const size = Number(searchParams.size ?? "20");
    const service = new LeaderboardService(serverAuthProvider);

    let items: LeaderboardItem[] = [];
    let error: string | null = null;

    try {
        const data = await service.getEditionLeaderboard(id, page, size);
        items = data.items;
    } catch (e) {
        console.error("Failed to fetch leaderboard:", e);
        error = parseErrorMessage(e);
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <div className="w-full max-w-3xl px-4 py-10">
                <div className="w-full rounded-lg border border-border bg-card p-6 shadow-sm">
                    <h1 className="text-2xl font-semibold mb-6 text-foreground">Leaderboard</h1>

                    {error && <ErrorAlert message={error} />}

                    {!error && items.length === 0 && (
                        <EmptyState
                            title="No results yet"
                            description="No results yet for this edition."
                        />
                    )}

                    {!error && items.length > 0 && (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border text-left text-muted-foreground">
                                    <th scope="col" className="pb-3 pr-4 font-medium">#</th>
                                    <th scope="col" className="pb-3 pr-4 font-medium">Team</th>
                                    <th scope="col" className="pb-3 pr-4 font-medium text-right">Total Score</th>
                                    <th scope="col" className="pb-3 font-medium text-right">Matches Played</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => {
                                    const isTop3 = item.position <= 3;
                                    return (
                                        <tr key={item.teamId} className="border-b border-border last:border-0">
                                            <td className={`py-3 pr-4 text-sm ${isTop3 ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                                                {item.position}
                                            </td>
                                            <td className={`py-3 pr-4 ${isTop3 ? "font-semibold text-foreground" : ""}`}>
                                                <Link
                                                    href={`/teams/${encodeURIComponent(item.teamId)}`}
                                                    className="hover:underline"
                                                >
                                                    {item.teamName}
                                                </Link>
                                            </td>
                                            <td className={`py-3 pr-4 text-right ${isTop3 ? "font-semibold text-foreground" : ""}`}>
                                                {item.totalScore}
                                            </td>
                                            <td className={`py-3 text-right ${isTop3 ? "font-semibold text-foreground" : ""}`}>
                                                {item.matchesPlayed}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
