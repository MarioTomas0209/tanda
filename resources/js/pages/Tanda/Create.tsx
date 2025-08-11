import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, ArrowLeft, GripVertical, Shuffle, Users, Calendar, DollarSign, Info } from 'lucide-react';
import { useState } from 'react';
import { colorClasses } from '@/lib/colors';

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
        title: 'Crear Tanda',
        href: '/tandas/create',
    },
];

interface Participant {
    name: string;
    email: string;
    phone: string;
    [key: string]: string;
}

interface Props { }

export default function Create({ }: Props) {
    const [participants, setParticipants] = useState<Participant[]>([
        { name: '', email: '', phone: '' },
        { name: '', email: '', phone: '' },
    ]);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        amount: '',
        frequency: '',
        start_date: '',
        participants: participants,
    });

    const addParticipant = () => {
        setParticipants([...participants, { name: '', email: '', phone: '' }]);
    };

    const removeParticipant = (index: number) => {
        if (participants.length > 2) {
            const newParticipants = participants.filter((_, i) => i !== index);
            setParticipants(newParticipants);
            setData('participants', newParticipants);
        }
    };

    const moveParticipant = (fromIndex: number, toIndex: number) => {
        if (toIndex < 0 || toIndex >= participants.length) return;
        
        const newParticipants = [...participants];
        const [movedParticipant] = newParticipants.splice(fromIndex, 1);
        newParticipants.splice(toIndex, 0, movedParticipant);
        
        setParticipants(newParticipants);
        setData('participants', newParticipants);
    };

    const shuffleParticipants = () => {
        const shuffled = [...participants];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        setParticipants(shuffled);
        setData('participants', shuffled);
    };

    const updateParticipant = (index: number, field: keyof Participant, value: string) => {
        const newParticipants = participants.map((participant, i) => 
            i === index ? { ...participant, [field]: value } : participant
        );
        setParticipants(newParticipants);
        setData('participants', newParticipants);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/tandas');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Nueva Tanda" />

            <div className="max-w-4xl mx-auto space-y-4 p-4 md:space-y-6 md:p-6">
                {/* Header mejorado para móviles */}
                <div className="flex flex-col gap-4">
                    {/* Primera fila: Botón volver y título */}
                    <div className="flex items-center justify-between">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => window.history.back()}
                            className="h-10 w-10 p-0 border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/20"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                        
                        <div className="flex-1 text-center px-4">
                            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 md:text-2xl lg:text-3xl">
                                Crear Nueva Tanda
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base mt-1">
                                Configura los detalles de tu tanda
                            </p>
                        </div>

                        {/* Espaciador para mantener el título centrado */}
                        <div className="w-10"></div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                    {/* Información básica de la tanda */}
                    <div className="rounded-lg bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/20 dark:to-violet-950/20 border border-indigo-200 dark:border-indigo-700 p-4">
                        <div className="mb-4">
                            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                <Info className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                Información de la Tanda
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Define los detalles básicos de tu tanda
                            </p>
                        </div>
                        <div className="space-y-4">
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
                                        <Select value={data.frequency} onValueChange={(value) => setData('frequency', value)}>
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

                                <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-700 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <Info className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                                        <div className="text-sm text-emerald-800 dark:text-emerald-200">
                                            <p className="font-medium mb-1">💡 Información importante:</p>
                                            <p>
                                                Se generarán automáticamente <strong>{participants.length} pagos</strong> por participante 
                                                ({participants.length} semanas si es semanal, {participants.length} quincenas si es quincenal, etc.).
                                            </p>
                                            <p className="mt-1">
                                                Cada participante recibirá <strong>${(Number(data.amount) * participants.length).toLocaleString()}</strong> cuando le toque cobrar.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Participantes */}
                    <div className="rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-700 p-4">
                        <div className="mb-4">
                            <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center">
                                <div>
                                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                        Participantes
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 max-w-md">
                                        Agrega los participantes de la tanda (mínimo 2). 
                                        El orden determina cuándo le toca cobrar a cada uno.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 sm:flex-row sm:space-x-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={shuffleParticipants}
                                        disabled={participants.length < 3}
                                        className="h-10 w-full sm:w-auto border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                                    >
                                        <Shuffle className="w-4 h-4 mr-2" />
                                        Ordenar Aleatoriamente
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addParticipant}
                                        disabled={participants.length >= 20}
                                        className="h-10 w-full sm:w-auto border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/20"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Agregar Participante
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {errors.participants && (
                                <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                                    <p className="text-sm text-red-600 dark:text-red-400">{errors.participants}</p>
                                </div>
                            )}

                            <div className="p-4 bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/20 dark:to-violet-950/20 border border-indigo-200 dark:border-indigo-700 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <Info className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                                    <div className="text-sm text-indigo-800 dark:text-indigo-200">
                                        <p className="font-medium mb-1">💡 Orden de cobro:</p>
                                        <p>
                                            El primer participante cobra primero, luego el segundo, y así sucesivamente. 
                                            Usa las flechas ↑↓ para reordenar manualmente o el botón "Ordenar Aleatoriamente" 
                                            para un orden al azar.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {participants.map((participant, index) => (
                                    <div key={index} className="border border-indigo-200 dark:border-indigo-700 rounded-lg p-4 bg-gradient-to-br from-indigo-50/50 to-violet-50/50 dark:from-indigo-950/10 dark:to-violet-950/10">
                                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex flex-col gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => moveParticipant(index, index - 1)}
                                                        disabled={index === 0}
                                                        className="w-8 h-8 flex items-center justify-center text-indigo-400 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed rounded border border-indigo-200 dark:border-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-700"
                                                    >
                                                        ↑
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => moveParticipant(index, index + 1)}
                                                        disabled={index === participants.length - 1}
                                                        className="w-8 h-8 flex items-center justify-center text-indigo-400 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed rounded border border-indigo-200 dark:border-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-700"
                                                    >
                                                        ↓
                                                    </button>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                                        Participante {index + 1}
                                                    </h4>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        Orden de cobro: {index + 1}°
                                                    </p>
                                                </div>
                                            </div>
                                            {participants.length > 2 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeParticipant(index)}
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 h-10 w-10 p-0"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 gap-4">
                                            <div>
                                                <Label htmlFor={`name-${index}`} className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Nombre *
                                                </Label>
                                                <Input
                                                    id={`name-${index}`}
                                                    value={participant.name}
                                                    onChange={(e) => updateParticipant(index, 'name', e.target.value)}
                                                    placeholder="Nombre completo"
                                                    className="h-11 mt-1"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor={`email-${index}`} className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Email
                                                    </Label>
                                                    <Input
                                                        id={`email-${index}`}
                                                        type="email"
                                                        value={participant.email}
                                                        onChange={(e) => updateParticipant(index, 'email', e.target.value)}
                                                        placeholder="email@ejemplo.com"
                                                        className="h-11 mt-1"
                                                    />
                                                </div>

                                                <div>
                                                    <Label htmlFor={`phone-${index}`} className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Teléfono
                                                    </Label>
                                                    <Input
                                                        id={`phone-${index}`}
                                                        value={participant.phone}
                                                        onChange={(e) => updateParticipant(index, 'phone', e.target.value)}
                                                        placeholder="+1234567890"
                                                        className="h-11 mt-1"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end sm:space-x-4 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.history.back()}
                            className="w-full sm:w-auto h-11 border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/20"
                        >
                            Cancelar
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={processing}
                            className={`w-full sm:w-auto h-11 ${colorClasses.button.primary}`}
                        >
                            {processing ? 'Creando...' : 'Crear Tanda'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}