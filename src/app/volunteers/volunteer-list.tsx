'use client';

import EmptyState from "@/app/components/empty-state";
import { Button } from "@/app/components/button";
import { useState } from "react";
import { DeleteVolunteerDialog } from "./delete-volunteer-dialog";
import { useRouter } from "next/navigation";
import { VolunteerEntity } from "@/types/volunteer";

export default function VolunteerList({ title, typePlural, volunteers, emptyMessage, isAdmin }: Readonly<{ title: string, typePlural: string, volunteers: VolunteerEntity[], emptyMessage: string, isAdmin: boolean }>) {
    const [selected, setSelected] = useState<{ name: string; uri: string } | null>(null);
    const router = useRouter();

    return (
        <div className="space-y-4 pt-4">
            <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
            {volunteers.length === 0 ? (
                <EmptyState
                    title={`No ${typePlural} found`}
                    description={emptyMessage}
                />
            ) : (
                <ul className="list-grid">
                    {volunteers.map((v, idx) => {
                        const id = v.name ? `${v.type}-${v.name}-${idx}` : `${v.type}-${idx}`;
                        return (
                            <li key={id} className="list-card pl-7 flex justify-between items-start">
                                <div>
                                    <div className="list-kicker">{v.type}</div>
                                    <div className="list-title block font-medium">
                                        {v.name || "Unknown"}
                                    </div>
                                    {v.emailAddress && (
                                        <div className="list-support">{v.emailAddress}</div>
                                    )}
                                </div>
                                {isAdmin && v.uri && (
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => setSelected({ name: v.name || "Unknown", uri: v.uri! })}
                                    >
                                        Delete
                                    </Button>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}

            {selected && (
                <DeleteVolunteerDialog
                    volunteer={selected}
                    onCancel={() => setSelected(null)}
                    onSuccess={() => {
                        setSelected(null);
                        router.refresh();
                    }}
                />
            )}
        </div>
    );
}
