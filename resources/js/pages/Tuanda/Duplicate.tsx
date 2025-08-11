import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Copy, Plus, Trash2, GripVertical, Shuffle, Info } from 'lucide-react';
import { useState } from 'react';
import { colorClasses } from '@/lib/colors';

interface Props {
    originalTanda: {
        id: number;
        name: string;
        amount: number;
        frequency: 'weekly' | 'biweekly' | 'monthly';
        participants: {
            id: number;
            name: string;
            email: string;
            phone: string;
        }[];
        start_date: string;
    };
}

export default function Duplicate({ originalTanda }: Props) {
    const [participants, setParticipants] = useState(originalTanda.participants);
    const { data, setData, post, processing, errors } = useForm({
        name: originalTanda.name,
        amount: originalTanda.amount,
        frequency: originalTanda.frequency,
        start_date: originalTanda.start_date,
        participants: participants.map(p => ({
            id: p.id,
            name: p.name,
            email: p.email,
            phone: p.phone,
        })),
    });

    const frequencyLabels: { [key: string]: string } = {
        weekly: 'Semanal',
        biweekly: 'Quincenal',
        monthly: 'Mensual',
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('tandas.store'));
    };

    const addParticipant = () => {
        setParticipants(prev => [...prev, { id: 0, name: '', email: '', phone: '' }]);
    };

    const updateParticipant = (index: number, field: 'name' | 'email' | 'phone', value: string) => {
        setParticipants(prev => prev.map((p, i) => i === index ? { ...p, [field]: value } : p));
    };

    const removeParticipant = (index: number) => {
        setParticipants(prev => prev.filter((_, i) => i !== index));
    };

    const moveParticipant = (fromIndex: number, toIndex: number) => {
        setParticipants(prev => {
            const newParticipants = [...prev];
            const [movedParticipant] = newParticipants.splice(fromIndex, 1);
            newParticipants.splice(toIndex, 0, movedParticipant);
            return newParticipants;
        });
    };

    const shuffleParticipants = () => {
        setParticipants(prev => [...prev].sort(() => Math.random() - 0.5));
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { name: 'Tandas', url: route('tandas.index') },
        { name: 'Duplicar Tanda', url: route('tandas.duplicate', originalTanda.id) },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Duplicar Tanda" />

            <div className="max-w-4xl mx-auto space-y-6 p-4 md:p-6">
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
                                Duplicar Tanda
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base mt-1">
                                Crea una nueva tanda basada en "{originalTanda.name}"
                            </p>
                        </div>

                        {/* Espaciador para mantener el título centrado */}
                        <div className="w-10"></div>
                    </div>
                </div>

                {/* Información de la tanda original */}
                <div className="bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/20 dark:to-violet-950/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-6">
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100 flex items-center">
                            <Copy className="w-5 h-5 mr-2 text-indigo-600" />
                            Tanda Original
                        </h2>
                        <p className="text-indigo-700 dark:text-indigo-300 text-sm">
                            Configuración que se va a duplicar
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <span className="font-medium text-indigo-800 dark:text-indigo-200">Nombre:</span>
                            <p className="text-indigo-700 dark:text-indigo-300">{originalTanda.name}</p>
                        </div>
                        <div>
                            <span className="font-medium text-indigo-800 dark:text-indigo-200">Monto:</span>
                            <p className="text-indigo-700 dark:text-indigo-300">${Number(originalTanda.amount).toFixed(2)}</p>
                        </div>
                        <div>
                            <span className="font-medium text-indigo-800 dark:text-indigo-200">Frecuencia:</span>
                            <p className="text-indigo-700 dark:text-indigo-300">{frequencyLabels[originalTanda.frequency]}</p>
                        </div>
                        <div>
                            <span className="font-medium text-indigo-800 dark:text-indigo-200">Participantes:</span>
                            <p className="text-indigo-700 dark:text-indigo-300">{originalTanda.participants.length}</p>
                        </div>
                        <div>
                            <span className="font-medium text-indigo-800 dark:text-indigo-200">Fecha de inicio original:</span>
                            <p className="text-indigo-700 dark:text-indigo-300">{new Date(originalTanda.start_date).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Información básica de la nueva tanda */}
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-6">
                        <div className="mb-4">
                            <h2 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">Nueva Tanda</h2>
                            <p className="text-emerald-700 dark:text-emerald-300 text-sm">
                                Personaliza los detalles de la nueva tanda
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="name">Nombre de la tanda</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Ej: Tanda de junio"
                                        className={`${errors.name ? 'border-red-500' : 'border-emerald-200 dark:border-emerald-700'} focus:border-emerald-500 dark:focus:border-emerald-400`}
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
                                        className={`${errors.amount ? 'border-red-500' : 'border-emerald-200 dark:border-emerald-700'} focus:border-emerald-500 dark:focus:border-emerald-400`}
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
                                        <SelectTrigger className={`${errors.frequency ? 'border-red-500' : 'border-emerald-200 dark:border-emerald-700'} focus:border-emerald-500 dark:focus:border-emerald-400`}>
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
                                        className={`${errors.start_date ? 'border-red-500' : 'border-emerald-200 dark:border-emerald-700'} focus:border-emerald-500 dark:focus:border-emerald-400`}
                                    />
                                    {errors.start_date && (
                                        <p className="text-sm text-red-600 mt-1">{errors.start_date}</p>
                                    )}
                                </div>
                            </div>

                            <div className="p-4 bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/20 dark:to-indigo-950/20 border border-violet-200 dark:border-violet-800 rounded-lg">
                                <div className="flex items-start">
                                    <Info className="w-5 h-5 mr-3 text-violet-600 dark:text-violet-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm text-violet-800 dark:text-violet-200 font-medium mb-1">
                                            Información importante
                                        </p>
                                        <p className="text-sm text-violet-700 dark:text-violet-300">
                                            Se generarán automáticamente {participants.length} pagos por participante.
                                            Cada participante recibirá ${(Number(data.amount) * participants.length).toLocaleString()} cuando le toque cobrar.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Participantes */}
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6">
                        <div className="mb-6">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-100">Participantes</h2>
                                    <p className="text-amber-700 dark:text-amber-300 text-sm">
                                        Los participantes de la tanda original han sido copiados. Puedes editarlos, agregar o eliminar.
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={shuffleParticipants}
                                        disabled={participants.length < 3}
                                        className="border-amber-600 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20"
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
                                        className="border-amber-600 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Agregar Participante
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {errors.participants && (
                            <p className="text-sm text-red-600 mb-4">{errors.participants}</p>
                        )}

                        <div className="space-y-4">
                            {participants.map((participant, index) => (
                                <div key={index} className="bg-white dark:bg-gray-900 border border-amber-200 dark:border-amber-700 rounded-lg p-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex flex-col space-y-1">
                                                <button
                                                    type="button"
                                                    onClick={() => moveParticipant(index, index - 1)}
                                                    disabled={index === 0}
                                                    className="text-amber-400 hover:text-amber-600 disabled:opacity-50 disabled:cursor-not-allowed p-1"
                                                >
                                                    ↑
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => moveParticipant(index, index + 1)}
                                                    disabled={index === participants.length - 1}
                                                    className="text-amber-400 hover:text-amber-600 disabled:opacity-50 disabled:cursor-not-allowed p-1"
                                                >
                                                    ↓
                                                </button>
                                            </div>
                                            <h4 className="font-medium text-amber-900 dark:text-amber-100">Participante {index + 1}</h4>
                                        </div>
                                        {participants.length > 2 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeParticipant(index)}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <Label htmlFor={`name-${index}`}>Nombre *</Label>
                                            <Input
                                                id={`name-${index}`}
                                                value={participant.name}
                                                onChange={(e) => updateParticipant(index, 'name', e.target.value)}
                                                placeholder="Nombre completo"
                                                className="border-amber-200 dark:border-amber-700 focus:border-amber-500 dark:focus:border-amber-400"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor={`email-${index}`}>Email</Label>
                                            <Input
                                                id={`email-${index}`}
                                                type="email"
                                                value={participant.email}
                                                onChange={(e) => updateParticipant(index, 'email', e.target.value)}
                                                placeholder="email@ejemplo.com"
                                                className="border-amber-200 dark:border-amber-700 focus:border-amber-500 dark:focus:border-amber-400"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor={`phone-${index}`}>Teléfono</Label>
                                            <Input
                                                id={`phone-${index}`}
                                                value={participant.phone}
                                                onChange={(e) => updateParticipant(index, 'phone', e.target.value)}
                                                placeholder="+1234567890"
                                                className="border-amber-200 dark:border-amber-700 focus:border-amber-500 dark:focus:border-amber-400"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex flex-col sm:flex-row justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.history.back()}
                            className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                            Cancelar
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={processing}
                            className={colorClasses.button.primary}
                        >
                            {processing ? 'Creando...' : 'Crear Tanda Duplicada'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
