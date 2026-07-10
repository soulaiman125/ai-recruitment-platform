import { Link, usePage } from '@inertiajs/react';
import { Bell, BookOpen, FolderGit2 } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { navItemsForRole } from '@/lib/nav-items';
import { dashboard } from '@/routes';
import { index as notifications } from '@/routes/notifications';
import type { Auth, NavItem } from '@/types';

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

type SidebarPageProps = {
    auth: Auth;
    unreadNotifications: number;
};

export function AppSidebar() {
    const { auth, unreadNotifications } = usePage<SidebarPageProps>().props;
    const { isCurrentUrl } = useCurrentUrl();
    const mainNavItems = navItemsForRole(auth.roles?.[0]);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>
            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />

                {/* Notifications sit here rather than in `nav-items.ts`: they
                    are shared by every role, and only this item carries an
                    unread badge, which `NavItem` has no shape for. */}
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            isActive={isCurrentUrl(notifications())}
                            tooltip={{ children: 'Notifications' }}
                            className="transition-colors data-[active=true]:bg-primary/10 data-[active=true]:font-medium data-[active=true]:text-primary"
                        >
                            <Link href={notifications()} prefetch>
                                <Bell />
                                <span>Notifications</span>
                            </Link>
                        </SidebarMenuButton>

                        {unreadNotifications > 0 && (
                            <SidebarMenuBadge
                                className="bg-primary text-primary-foreground"
                                data-test="unread-notifications-badge"
                            >
                                {unreadNotifications > 9
                                    ? '9+'
                                    : unreadNotifications}
                            </SidebarMenuBadge>
                        )}
                    </SidebarMenuItem>
                </SidebarMenu>

                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
