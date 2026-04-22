import { VolunteersService } from "@/api/volunteerApi";
import ErrorAlert from "@/app/components/error-alert";
import PageShell from "@/app/components/page-shell";
import { serverAuthProvider } from "@/lib/authProvider";
import { parseErrorMessage } from "@/types/errors";
import { Volunteer, VolunteerEntity } from "@/types/volunteer";
import VolunteerList from "./volunteer-list";
import { UsersService } from "@/api/userApi";
import { isAdmin } from "@/lib/authz";

function serializeVolunteers(volunteers: Volunteer[]): VolunteerEntity[] {
    return volunteers.map((v) => ({
        uri: v.uri,
        name: v.name,
        emailAddress: v.emailAddress,
        phoneNumber: v.phoneNumber,
        type: v.type,
        expert: v.expert,
    }));
}

export default async function VolunteersPage() {
    const service = new VolunteersService(serverAuthProvider);
    const userService = new UsersService(serverAuthProvider);
    
    let judges: VolunteerEntity[] = [];
    let referees: VolunteerEntity[] = [];
    let floaters: VolunteerEntity[] = [];
    let error: string | null = null;
    let isUserAdmin = false;

    try {
        const currentUser = await userService.getCurrentUser();
        isUserAdmin = isAdmin(currentUser);
        
        const data = await service.getVolunteers();
        judges = serializeVolunteers(data.judges);
        referees = serializeVolunteers(data.referees);
        floaters = serializeVolunteers(data.floaters);
    } catch (e) {
        console.error("Failed to fetch volunteers:", e);
        error = parseErrorMessage(e);
    }

    return (
        <PageShell
            eyebrow="Volunteers directory"
            title="Volunteers"
            description="Manage the competition volunteers including judges, referees, and floaters."
        >
            <div className="space-y-8">
                {error && <ErrorAlert message={error} />}

                {!error && (
                    <div className="space-y-12 shrink-0">
                        <VolunteerList 
                            title="Judges" 
                            typePlural="judges" 
                            volunteers={judges} 
                            emptyMessage="There are currently no judges registered for the competition."
                            isAdmin={isUserAdmin} 
                        />
                        <VolunteerList 
                            title="Referees" 
                            typePlural="referees" 
                            volunteers={referees} 
                            emptyMessage="There are currently no referees registered for the competition."
                            isAdmin={isUserAdmin} 
                        />
                        <VolunteerList 
                            title="Floaters" 
                            typePlural="floaters" 
                            volunteers={floaters} 
                            emptyMessage="There are currently no floaters registered for the competition."
                            isAdmin={isUserAdmin} 
                        />
                    </div>
                )}
            </div>
        </PageShell>
    );
}
