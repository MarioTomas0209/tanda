import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Calendar, DollarSign, Plus, Users, Clock } from 'lucide-react';

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
    active: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
};

export default function Index({ tandas }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mis Tandas" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Mis Tandas</h1>
                        <p className="text-gray-600">Gestiona todas tus tandas</p>
                    </div>
                    <div className="flex space-x-2">
                        <Link href="/tandas/historial">
                            <Button variant="outline">
                                <Clock className="mr-2 h-4 w-4" />
                                Historial
                            </Button>
                        </Link>
                        <Link href="/tandas/create">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Crear Nueva Tanda
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Tandas Grid */}
                {tandas.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <Users className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                            <h3 className="mb-2 text-lg font-medium text-gray-900">No tienes tandas creadas</h3>
                            <p className="mb-6 text-gray-600">Crea tu primera tanda para empezar a gestionar pagos</p>
                            <Link href="/tandas/create">
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Crear Primera Tanda
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {tandas.map((tanda) => (
                            <Card key={tanda.id} className="transition-shadow hover:shadow-lg">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="text-lg">{tanda.name}</CardTitle>
                                            <CardDescription>{frequencyLabels[tanda.frequency]}</CardDescription>
                                        </div>
                                        <Badge className={statusColors[tanda.status]}>{statusLabels[tanda.status]}</Badge>
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
                                            {tanda.participants_count} participantes
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Calendar className="mr-2 h-4 w-4" />
                                            Inicia: {new Date(tanda.start_date).toLocaleDateString()}
                                        </div>

                                        {/* Progress */}
                                        <div className="pt-2">
                                            <div className="mb-1 flex justify-between text-sm text-gray-600">
                                                <span>Progreso</span>
                                                <span>
                                                    {tanda.paid_payments_count}/{tanda.payments_count}
                                                </span>
                                            </div>
                                            <div className="h-2 w-full rounded-full bg-gray-200">
                                                <div
                                                    className="h-2 rounded-full bg-blue-600 transition-all"
                                                    style={{
                                                        width: `${tanda.payments_count > 0 ? (tanda.paid_payments_count / tanda.payments_count) * 100 : 0}%`,
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
                                            <Link href={`/tandas/${tanda.id}/edit`}>
                                                <Button variant="ghost" className="w-full">
                                                    Editar
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
