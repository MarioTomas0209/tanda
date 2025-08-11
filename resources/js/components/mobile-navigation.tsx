import { Button } from '@/components/ui/button';
import { type NavItem } from '@/types';
import { Link, usePage, router } from '@inertiajs/react';
import { Home, Users, History, Settings, User, Lock, Palette, LogOut } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';

interface MobileNavigationProps {
    mainItems: NavItem[];
    settingsItems: NavItem[];
}

const getIconForRoute = (href: string) => {
    if (href === '/dashboard') return Home;
    if (href === '/tandas') return Users;
    if (href === '/tandas/historial') return History;
    if (href === '/settings/profile') return User;
    if (href === '/settings/password') return Lock;
    if (href === '/settings/appearance') return Palette;
    return Settings;
};

export function MobileNavigation({ mainItems, settingsItems }: MobileNavigationProps) {
    const isMobile = useIsMobile();
    const page = usePage();
    const currentPath = page.url;
    const cleanup = useMobileNavigation();

    if (!isMobile) return null;

    const allItems = [...mainItems, ...settingsItems];

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    return (
        <>
            {/* Navegación principal */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 lg:hidden">
                <div className="flex items-center justify-around p-2">
                    {allItems.map((item) => {
                        const Icon = getIconForRoute(item.href);
                        const isActive = currentPath.startsWith(item.href);
                        
                        return (
                            <Link key={item.href} href={item.href} className="flex-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`w-full flex-col h-auto py-2 px-1 ${
                                        isActive 
                                            ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20' 
                                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                                    }`}
                                >
                                    <Icon className="h-5 w-5 mb-1" />
                                    <span className="text-xs font-medium">{item.title}</span>
                                </Button>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Botón de logout flotante */}
            <div className="fixed bottom-20 right-4 z-50 lg:hidden">
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleLogout}
                    className="rounded-full w-12 h-12 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                    <LogOut className="h-5 w-5" />
                    <span className="sr-only">Cerrar Sesión</span>
                </Button>
            </div>
        </>
    );
}
