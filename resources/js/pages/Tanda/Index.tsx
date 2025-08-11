import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Calendar, DollarSign, Plus, Users, Clock, Edit, Eye } from 'lucide-react';
import { colorClasses } from '@/lib/colors';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mis Tandas',
        href: '/tandas',
    },
];

interface Tanda {
    id: number;
    name: string;
    amount: number;
    frequency: 'weekly' | 'biweekly' | 'monthly';
    start_date: string;
    status: 'active' | 'completed' | 'cancelled';
    participants_count: number;
    payments_count: number;
    paid_payments_count: number;
    created_at: string;
}

interface Props {
    tandas: Tanda[];
}

const frequencyLabels = {
    weekly: 'Semanal',
    biweekly: 'Quincenal',
    monthly: 'Mensual',
};

const statusLabels = {
    active: 'Activa',
    completed: 'Completada',
    cancelled: 'Cancelada',
};

const statusColors = {
    active: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400',
    completed: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
};

export default function Index({ tandas }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mis Tandas" />

            <div className="space-y-4 p-4 md:space-y-6 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 md:text-3xl">
                            Mis Tandas
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Gestiona todas tus tandas
                        </p>
                    </div>
                    <div className="flex w-full sm:w-auto">
                        <Link href="/tandas/create" className="w-full sm:w-auto">
                            <Button className={`w-full sm:w-auto h-11 ${colorClasses.button.primary}`}>
                                <Plus className="mr-2 h-4 w-4" />
                                Crear Nueva Tanda
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Tandas Grid */}
                {tandas.length === 0 ? (
                    <div className="rounded-lg bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/20 dark:to-violet-950/20 border border-indigo-200 dark:border-indigo-700 p-4 border-2 border-dashed border-indigo-200 dark:border-indigo-700">
                        <div className="py-16 text-center">
                            <Users className="mx-auto mb-4 h-16 w-16 text-indigo-400 dark:text-indigo-500" />
                            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
                                No tienes tandas creadas
                            </h3>
                            <p className="mb-6 text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                                Crea tu primera tanda para empezar a gestionar pagos de manera organizada
                            </p>
                            <Link href="/tandas/create">
                                <Button size="lg" className={`h-12 px-6 ${colorClasses.button.primary}`}>
                                    <Plus className="mr-2 h-5 w-5" />
                                    Crear Primera Tanda
                                </Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {tandas.map((tanda) => (
                            <div 
                                key={tanda.id} 
                                className="rounded-lg bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/20 dark:to-violet-950/20 border border-indigo-200 dark:border-indigo-700 p-4 group transition-all duration-200 hover:shadow-lg hover:shadow-indigo-200/50 dark:hover:shadow-indigo-900/50"
                            >
                                <div className="pb-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                                                {tanda.name}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {frequencyLabels[tanda.frequency]}
                                            </p>
                                        </div>
                                        <Badge className={`${statusColors[tanda.status]} text-xs font-medium px-2 py-1`}>
                                            {statusLabels[tanda.status]}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="pt-0">
                                    <div className="space-y-4">
                                        {/* Información principal */}
                                        <div className="space-y-3">
                                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                <DollarSign className="mr-3 h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                                                <span className="font-medium">${Number(tanda.amount).toFixed(2)}</span>
                                                <span className="ml-1">por pago</span>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                <Users className="mr-3 h-4 w-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                                                <span className="font-medium">{tanda.participants_count}</span>
                                                <span className="ml-1">participantes</span>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                <Calendar className="mr-3 h-4 w-4 text-violet-600 dark:text-violet-400 flex-shrink-0" />
                                                <span>Inicia: {new Date(tanda.start_date).toLocaleDateString('es-ES', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric'
                                                })}</span>
                                            </div>
                                        </div>

                                        {/* Barra de progreso */}
                                        <div className="pt-2">
                                            <div className="mb-2 flex justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">Progreso</span>
                                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                                    {tanda.paid_payments_count}/{tanda.payments_count}
                                                </span>
                                            </div>
                                            <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                                                <div
                                                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-300"
                                                    style={{
                                                        width: `${tanda.payments_count > 0 ? (tanda.paid_payments_count / tanda.payments_count) * 100 : 0}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* Botones de acción */}
                                        <div className="pt-4 space-y-2">
                                            <Link href={`/tandas/${tanda.id}`} className="block">
                                                <Button variant="outline" className="w-full h-11 border-indigo-300 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 group-hover:border-indigo-400 group-hover:text-indigo-800 dark:group-hover:border-indigo-500 dark:group-hover:text-indigo-200">
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    Ver Detalles
                                                </Button>
                                            </Link>
                                            <Link href={`/tandas/${tanda.id}/edit`} className="block">
                                                <Button variant="ghost" className="w-full h-11 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/20">
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Editar
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Acciones rápidas para móvil */}
                <div className="block lg:hidden">
                    <div className="rounded-lg bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/20 dark:to-violet-950/20 border border-indigo-200 dark:border-indigo-700 p-4">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100 mb-3">
                                Acciones Rápidas
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                <Link href="/tandas/create">
                                    <Button className={`w-full ${colorClasses.button.primary} h-11`}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Nueva Tanda
                                    </Button>
                                </Link>
                                <Link href="/tandas/historial">
                                    <Button variant="outline" className="w-full border-indigo-300 text-indigo-700 dark:text-indigo-300 h-11 hover:bg-indigo-50 dark:hover:bg-indigo-950/20">
                                        <Clock className="mr-2 h-4 w-4" />
                                        Historial
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
