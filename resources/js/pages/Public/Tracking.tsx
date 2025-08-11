import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
    Users, 
    Calendar, 
    DollarSign, 
    CheckCircle, 
    Clock, 
    AlertCircle, 
    Copy,
    ExternalLink,
    TrendingUp,
    UserCheck,
    ArrowLeft
} from 'lucide-react';
import { useState } from 'react';
import { colorClasses } from '@/lib/colors';

interface Participant {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    position: number;
    token: string;
}

interface Tanda {
    id: number;
    name: string;
    amount: number;
    frequency: 'weekly' | 'biweekly' | 'monthly';
    start_date: string;
    status: 'active' | 'completed' | 'cancelled';
    total_participants: number;
}

interface Payment {
    id: number;
    due_date: string;
    paid_at: string | null;
    amount_paid: number | null;
    status: 'pending' | 'paid' | 'late';
    is_overdue: boolean;
}

interface CurrentCollector {
    name: string;
    position: number;
    email: string | null;
    phone: string | null;
}

interface Stats {
    total_payments: number;
    paid_payments: number;
    pending_payments: number;
    overdue_payments: number;
    next_payment: Payment | null;
    total_contributed: number;
    tanda_total_paid_payments: number;
}

interface Props {
    participant: Participant;
    tanda: Tanda;
    stats: Stats;
    currentCollector: CurrentCollector | null;
    paymentHistory: Payment[];
    trackingUrl: string;
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

const paymentStatusLabels = {
    pending: 'Pendiente',
    paid: 'Pagado',
    late: 'Atrasado',
};

const paymentStatusColors = {
    pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400',
    paid: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400',
    late: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
};

export default function Tracking({ 
    participant, 
    tanda, 
    stats, 
    currentCollector, 
    paymentHistory, 
    trackingUrl 
}: Props) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(trackingUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Error al copiar:', err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Head title={`Seguimiento - ${tanda.name}`} />

            <div className="max-w-4xl mx-auto py-8 px-4">
                {/* Header mejorado para móviles */}
                <div className="flex flex-col gap-4 mb-8">
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
                                {tanda.name}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base mt-1">
                                Panel de seguimiento para {participant.name}
                            </p>
                        </div>

                        {/* Espaciador para mantener el título centrado */}
                        <div className="w-10"></div>
                    </div>

                    {/* Badge de estado */}
                    <div className="text-center">
                        <Badge className={statusColors[tanda.status]}>
                            {statusLabels[tanda.status]}
                        </Badge>
                    </div>
                </div>

                {/* Información de la tanda */}
                <div className="bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/20 dark:to-violet-950/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-6 mb-6">
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100">Información de la Tanda</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
                                <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-sm text-indigo-700 dark:text-indigo-300">Monto por pago</p>
                                <p className="font-semibold text-indigo-900 dark:text-indigo-100">${Number(tanda.amount).toFixed(2)}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
                                <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-sm text-indigo-700 dark:text-indigo-300">Frecuencia</p>
                                <p className="font-semibold text-indigo-900 dark:text-indigo-100">{frequencyLabels[tanda.frequency]}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-violet-100 dark:bg-violet-900/20 rounded-lg">
                                <Users className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                            </div>
                            <div>
                                <p className="text-sm text-indigo-700 dark:text-indigo-300">Participantes</p>
                                <p className="font-semibold text-indigo-900 dark:text-indigo-100">{tanda.total_participants}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Estadísticas del participante */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-sm text-emerald-700 dark:text-emerald-300">Pagados</p>
                                <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">{stats.paid_payments}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
                                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <p className="text-sm text-amber-700 dark:text-amber-300">Pendientes</p>
                                <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">{stats.pending_payments}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <p className="text-sm text-red-700 dark:text-red-300">Atrasados</p>
                                <p className="text-2xl font-bold text-red-900 dark:text-red-100">{stats.overdue_payments}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-blue-700 dark:text-blue-300">Total aportado</p>
                                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">${Number(stats.total_contributed).toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quién cobra actualmente - Solo mostrar si la tanda no ha terminado */}
                {(() => {
                    // Verificar si la tanda ya terminó
                    const totalExpectedPayments = tanda.total_participants * tanda.total_participants;
                    const isTandaCompleted = stats.tanda_total_paid_payments >= totalExpectedPayments;
                    
                    // Solo mostrar si hay un cobrador actual Y la tanda no ha terminado
                    if (!currentCollector || isTandaCompleted) {
                        return null;
                    }
                    
                    return (
                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-6 mb-6">
                            <div className="mb-4">
                                <h2 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 flex items-center">
                                    <UserCheck className="w-5 h-5 mr-2 text-emerald-600" />
                                    Quién cobra actualmente
                                </h2>
                            </div>
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <p className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">{currentCollector.name}</p>
                                    <p className="text-emerald-700 dark:text-emerald-300">Posición #{currentCollector.position}</p>
                                    {currentCollector.email && (
                                        <p className="text-sm text-emerald-600 dark:text-emerald-400">{currentCollector.email}</p>
                                    )}
                                    {currentCollector.phone && (
                                        <p className="text-sm text-emerald-600 dark:text-emerald-400">{currentCollector.phone}</p>
                                    )}
                                </div>
                                <div className="text-center md:text-right">
                                    <Badge variant="outline" className="text-lg px-4 py-2 mb-2 border-emerald-600 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20">
                                        ${(Number(tanda.amount) * tanda.total_participants).toFixed(2)}
                                    </Badge>
                                    <p className="text-sm text-emerald-700 dark:text-emerald-300">Total por ronda</p>
                                </div>
                            </div>
                            
                            {/* Información especial si es el participante actual */}
                            {currentCollector.name === participant.name && (
                                <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
                                            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-emerald-800 dark:text-emerald-200">¡Es tu turno de cobrar!</p>
                                            <p className="text-sm text-emerald-700 dark:text-emerald-300">
                                                Tienes derecho a recibir ${(Number(tanda.amount) * tanda.total_participants).toFixed(2)} de todos los participantes.
                                                Puedes decidir si pagar o no, ya que es tu pago.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })()}

                {/* Información de pagos y cobros */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Próximo pago */}
                    {stats.next_payment && (
                        <div className="bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-950/20 dark:to-indigo-950/20 border border-violet-200 dark:border-violet-800 rounded-lg p-6">
                            <div className="mb-4">
                                <h2 className="text-lg font-semibold text-violet-900 dark:text-violet-100">Tu próximo pago</h2>
                            </div>
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <p className="text-lg font-semibold text-violet-900 dark:text-violet-100">
                                        {new Date(stats.next_payment.due_date).toLocaleDateString()}
                                    </p>
                                    <p className="text-violet-700 dark:text-violet-300">Fecha de vencimiento</p>
                                </div>
                                <div className="text-center md:text-right">
                                    <p className="text-2xl font-bold text-violet-900 dark:text-violet-100">${Number(tanda.amount).toFixed(2)}</p>
                                    <Badge className={paymentStatusColors[stats.next_payment.status]}>
                                        {paymentStatusLabels[stats.next_payment.status]}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Cuándo cobras */}
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6">
                        <div className="mb-4">
                            <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-100">Cuándo te toca cobrar</h2>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <p className="text-lg font-semibold text-amber-900 dark:text-amber-100">
                                    Posición #{participant.position}
                                </p>
                                <p className="text-amber-700 dark:text-amber-300">Tu turno en la tanda</p>
                            </div>
                            <div className="text-center md:text-right">
                                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                    ${(Number(tanda.amount) * tanda.total_participants).toFixed(2)}
                                </p>
                                <p className="text-sm text-amber-700 dark:text-amber-300">Recibirás</p>
                            </div>
                        </div>
                        
                        {/* Calcular cuándo le toca cobrar */}
                        {(() => {
                            // Verificar si la tanda ya terminó (todos los participantes completaron sus pagos)
                            const totalExpectedPayments = tanda.total_participants * tanda.total_participants; // N pagos por participante
                            const isTandaCompleted = stats.tanda_total_paid_payments >= totalExpectedPayments;
                            
                            if (isTandaCompleted) {
                                return (
                                    <div className="mt-4 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                                        <p className="text-sm text-emerald-800 dark:text-emerald-200">
                                            <span className="font-semibold">✅ ¡La tanda ha terminado!</span>
                                            <br />
                                            <span className="text-xs">Todos los participantes han completado sus pagos.</span>
                                        </p>
                                    </div>
                                );
                            }
                            
                            // Si la tanda no ha terminado, calcular cuándo le toca cobrar
                            const currentPosition = currentCollector?.position || 1;
                            const myPosition = participant.position;
                            let turnsUntilMyTurn = 0;
                            
                            if (myPosition > currentPosition) {
                                turnsUntilMyTurn = myPosition - currentPosition;
                            } else if (myPosition < currentPosition) {
                                turnsUntilMyTurn = (tanda.total_participants - currentPosition) + myPosition;
                            }
                            
                            return (
                                <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                    <p className="text-sm text-blue-800 dark:text-blue-200">
                                        {turnsUntilMyTurn === 0 ? (
                                            <span className="font-semibold">¡Es tu turno ahora!</span>
                                        ) : (
                                            <>
                                                <span className="font-semibold">Te toca cobrar en {turnsUntilMyTurn} turno{turnsUntilMyTurn > 1 ? 's' : ''}.</span>
                                                <br />
                                                <span className="text-xs">Después de que cobren {turnsUntilMyTurn} participante{turnsUntilMyTurn > 1 ? 's' : ''} más.</span>
                                            </>
                                        )}
                                    </p>
                                </div>
                            );
                        })()}
                    </div>
                </div>

                {/* Historial de pagos */}
                <div className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20 border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-6">
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Historial de pagos</h2>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                            Todos tus pagos en esta tanda
                        </p>
                    </div>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-gray-200 dark:border-gray-700">
                                    <TableHead className="text-gray-700 dark:text-gray-300">Fecha de vencimiento</TableHead>
                                    <TableHead className="text-gray-700 dark:text-gray-300">Estado</TableHead>
                                    <TableHead className="text-gray-700 dark:text-gray-300">Monto</TableHead>
                                    <TableHead className="text-gray-700 dark:text-gray-300">Fecha de pago</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paymentHistory.map((payment) => (
                                    <TableRow key={payment.id} className="border-gray-200 dark:border-gray-700">
                                        <TableCell>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                                    {new Date(payment.due_date).toLocaleDateString()}
                                                </p>
                                                {payment.is_overdue && (
                                                    <p className="text-sm text-red-600 dark:text-red-400">Vencido</p>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={paymentStatusColors[payment.status]}>
                                                {paymentStatusLabels[payment.status]}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-gray-900 dark:text-gray-100">
                                            ${Number(tanda.amount).toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            {payment.paid_at ? (
                                                <span className="text-gray-900 dark:text-gray-100">
                                                    {new Date(payment.paid_at).toLocaleDateString()}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 dark:text-gray-500">-</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Enlace de seguimiento */}
                <div className="bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-950/20 dark:to-indigo-950/20 border border-violet-200 dark:border-violet-800 rounded-lg p-6">
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-violet-900 dark:text-violet-100">Tu enlace de seguimiento</h2>
                        <p className="text-violet-700 dark:text-violet-300 text-sm">
                            Comparte este enlace para acceder a tu seguimiento
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                        <input
                            type="text"
                            value={trackingUrl}
                            readOnly
                            className="flex-1 px-3 py-2 border border-violet-200 dark:border-violet-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:border-violet-500 dark:focus:border-violet-400"
                        />
                        <Button
                            onClick={copyToClipboard}
                            variant="outline"
                            size="sm"
                            className="border-violet-600 text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950/20"
                        >
                            <Copy className="w-4 h-4 mr-2" />
                            {copied ? 'Copiado!' : 'Copiar'}
                        </Button>
                        <Button
                            onClick={() => window.open(trackingUrl, '_blank')}
                            variant="outline"
                            size="sm"
                            className="border-violet-600 text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950/20"
                        >
                            <ExternalLink className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
} 