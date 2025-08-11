import { Breadcrumbs } from '@/components/breadcrumbs';
import { Button } from '@/components/ui/button';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { type BreadcrumbItem } from '@/types';
import { Menu, X } from 'lucide-react';

interface AppSidebarHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}

export function AppSidebarHeader({ breadcrumbs = [] }: AppSidebarHeaderProps) {
    const { open, setOpen, openMobile, setOpenMobile, isMobile } = useSidebar();

    const toggleSidebar = () => {
        if (isMobile) {
            setOpenMobile(!openMobile);
        } else {
            setOpen(!open);
        }
    };

    return (
        <div className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
            {isMobile && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="lg:hidden"
                    onClick={toggleSidebar}
                >
                    {isMobile ? (openMobile ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />) : (open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />)}
                </Button>
            )}
            
            <div className="flex-1">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            
            {isMobile && (
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="lg:hidden">
                        <span className="sr-only">Menú</span>
                    </Button>
                </div>
            )}
        </div>
    );
}
