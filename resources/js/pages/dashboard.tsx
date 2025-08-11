import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Head, Link } from '@inertiajs/react';
import { Calendar, Clock, CreditCard, Plus, TrendingUp, Users } from 'lucide-react';

export default function Dashboard() {
    return (
        <>
            <Head title="Inicio" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl dark:text-gray-100">Panel de Control</h1>
                    <p className="text-gray-600 dark:text-gray-400">Bienvenido a tu panel de control de tandas</p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {/* Tarjeta de Tandas */}
                    <Card className="group transition-all duration-200 hover:shadow-lg">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center space-x-2 text-lg">
                                <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/20">
                                    <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <span>Mis Tandas</span>
                            </CardTitle>
                            <CardDescription className="text-sm">Gestiona todas tus tandas y participantes</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                                Crea y administra tus tandas, controla los pagos y mantén un seguimiento de todos los participantes.
                            </p>
                            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                                <Link href="/tandas" className="flex-1">
                                    <Button variant="outline" className="w-full text-sm">
                                        Ver Tandas
                                    </Button>
                                </Link>
                                <Link href="/tandas/create" className="flex-1">
                                    <Button className="w-full text-sm">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Crear
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tarjeta de Próximos Pagos */}
                    <Card className="group transition-all duration-200 hover:shadow-lg">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center space-x-2 text-lg">
                                <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/20">
                                    <CreditCard className="h-5 w-5 text-green-600 dark:text-green-400" />
                                </div>
                                <span>Próximos Pagos</span>
                            </CardTitle>
                            <CardDescription className="text-sm">Pagos pendientes y fechas importantes</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                                Revisa los pagos próximos a vencer y mantén un control de las fechas importantes.
                            </p>
                            <Link href="/tandas">
                                <Button variant="outline" className="w-full text-sm">
                                    <Clock className="mr-2 h-4 w-4" />
                                    Ver Pagos
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Tarjeta de Historial */}
                    <Card className="group transition-all duration-200 hover:shadow-lg">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center space-x-2 text-lg">
                                <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/20">
                                    <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <span>Historial</span>
                            </CardTitle>
                            <CardDescription className="text-sm">Tandas completadas y registros</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                                Revisa el historial de todas tus tandas completadas y mantén un registro de tu actividad.
                            </p>
                            <Link href="/tandas/historial">
                                <Button variant="outline" className="w-full text-sm">
                                    Ver Historial
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Tarjeta de Estadísticas */}
                    <Card className="group transition-all duration-200 hover:shadow-lg">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center space-x-2 text-lg">
                                <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900/20">
                                    <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                </div>
                                <span>Estadísticas</span>
                            </CardTitle>
                            <CardDescription className="text-sm">Resumen de tu actividad</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                                Próximamente: estadísticas detalladas de tus tandas y pagos con gráficos interactivos.
                            </p>
                            <div className="py-4 text-center">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/20 dark:to-orange-800/20">
                                    <TrendingUp className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sección de Acciones Rápidas para Móvil */}
                <div className="block lg:hidden">
                    <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:border-blue-800 dark:from-blue-950/20 dark:to-indigo-950/20">
                        <CardHeader>
                            <CardTitle className="text-lg text-blue-900 dark:text-blue-100">Acciones Rápidas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-3">
                                <Link href="/tandas/create">
                                    <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Nueva Tanda
                                    </Button>
                                </Link>
                                <Link href="/tandas">
                                    <Button variant="outline" className="w-full border-blue-300 text-blue-700 dark:text-blue-300">
                                        <Users className="mr-2 h-4 w-4" />
                                        Ver Tandas
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
