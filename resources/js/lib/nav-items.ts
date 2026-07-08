import { Briefcase, LayoutGrid } from 'lucide-react';
import { dashboard } from '@/routes';
import { index as recruiterJobs } from '@/routes/recruiter/jobs';
import type { NavItem } from '@/types';

/**
 * روابط الـ sidebar حسب الدور.
 * ملي نبنيو feature جديدة، نزيدو غير سطر هنا.
 */
export const navItemsByRole: Record<string, NavItem[]> = {
    admin: [{ title: 'Dashboard', href: dashboard(), icon: LayoutGrid }],

    company: [{ title: 'Dashboard', href: dashboard(), icon: LayoutGrid }],

    recruiter: [
        { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
        { title: 'Jobs', href: recruiterJobs(), icon: Briefcase },
    ],

    candidate: [{ title: 'Dashboard', href: dashboard(), icon: LayoutGrid }],
};

export function navItemsForRole(role?: string): NavItem[] {
    return navItemsByRole[role ?? ''] ?? [
        { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
    ];
}