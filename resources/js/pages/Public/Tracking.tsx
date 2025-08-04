import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
    UserCheck
} from 'lucide-react';
import { useState } from 'react';

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
    active: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
};

const paymentStatusLabels = {
    pending: 'Pendiente',
    paid: 'Pagado',
    late: 'Atrasado',
};

const paymentStatusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    late: 'bg-red-100 text-red-800',
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
        <div className="min-h-screen bg-gray-50">
            <Head title={`Seguimiento - ${tanda.name}`} />

            <div className="max-w-4xl mx-auto py-8 px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{tanda.name}</h1>
                    <p className="text-gray-600">
                        Panel de seguimiento para {participant.name}
                    </p>
                    <div className="mt-4">
                        <Badge className={statusColors[tanda.status]}>
                            {statusLabels[tanda.status]}
                        </Badge>
                    </div>
                </div>

                {/* Información de la tanda */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Información de la Tanda</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center space-x-2">
                                <DollarSign className="w-5 h-5 text-green-600" />
                                <div>
                                    <p className="text-sm text-gray-600">Monto por pago</p>
                                    <p className="font-semibold">${Number(tanda.amount).toFixed(2)}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Calendar className="w-5 h-5 text-blue-600" />
                                <div>
                                    <p className="text-sm text-gray-600">Frecuencia</p>
                                    <p className="font-semibold">{frequencyLabels[tanda.frequency]}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Users className="w-5 h-5 text-purple-600" />
                                <div>
                                    <p className="text-sm text-gray-600">Participantes</p>
                                    <p className="font-semibold">{tanda.total_participants}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Estadísticas del participante */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <div>
                                    <p className="text-sm text-gray-600">Pagados</p>
                                    <p className="text-2xl font-bold">{stats.paid_payments}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <Clock className="w-5 h-5 text-yellow-600" />
                                <div>
                                    <p className="text-sm text-gray-600">Pendientes</p>
                                    <p className="text-2xl font-bold">{stats.pending_payments}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <AlertCircle className="w-5 h-5 text-red-600" />
                                <div>
                                    <p className="text-sm text-gray-600">Atrasados</p>
                                    <p className="text-2xl font-bold">{stats.overdue_payments}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <TrendingUp className="w-5 h-5 text-blue-600" />
                                <div>
                                    <p className="text-sm text-gray-600">Total aportado</p>
                                    <p className="text-2xl font-bold">${Number(stats.total_contributed).toFixed(2)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
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
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <UserCheck className="w-5 h-5 text-green-600" />
                                    <span>Quién cobra actualmente</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-lg font-semibold">{currentCollector.name}</p>
                                        <p className="text-gray-600">Posición #{currentCollector.position}</p>
                                        {currentCollector.email && (
                                            <p className="text-sm text-gray-500">{currentCollector.email}</p>
                                        )}
                                        {currentCollector.phone && (
                                            <p className="text-sm text-gray-500">{currentCollector.phone}</p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <Badge variant="outline" className="text-lg px-4 py-2 mb-2">
                                            ${(Number(tanda.amount) * tanda.total_participants).toFixed(2)}
                                        </Badge>
                                        <p className="text-sm text-gray-600">Total por ronda</p>
                                    </div>
                                </div>
                                
                                {/* Información especial si es el participante actual */}
                                {currentCollector.name === participant.name && (
                                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                                        <div className="flex items-center space-x-2">
                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                            <div>
                                                <p className="font-semibold text-green-800">¡Es tu turno de cobrar!</p>
                                                <p className="text-sm text-green-700">
                                                    Tienes derecho a recibir ${(Number(tanda.amount) * tanda.total_participants).toFixed(2)} de todos los participantes.
                                                    Puedes decidir si pagar o no, ya que es tu pago.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })()}

                {/* Información de pagos y cobros */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Próximo pago */}
                    {stats.next_payment && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Tu próximo pago</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-lg font-semibold">
                                            {new Date(stats.next_payment.due_date).toLocaleDateString()}
                                        </p>
                                        <p className="text-gray-600">Fecha de vencimiento</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold">${Number(tanda.amount).toFixed(2)}</p>
                                        <Badge className={paymentStatusColors[stats.next_payment.status]}>
                                            {paymentStatusLabels[stats.next_payment.status]}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Cuándo cobras */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Cuándo te toca cobrar</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-lg font-semibold">
                                        Posición #{participant.position}
                                    </p>
                                    <p className="text-gray-600">Tu turno en la tanda</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-green-600">
                                        ${(Number(tanda.amount) * tanda.total_participants).toFixed(2)}
                                    </p>
                                    <p className="text-sm text-gray-600">Recibirás</p>
                                </div>
                            </div>
                            
                            {/* Calcular cuándo le toca cobrar */}
                            {(() => {
                                // Verificar si la tanda ya terminó (todos los participantes completaron sus pagos)
                                const totalExpectedPayments = tanda.total_participants * tanda.total_participants; // N pagos por participante
                                const isTandaCompleted = stats.tanda_total_paid_payments >= totalExpectedPayments;
                                
                                if (isTandaCompleted) {
                                    return (
                                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                            <p className="text-sm text-green-800">
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
                                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        <p className="text-sm text-blue-800">
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
                        </CardContent>
                    </Card>
                </div>

                {/* Historial de pagos */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Historial de pagos</CardTitle>
                        <CardDescription>
                            Todos tus pagos en esta tanda
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Fecha de vencimiento</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead>Monto</TableHead>
                                        <TableHead>Fecha de pago</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paymentHistory.map((payment) => (
                                        <TableRow key={payment.id}>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">
                                                        {new Date(payment.due_date).toLocaleDateString()}
                                                    </p>
                                                    {payment.is_overdue && (
                                                        <p className="text-sm text-red-600">Vencido</p>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={paymentStatusColors[payment.status]}>
                                                    {paymentStatusLabels[payment.status]}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                ${Number(tanda.amount).toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                                {payment.paid_at ? (
                                                    new Date(payment.paid_at).toLocaleDateString()
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Enlace de seguimiento */}
                <Card>
                    <CardHeader>
                        <CardTitle>Tu enlace de seguimiento</CardTitle>
                        <CardDescription>
                            Comparte este enlace para acceder a tu seguimiento
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={trackingUrl}
                                readOnly
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                            />
                            <Button
                                onClick={copyToClipboard}
                                variant="outline"
                                size="sm"
                            >
                                <Copy className="w-4 h-4 mr-2" />
                                {copied ? 'Copiado!' : 'Copiar'}
                            </Button>
                            <Button
                                onClick={() => window.open(trackingUrl, '_blank')}
                                variant="outline"
                                size="sm"
                            >
                                <ExternalLink className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 