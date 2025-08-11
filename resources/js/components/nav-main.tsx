import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

interface NavMainProps {
    items: NavItem[];
    title?: string;
}

export function NavMain({ items = [], title = 'Platform' }: NavMainProps) {
    const page = usePage();
    const currentPath = page.url;

    // Función para determinar si una ruta está activa
    const isRouteActive = (href: string) => {
        if (href === '/tandas' && currentPath === '/tandas') {
            // Solo activo si es exactamente /tandas (no /tandas/historial)
            return true;
        } else if (href === '/tandas/historial' && currentPath.startsWith('/tandas/historial')) {
            // Activo para historial y subrutas
            return true;
        } else if (href !== '/tandas' && currentPath.startsWith(href)) {
            // Para otras rutas, usar startsWith pero excluir /tandas
            return true;
        }
        return false;
    };

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>{title}</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                            asChild 
                            isActive={isRouteActive(item.href)} 
                            tooltip={{ children: item.title }}
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
