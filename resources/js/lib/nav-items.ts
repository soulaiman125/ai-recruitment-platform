import {
    Bookmark,
    Bot,
    Briefcase,
    Building2,
    CalendarDays,
    FileText,
    FileUp,
    LayoutGrid,
    Search,
    UserRound,
    Users,
} from 'lucide-react';
import { dashboard } from '@/routes';
import { index as adminCompanies } from '@/routes/admin/companies';
import { index as adminJobs } from '@/routes/admin/jobs';
import { index as adminUsers } from '@/routes/admin/users';
import { index as candidateApplications } from '@/routes/candidate/applications';
import { index as candidateInterviews } from '@/routes/candidate/interviews';
import { index as candidateJobs } from '@/routes/candidate/jobs';
import { edit as candidateProfile } from '@/routes/candidate/profile';
import { index as candidateResumes } from '@/routes/candidate/resumes';
import { index as candidateSavedJobs } from '@/routes/candidate/saved-jobs';
import { index as candidateAiCoach } from '@/routes/candidate/ai-coach';
import { edit as companyProfile } from '@/routes/company/profile';
import { index as companyRecruiters } from '@/routes/company/recruiters';
import { index as recruiterJobs } from '@/routes/recruiter/jobs';
import type { NavItem } from '@/types';

/**
 * روابط الـ sidebar حسب الدور.
 * ملي نبنيو feature جديدة، نزيدو غير سطر هنا.
 */
export const navItemsByRole: Record<string, NavItem[]> = {
    admin: [
        { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
        { title: 'Users', href: adminUsers(), icon: Users },
        { title: 'Companies', href: adminCompanies(), icon: Building2 },
        { title: 'Jobs', href: adminJobs(), icon: Briefcase },
    ],

    company: [
        { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
        { title: 'Company Profile', href: companyProfile(), icon: Building2 },
        { title: 'Recruiters', href: companyRecruiters(), icon: Users },
    ],

    recruiter: [
        { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
        { title: 'Jobs', href: recruiterJobs(), icon: Briefcase },
    ],

    candidate: [
        { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
        { title: 'My Profile', href: candidateProfile(), icon: UserRound },
        { title: 'Browse Jobs', href: candidateJobs(), icon: Search },
        { title: 'Saved Jobs', href: candidateSavedJobs(), icon: Bookmark },
        {
            title: 'My Applications',
            href: candidateApplications(),
            icon: FileText,
        },
        {
            title: 'Interviews',
            href: candidateInterviews(),
            icon: CalendarDays,
        },
        { title: 'Resumes', href: candidateResumes(), icon: FileUp },
        {
    title: 'AI Career Coach',
    href: candidateAiCoach(),
    icon: Bot,
},
    ],
};

export function navItemsForRole(role?: string): NavItem[] {
    return (
        navItemsByRole[role ?? ''] ?? [
            { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
        ]
    );
}
