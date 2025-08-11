import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Info, Calendar, DollarSign, Settings } from 'lucide-react';

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

            <div className="max-w-2xl mx-auto space-y-4 p-4 md:space-y-6 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:space-x-4">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => window.history.back()}
                        className="w-full sm:w-auto h-11"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver
                    </Button>
                    <div className="text-center sm:text-left">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 md:text-3xl">
                            Editar Tanda
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Modifica los detalles de tu tanda
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                    <Card className="border-gray-200 dark:border-gray-700">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                Información de la Tanda
                            </CardTitle>
                            <CardDescription className="text-gray-600 dark:text-gray-400">
                                Modifica los detalles básicos de tu tanda
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Nombre de la tanda
                                    </Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Ej: Tanda de junio"
                                        className={`h-11 mt-1 ${errors.name ? 'border-red-500 focus:border-red-500' : ''}`}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="amount" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Monto por pago
                                        </Label>
                                        <Input
                                            id="amount"
                                            type="number"
                                            step="0.01"
                                            value={data.amount}
                                            onChange={(e) => setData('amount', e.target.value)}
                                            placeholder="0.00"
                                            className={`h-11 mt-1 ${errors.amount ? 'border-red-500 focus:border-red-500' : ''}`}
                                        />
                                        {errors.amount && (
                                            <p className="text-sm text-red-600 mt-1">{errors.amount}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="frequency" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Frecuencia
                                        </Label>
                                        <Select value={data.frequency} onValueChange={(value) => setData('frequency', value as 'weekly' | 'biweekly' | 'monthly')}>
                                            <SelectTrigger className={`h-11 mt-1 ${errors.frequency ? 'border-red-500 focus:border-red-500' : ''}`}>
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
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="start_date" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Fecha de inicio
                                        </Label>
                                        <Input
                                            id="start_date"
                                            type="date"
                                            value={data.start_date}
                                            onChange={(e) => setData('start_date', e.target.value)}
                                            className={`h-11 mt-1 ${errors.start_date ? 'border-red-500 focus:border-red-500' : ''}`}
                                        />
                                        {errors.start_date && (
                                            <p className="text-sm text-red-600 mt-1">{errors.start_date}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="status" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Estado
                                        </Label>
                                        <Select value={data.status} onValueChange={(value) => setData('status', value as 'active' | 'completed' | 'cancelled')}>
                                            <SelectTrigger className={`h-11 mt-1 ${errors.status ? 'border-red-500 focus:border-red-500' : ''}`}>
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
                                </div>

                                {/* Información adicional */}
                                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                                        <div className="text-sm text-blue-800 dark:text-blue-200">
                                            <p className="font-medium mb-1">💡 Cambios importantes:</p>
                                            <p>
                                                Al cambiar la frecuencia o fecha de inicio, se recalcularán automáticamente 
                                                todos los pagos pendientes. Los pagos ya realizados no se verán afectados.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Botones de acción */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end sm:space-x-4 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.history.back()}
                            className="w-full sm:w-auto h-11"
                        >
                            Cancelar
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={processing}
                            className="w-full sm:w-auto h-11 bg-blue-600 hover:bg-blue-700"
                        >
                            {processing ? 'Guardando...' : 'Guardar Cambios'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
} 