import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, Calendar, DollarSign, Copy, Clock } from 'lucide-react';
import { colorClasses } from '@/lib/colors';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Historial',
        href: '/tandas/historial',
    },
];

interface Participant {
    id: number;
    name: string;
    position: number;
}

interface Tanda {
    id: number;
    name: string;
    amount: number;
    frequency: 'weekly' | 'biweekly' | 'monthly';
    start_date: string;
    status: 'active' | 'completed' | 'cancelled';
    participants: Participant[];
    created_at: string;
    completed_at?: string;
    total_participants: number;
    total_payments: number;
    paid_payments: number;
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

export default function History({ tandas }: Props) {
    // Filtrar solo tandas completadas o canceladas
    const historicalTandas = tandas.filter(tanda => 
        tanda.status === 'completed' || tanda.status === 'cancelled'
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Historial de Tandas" />

            <div className="space-y-4 p-4 md:space-y-6 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:space-x-4">
                        {/* <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => window.history.back()}
                            className="w-full lg:w-auto h-11 border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/20"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver
                        </Button> */}
                        <div className="text-center lg:text-left">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Historial de Tandas</h1>
                            <p className="text-gray-600 dark:text-gray-400">Tandas completadas y canceladas</p>
                        </div>
                    </div>
                    {/* <Link href="/tandas" className="w-full lg:w-auto">
                        <Button variant="outline" className={`w-full lg:w-auto h-11 border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/20`}>
                            Ver Tandas Activas
                        </Button>
                    </Link> */}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
                    <div className="text-center p-4 rounded-lg bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/20 dark:to-violet-950/20 border border-indigo-200 dark:border-indigo-700">
                        <Clock className="h-8 w-8 mx-auto mb-2 text-indigo-600 dark:text-indigo-400" />
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">Total en Historial</h4>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{historicalTandas.length}</p>
                    </div>

                    <div className="text-center p-4 rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-700">
                        <Calendar className="h-8 w-8 mx-auto mb-2 text-emerald-600 dark:text-emerald-400" />
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">Completadas</h4>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {historicalTandas.filter(t => t.status === 'completed').length}
                        </p>
                    </div>

                    <div className="text-center p-4 rounded-lg bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20 border border-violet-200 dark:border-violet-700">
                        <Users className="h-8 w-8 mx-auto mb-2 text-violet-600 dark:text-violet-400" />
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">Participantes Totales</h4>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {historicalTandas.reduce((sum, tanda) => sum + tanda.total_participants, 0)}
                        </p>
                    </div>
                </div>

                {/* Tandas Grid */}
                {historicalTandas.length === 0 ? (
                    <div className="text-center py-12 rounded-lg bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/20 dark:to-violet-950/20 border border-indigo-200 dark:border-indigo-700">
                        <Clock className="mx-auto mb-4 h-12 w-12 text-indigo-400 dark:text-indigo-500" />
                        <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">No hay tandas en el historial</h3>
                        <p className="mb-6 text-gray-600 dark:text-gray-400">
                            Las tandas completadas o canceladas aparecerán aquí
                        </p>
                        <Link href="/tandas">
                            <Button className={colorClasses.button.primary}>
                                Ver Tandas Activas
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {historicalTandas.map((tanda) => (
                            <div key={tanda.id} className="rounded-lg bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/20 dark:to-violet-950/20 border border-indigo-200 dark:border-indigo-700 p-4 transition-shadow hover:shadow-lg">
                                {/* Header del Card */}
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{tanda.name}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{frequencyLabels[tanda.frequency]}</p>
                                    </div>
                                    <Badge className={statusColors[tanda.status]}>
                                        {statusLabels[tanda.status]}
                                    </Badge>
                                </div>

                                {/* Contenido del Card */}
                                <div className="space-y-3">
                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                        <DollarSign className="mr-2 h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                        ${Number(tanda.amount).toFixed(2)} por pago
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                        <Users className="mr-2 h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                        {tanda.total_participants} participantes
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                        <Calendar className="mr-2 h-4 w-4 text-violet-600 dark:text-violet-400" />
                                        Inició: {new Date(tanda.start_date).toLocaleDateString()}
                                    </div>

                                    {tanda.completed_at && (
                                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                            <Clock className="mr-2 h-4 w-4" />
                                            Finalizó: {new Date(tanda.completed_at).toLocaleDateString()}
                                        </div>
                                    )}

                                    {/* Progress */}
                                    <div className="pt-2">
                                        <div className="mb-1 flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                            <span>Progreso Final</span>
                                            <span>
                                                {tanda.paid_payments}/{tanda.total_payments}
                                            </span>
                                        </div>
                                        <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                                            <div
                                                className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all"
                                                style={{
                                                    width: `${tanda.total_payments > 0 ? (tanda.paid_payments / tanda.total_payments) * 100 : 0}%`,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Botones */}
                                    <div className="pt-4 space-y-2">
                                        <Link href={`/tandas/${tanda.id}`}>
                                            <Button variant="outline" className="w-full border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/20">
                                                Ver Detalles
                                            </Button>
                                        </Link>
                                        <Link href={`/tandas/${tanda.id}/duplicate`}>
                                            <Button variant="ghost" className="w-full text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/20">
                                                <Copy className="w-4 h-4 mr-2" />
                                                Duplicar Tanda
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
} 