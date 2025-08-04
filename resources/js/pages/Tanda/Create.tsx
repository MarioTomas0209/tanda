import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, ArrowLeft, GripVertical, Shuffle } from 'lucide-react';
import { useState } from 'react';

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

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center space-x-4">
                    <Button variant="outline" size="sm" onClick={() => window.history.back()}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Crear Nueva Tanda</h1>
                        <p className="text-gray-600">Configura los detalles de tu tanda</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Información básica de la tanda */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Información de la Tanda</CardTitle>
                            <CardDescription>
                                Define los detalles básicos de tu tanda
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
                                    <Select value={data.frequency} onValueChange={(value) => setData('frequency', value)}>
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

                            <div className="p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-800">
                                    <strong>💡 Información:</strong> Se generarán automáticamente {participants.length} pagos por participante ({participants.length} semanas si es semanal, {participants.length} quincenas si es quincenal, etc.).
                                    Cada participante recibirá ${(Number(data.amount) * participants.length).toLocaleString()} cuando le toque cobrar.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Participantes */}
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle>Participantes</CardTitle>
                                    <CardDescription>
                                        Agrega los participantes de la tanda (mínimo 2). 
                                        El orden determina cuándo le toca cobrar a cada uno.
                                    </CardDescription>
                                </div>
                                <div className="flex space-x-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={shuffleParticipants}
                                        disabled={participants.length < 3}
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
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Agregar Participante
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {errors.participants && (
                                <p className="text-sm text-red-600 mb-4">{errors.participants}</p>
                            )}

                            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-blue-800">
                                    <strong>💡 Orden de cobro:</strong> El primer participante cobra primero, 
                                    luego el segundo, y así sucesivamente. Usa las flechas ↑↓ para reordenar manualmente 
                                    o el botón "Ordenar Aleatoriamente" para un orden al azar.
                                </p>
                            </div>
                            <div className="space-y-4">
                                {participants.map((participant, index) => (
                                    <div key={index} className="border rounded-lg p-4">
                                        <div className="flex justify-between items-center mb-4">
                                            <div className="flex items-center space-x-2">
                                                <div className="flex flex-col space-y-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => moveParticipant(index, index - 1)}
                                                        disabled={index === 0}
                                                        className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                                                    >
                                                        ↑
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => moveParticipant(index, index + 1)}
                                                        disabled={index === participants.length - 1}
                                                        className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                                                    >
                                                        ↓
                                                    </button>
                                                </div>
                                                <h4 className="font-medium">Participante {index + 1}</h4>
                                            </div>
                                            {participants.length > 2 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeParticipant(index)}
                                                    className="text-red-600 hover:text-red-700"
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
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor={`phone-${index}`}>Teléfono</Label>
                                                <Input
                                                    id={`phone-${index}`}
                                                    value={participant.phone}
                                                    onChange={(e) => updateParticipant(index, 'phone', e.target.value)}
                                                    placeholder="+1234567890"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
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
                            {processing ? 'Creando...' : 'Crear Tanda'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}