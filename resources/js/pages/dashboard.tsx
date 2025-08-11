import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Calendar, Clock, CreditCard, Plus, TrendingUp, Users } from 'lucide-react';
import { colorClasses } from '@/lib/colors';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Inicio" />
                <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl dark:text-gray-100">Panel de Control</h1>
                        <p className="text-gray-600 dark:text-gray-400">Bienvenido a tu panel de control de tandas</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {/* Tarjeta de Tandas */}
                        <div className="rounded-lg bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/20 dark:to-violet-950/20 border border-indigo-200 dark:border-indigo-700 p-4 group transition-all duration-200 hover:shadow-lg">
                            <div className="pb-3">
                                <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    <div className="rounded-lg bg-indigo-100 p-2 dark:bg-indigo-900/20">
                                        <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <span>Mis Tandas</span>
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Gestiona todas tus tandas y participantes</p>
                            </div>
                            <div className="space-y-4">
                                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                                    Crea y administra tus tandas, controla los pagos y mantén un seguimiento de todos los participantes.
                                </p>
                                <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                                    <Link href="/tandas" className="flex-1">
                                        <Button variant="outline" className="w-full text-sm border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/20">
                                            Ver Tandas
                                        </Button>
                                    </Link>
                                    <Link href="/tandas/create" className="flex-1">
                                        <Button className={`w-full text-sm ${colorClasses.button.primary}`}>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Crear
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Tarjeta de Próximos Pagos */}
                        <div className="rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-700 p-4 group transition-all duration-200 hover:shadow-lg">
                            <div className="pb-3">
                                <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/20">
                                        <CreditCard className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <span>Próximos Pagos</span>
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Pagos pendientes y fechas importantes</p>
                            </div>
                            <div className="space-y-4">
                                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                                    Revisa los pagos próximos a vencer y mantén un control de las fechas importantes.
                                </p>
                                <Link href="/tandas">
                                    <Button variant="outline" className="w-full text-sm border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20">
                                        <Clock className="mr-2 h-4 w-4" />
                                        Ver Pagos
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Tarjeta de Historial */}
                        <div className="rounded-lg bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20 border border-violet-200 dark:border-violet-700 p-4 group transition-all duration-200 hover:shadow-lg">
                            <div className="pb-3">
                                <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    <div className="rounded-lg bg-violet-100 p-2 dark:bg-violet-900/20">
                                        <Calendar className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                                    </div>
                                    <span>Historial</span>
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Tandas completadas y registros</p>
                            </div>
                            <div className="space-y-4">
                                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                                    Revisa el historial de todas tus tandas completadas y mantén un registro de tu actividad.
                                </p>
                                <Link href="/tandas/historial">
                                    <Button variant="outline" className="w-full text-sm border-violet-600 text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950/20">
                                        Ver Historial
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Tarjeta de Estadísticas */}
                        <div className="rounded-lg bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border border-orange-200 dark:border-orange-700 p-4 group transition-all duration-200 hover:shadow-lg">
                            <div className="pb-3">
                                <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900/20">
                                        <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <span>Estadísticas</span>
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Resumen de tu actividad</p>
                            </div>
                            <div className="space-y-4">
                                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                                    Próximamente: estadísticas detalladas de tus tandas y pagos con gráficos interactivos.
                                </p>
                                <div className="py-4 text-center">
                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/20 dark:to-orange-800/20">
                                        <TrendingUp className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sección de Acciones Rápidas para Móvil */}
                    <div className="block lg:hidden">
                        <div className="rounded-lg bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/20 dark:to-violet-950/20 border border-indigo-200 dark:border-indigo-700 p-4">
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100">Acciones Rápidas</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <Link href="/tandas/create">
                                    <Button className={`w-full ${colorClasses.button.primary}`}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Nueva Tanda
                                    </Button>
                                </Link>
                                <Link href="/tandas">
                                    <Button variant="outline" className="w-full border-indigo-300 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/20">
                                        <Users className="mr-2 h-4 w-4" />
                                        Ver Tandas
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </AppLayout>
        </>
    );
}
