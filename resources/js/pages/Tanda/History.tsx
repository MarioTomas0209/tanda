import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, Calendar, DollarSign, Copy, Clock } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Mis Tandas',
        href: '/tandas',
    },
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
    active: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
};

export default function History({ tandas }: Props) {
    // Filtrar solo tandas completadas o canceladas
    const historicalTandas = tandas.filter(tanda => 
        tanda.status === 'completed' || tanda.status === 'cancelled'
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Historial de Tandas" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="outline" size="sm" onClick={() => window.history.back()}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Historial de Tandas</h1>
                            <p className="text-gray-600">Tandas completadas y canceladas</p>
                        </div>
                    </div>
                    <Link href="/tandas">
                        <Button variant="outline">
                            Ver Tandas Activas
                        </Button>
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <Clock className="w-5 h-5 text-blue-600" />
                                <div>
                                    <p className="text-sm text-gray-600">Total en Historial</p>
                                    <p className="text-2xl font-bold">{historicalTandas.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <Calendar className="w-5 h-5 text-green-600" />
                                <div>
                                    <p className="text-sm text-gray-600">Completadas</p>
                                    <p className="text-2xl font-bold">
                                        {historicalTandas.filter(t => t.status === 'completed').length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <Users className="w-5 h-5 text-purple-600" />
                                <div>
                                    <p className="text-sm text-gray-600">Participantes Totales</p>
                                    <p className="text-2xl font-bold">
                                        {historicalTandas.reduce((sum, tanda) => sum + tanda.total_participants, 0)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tandas Grid */}
                {historicalTandas.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <Clock className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                            <h3 className="mb-2 text-lg font-medium text-gray-900">No hay tandas en el historial</h3>
                            <p className="mb-6 text-gray-600">
                                Las tandas completadas o canceladas aparecerán aquí
                            </p>
                            <Link href="/tandas">
                                <Button>
                                    Ver Tandas Activas
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {historicalTandas.map((tanda) => (
                            <Card key={tanda.id} className="transition-shadow hover:shadow-lg">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="text-lg">{tanda.name}</CardTitle>
                                            <CardDescription>{frequencyLabels[tanda.frequency]}</CardDescription>
                                        </div>
                                        <Badge className={statusColors[tanda.status]}>
                                            {statusLabels[tanda.status]}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <DollarSign className="mr-2 h-4 w-4" />
                                            ${Number(tanda.amount).toFixed(2)} por pago
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Users className="mr-2 h-4 w-4" />
                                            {tanda.total_participants} participantes
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Calendar className="mr-2 h-4 w-4" />
                                            Inició: {new Date(tanda.start_date).toLocaleDateString()}
                                        </div>

                                        {tanda.completed_at && (
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Clock className="mr-2 h-4 w-4" />
                                                Finalizó: {new Date(tanda.completed_at).toLocaleDateString()}
                                            </div>
                                        )}

                                        {/* Progress */}
                                        <div className="pt-2">
                                            <div className="mb-1 flex justify-between text-sm text-gray-600">
                                                <span>Progreso Final</span>
                                                <span>
                                                    {tanda.paid_payments}/{tanda.total_payments}
                                                </span>
                                            </div>
                                            <div className="h-2 w-full rounded-full bg-gray-200">
                                                <div
                                                    className="h-2 rounded-full bg-blue-600 transition-all"
                                                    style={{
                                                        width: `${tanda.total_payments > 0 ? (tanda.paid_payments / tanda.total_payments) * 100 : 0}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-4 space-y-2">
                                            <Link href={`/tandas/${tanda.id}`}>
                                                <Button variant="outline" className="w-full">
                                                    Ver Detalles
                                                </Button>
                                            </Link>
                                            <Link href={`/tandas/${tanda.id}/duplicate`}>
                                                <Button variant="ghost" className="w-full">
                                                    <Copy className="w-4 h-4 mr-2" />
                                                    Duplicar Tanda
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
} 