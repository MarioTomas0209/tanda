import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Plus, Calendar } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600">Bienvenido a tu panel de control</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Users className="w-5 h-5" />
                                <span>Mis Tandas</span>
                            </CardTitle>
                            <CardDescription>
                                Gestiona todas tus tandas y participantes
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <p className="text-sm text-gray-600">
                                    Crea y administra tus tandas, controla los pagos y mantén un seguimiento de todos los participantes.
                                </p>
                                <div className="flex space-x-2">
                                    <Link href="/tandas">
                                        <Button variant="outline" className="w-full">
                                            Ver Tandas
                                        </Button>
                                    </Link>
                                    <Link href="/tandas/create">
                                        <Button className="w-full">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Crear Tanda
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Calendar className="w-5 h-5" />
                                <span>Próximos Pagos</span>
                            </CardTitle>
                            <CardDescription>
                                Pagos pendientes y fechas importantes
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <p className="text-sm text-gray-600">
                                    Revisa los pagos próximos a vencer y mantén un control de las fechas importantes.
                                </p>
                                <Link href="/tandas">
                                    <Button variant="outline" className="w-full">
                                        Ver Pagos
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Estadísticas</CardTitle>
                            <CardDescription>
                                Resumen de tu actividad
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <p className="text-sm text-gray-600">
                                    Próximamente: estadísticas detalladas de tus tandas y pagos.
                                </p>
                                <div className="text-center py-4">
                                    <PlaceholderPattern className="w-16 h-16 mx-auto stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
