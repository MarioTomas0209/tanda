import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
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
}

interface Props {
    tanda: Tanda;
}

export default function Edit({ tanda }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: tanda.name,
        amount: tanda.amount.toString(),
        frequency: tanda.frequency,
        start_date: tanda.start_date,
        status: tanda.status,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/tandas/${tanda.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar: ${tanda.name}`} />

            <div className="max-w-2xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center space-x-4">
                    <Button variant="outline" size="sm" onClick={() => window.history.back()}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Editar Tanda</h1>
                        <p className="text-gray-600">Modifica los detalles de tu tanda</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Información de la Tanda</CardTitle>
                            <CardDescription>
                                Modifica los detalles básicos de tu tanda
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="name">Nombre de la tanda</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Ej: Tanda de junio"
                                        className={errors.name ? 'border-red-500' : ''}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="amount">Monto por pago</Label>
                                    <Input
                                        id="amount"
                                        type="number"
                                        step="0.01"
                                        value={data.amount}
                                        onChange={(e) => setData('amount', e.target.value)}
                                        placeholder="0.00"
                                        className={errors.amount ? 'border-red-500' : ''}
                                    />
                                    {errors.amount && (
                                        <p className="text-sm text-red-600 mt-1">{errors.amount}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="frequency">Frecuencia</Label>
                                    <Select value={data.frequency} onValueChange={(value) => setData('frequency', value as 'weekly' | 'biweekly' | 'monthly')}>
                                        <SelectTrigger className={errors.frequency ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Selecciona la frecuencia" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="weekly">Semanal</SelectItem>
                                            <SelectItem value="biweekly">Quincenal</SelectItem>
                                            <SelectItem value="monthly">Mensual</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.frequency && (
                                        <p className="text-sm text-red-600 mt-1">{errors.frequency}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="start_date">Fecha de inicio</Label>
                                    <Input
                                        id="start_date"
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                        className={errors.start_date ? 'border-red-500' : ''}
                                    />
                                    {errors.start_date && (
                                        <p className="text-sm text-red-600 mt-1">{errors.start_date}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="status">Estado</Label>
                                <Select value={data.status} onValueChange={(value) => setData('status', value as 'active' | 'completed' | 'cancelled')}>
                                    <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                                        <SelectValue placeholder="Selecciona el estado" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Activa</SelectItem>
                                        <SelectItem value="completed">Completada</SelectItem>
                                        <SelectItem value="cancelled">Cancelada</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status && (
                                    <p className="text-sm text-red-600 mt-1">{errors.status}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Botones de acción */}
                    <div className="flex justify-end space-x-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.history.back()}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Guardando...' : 'Guardar Cambios'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
} 