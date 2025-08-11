import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { MobileNavigation } from '@/components/mobile-navigation';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Users, Settings, History, Cog } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Mis Tandas',
        href: '/tandas',
        icon: Users,
    },
    {
        title: 'Historial',
        href: '/tandas/historial',
        icon: History,
    },
];

const settingsNavItems: NavItem[] = [
    {
        title: 'Perfil',
        href: '/settings/profile',
        icon: Settings,
    },
    {
        title: 'Contraseña',
        href: '/settings/password',
        icon: Cog,
    },
    {
        title: 'Apariencia',
        href: '/settings/appearance',
        icon: Settings,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <>
            <Sidebar collapsible="icon" variant="inset">
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild>
                                <Link href="/dashboard" prefetch>
                                    <AppLogo />
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>

                <SidebarContent>
                    <NavMain items={mainNavItems} />
                    <NavMain items={settingsNavItems} title="Configuración" />
                </SidebarContent>

                <SidebarFooter>
                    <NavFooter items={footerNavItems} className="mt-auto" />
                    <NavUser />
                </SidebarFooter>
            </Sidebar>
            
            {/* Navegación móvil en la parte inferior */}
            <MobileNavigation 
                mainItems={mainNavItems}
                settingsItems={settingsNavItems}
            />
        </>
    );
}
