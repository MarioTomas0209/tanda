import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { User, Lock, Palette, ArrowLeft } from 'lucide-react';

const settingsNavItems: NavItem[] = [
    {
        title: 'Perfil',
        href: '/settings/profile',
        icon: User,
        description: 'Actualiza tu información personal y preferencias',
    },
    {
        title: 'Contraseña',
        href: '/settings/password',
        icon: Lock,
        description: 'Cambia tu contraseña de acceso',
    },
    {
        title: 'Apariencia',
        href: '/settings/appearance',
        icon: Palette,
        description: 'Personaliza el tema y la apariencia de la aplicación',
    },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    const page = usePage();
    const currentPath = page.url;

    return (
        <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard">
                    <Button variant="ghost" size="sm" className="gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Volver
                    </Button>
                </Link>
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 md:text-3xl">
                        Configuración
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Gestiona tu cuenta y preferencias
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                {/* Sidebar de navegación */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-6">
                        <CardHeader>
                            <CardTitle className="text-lg">Opciones</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {settingsNavItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = currentPath === item.href;
                                
                                return (
                                    <Link key={item.href} href={item.href}>
                                        <Button
                                            variant={isActive ? "default" : "ghost"}
                                            className={`w-full justify-start gap-3 ${
                                                isActive 
                                                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                                            }`}
                                        >
                                            {Icon && <Icon className="h-4 w-4" />}
                                            <div className="flex flex-col items-start">
                                                <span className="font-medium">{item.title}</span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {item.description}
                                                </span>
                                            </div>
                                        </Button>
                                    </Link>
                                );
                            })}
                        </CardContent>
                    </Card>
                </div>

                {/* Contenido principal */}
                <div className="lg:col-span-3">
                    <Card>
                        <CardContent className="p-6">
                            {children}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Navegación móvil simplificada */}
            <div className="block lg:hidden">
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
                    <CardHeader>
                        <CardTitle className="text-lg text-blue-900 dark:text-blue-100">
                            Navegación Rápida
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 gap-2">
                            {settingsNavItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = currentPath === item.href;
                                
                                return (
                                    <Link key={item.href} href={item.href}>
                                        <Button
                                            variant={isActive ? "default" : "outline"}
                                            size="sm"
                                            className={`w-full flex-col h-auto py-3 px-2 ${
                                                isActive 
                                                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                                    : 'border-blue-300 text-blue-700 dark:text-blue-300'
                                            }`}
                                        >
                                            {Icon && <Icon className="h-5 w-5 mb-1" />}
                                            <span className="text-xs font-medium">{item.title}</span>
                                        </Button>
                                    </Link>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
