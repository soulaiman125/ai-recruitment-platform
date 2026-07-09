import { usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import type { Auth } from '@/types';

/** A muted "<role> workspace" label sits under the app name in the sidebar. */
const roleWorkspaceLabels: Record<string, string> = {
    admin: 'Admin workspace',
    company: 'Company workspace',
    recruiter: 'Recruiter workspace',
    candidate: 'Candidate workspace',
};

export default function AppLogo() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const role = auth.roles?.[0];
    const workspace = (role && roleWorkspaceLabels[role]) ?? 'Workspace';

    return (
        <>
            <AppLogoIcon className="size-8 shrink-0 text-violet-500 dark:text-violet-400" />
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    AI Recruitment Platform
                </span>
                <span className="truncate text-xs text-muted-foreground">
                    {workspace}
                </span>
            </div>
        </>
    );
}
