import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Users, Calendar, DollarSign, CheckCircle, Clock, AlertCircle, Copy } from 'lucide-react';

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

interface Participant {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    position: number;
    token: string;
    payments: Payment[];
}

interface Payment {
    id: number;
    due_date: string;
    paid_at: string | null;
    amount_paid: number | null;
    status: 'pending' | 'paid' | 'late';
}

interface Tanda {
    id: number;
    name: string;
    amount: number;
    frequency: 'weekly' | 'biweekly' | 'monthly';
    start_date: string;
    status: 'active' | 'completed' | 'cancelled';
    participants: Participant[];
    payments: Payment[];
}

interface Stats {
    total_participants: number;
    total_payments: number;
    paid_payments: number;
    pending_payments: number;
    late_payments: number;
    next_payment_date: string | null;
}

interface Props {
    tanda: Tanda;
    stats: Stats;
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

const paymentStatusIcons = {
    pending: Clock,
    paid: CheckCircle,
    late: AlertCircle,
};

export default function Show({ tanda, stats }: Props) {
    const { post, processing } = useForm();

    const markAsPaid = (paymentId: number) => {
        post(`/tandas/${tanda.id}/payments/${paymentId}/mark-as-paid`, {
            preserveScroll: true,
            preserveState: true
        });
    };

    const sendReminder = (paymentId: number) => {
        post(`/tandas/${tanda.id}/payments/${paymentId}/send-reminder`, {
            preserveScroll: true,
            preserveState: true
        });
    };

    const sendMassReminders = () => {
        if (confirm('¿Estás seguro de que quieres enviar recordatorios a todos los participantes con pagos pendientes?')) {
            post(`/tandas/${tanda.id}/send-mass-reminders`, {
                preserveScroll: true,
                preserveState: true
            });
        }
    };

    const finalizeTanda = () => {
        if (confirm('¿Estás seguro de que quieres finalizar esta tanda? Esta acción no se puede deshacer.')) {
            post(`/tandas/${tanda.id}/finalize`, {
                preserveScroll: true,
                preserveState: true
            });
        }
    };

    const copyTrackingUrl = async (token: string) => {
        const trackingUrl = `${window.location.origin}/tanda/seguimiento/${token}`;
        try {
            await navigator.clipboard.writeText(trackingUrl);
            // Aquí podrías mostrar una notificación de éxito
            alert('Enlace copiado al portapapeles');
        } catch (err) {
            console.error('Error al copiar:', err);
        }
    };

    // Calcular información de rondas
    const totalAmountPerRound = Number(tanda.amount) * tanda.participants.length;
    
    // Calcular el cobrador actual usando la misma lógica del backend
    const totalPaidPayments = stats.paid_payments;
    const totalParticipants = tanda.participants.length;
    let currentPosition;
    let currentRound;
    
    if (totalPaidPayments === 0) {
        currentPosition = 1; // Si no hay pagos, el primer participante cobra
        currentRound = 1;
    } else {
        // El cobrador cambia después de que TODOS los participantes paguen
        // Cada ronda tiene N pagos (uno por participante)
        const currentRoundNumber = Math.floor(totalPaidPayments / totalParticipants);
        currentPosition = (currentRoundNumber % totalParticipants) + 1;
        
        // Calcular la ronda actual para mostrar
        currentRound = currentRoundNumber + 1;
    }
    
    const nextCollector = tanda.participants.find(p => p.position === currentPosition);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Tanda: ${tanda.name}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center space-x-4">
                    <Button variant="outline" size="sm" onClick={() => window.history.back()}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver
                    </Button>
                    <div className="flex-1">
                        <div className="flex items-center space-x-3">
                            <h1 className="text-2xl font-bold text-gray-900">{tanda.name}</h1>
                            <Badge className={statusColors[tanda.status]}>
                                {statusLabels[tanda.status]}
                            </Badge>
                        </div>
                                                 <p className="text-gray-600">
                             {frequencyLabels[tanda.frequency]} • ${Number(tanda.amount).toFixed(2)} por pago • Ronda {currentRound}
                         </p>
                    </div>
                                         <div className="flex space-x-2">
                         <Link href={`/tandas/${tanda.id}/edit`}>
                             <Button variant="outline">
                                 Editar Tanda
                             </Button>
                         </Link>
                         <Link href={`/tandas/${tanda.id}/duplicate`}>
                             <Button variant="outline">
                                 <Copy className="w-4 h-4 mr-2" />
                                 Duplicar
                             </Button>
                         </Link>
                     </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <Users className="w-5 h-5 text-blue-600" />
                                <div>
                                    <p className="text-sm text-gray-600">Participantes</p>
                                    <p className="text-2xl font-bold">{stats.total_participants}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

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
                                    <p className="text-2xl font-bold">{stats.late_payments}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Acciones del Organizador */}
                {tanda.status === 'active' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Acciones del Organizador</CardTitle>
                            <CardDescription>
                                Gestiona la tanda y comunícate con los participantes
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-3">
                                <Button
                                    onClick={sendMassReminders}
                                    disabled={processing || stats.pending_payments === 0}
                                    variant="outline"
                                >
                                    <Copy className="w-4 h-4 mr-2" />
                                    Enviar Recordatorios Masivos
                                </Button>
                                
                                <Button
                                    onClick={finalizeTanda}
                                    disabled={processing || stats.pending_payments > 0}
                                    variant="outline"
                                    className="text-green-600 border-green-600 hover:bg-green-50"
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Finalizar Tanda
                                </Button>
                                
                                <div className="text-sm text-gray-600 mt-2">
                                    <p>• <strong>Recordatorios:</strong> Envía emails a todos los participantes con pagos pendientes</p>
                                    <p>• <strong>Finalizar:</strong> Marca la tanda como completada (solo disponible cuando todos los pagos estén pagados)</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                                 {/* Información de Ronda */}
                 <Card>
                     <CardContent className="p-4">
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                             <div className="flex items-center space-x-2">
                                 <Calendar className="w-5 h-5 text-blue-600" />
                                                                   <div>
                                      <p className="text-sm text-gray-600">Ronda Actual</p>
                                      <p className="text-lg font-semibold">{currentRound}</p>
                                  </div>
                             </div>
                             <div className="flex items-center space-x-2">
                                 <DollarSign className="w-5 h-5 text-green-600" />
                                 <div>
                                     <p className="text-sm text-gray-600">Total por Ronda</p>
                                     <p className="text-lg font-semibold">${totalAmountPerRound.toLocaleString()}</p>
                                 </div>
                             </div>
                             <div className="flex items-center space-x-2">
                                 <Users className="w-5 h-5 text-purple-600" />
                                 <div>
                                     <p className="text-sm text-gray-600">Próximo Cobrador</p>
                                     <p className="text-lg font-semibold">{nextCollector ? nextCollector.name : 'N/A'}</p>
                                 </div>
                             </div>
                         </div>
                         {stats.next_payment_date && (
                             <div className="mt-4 pt-4 border-t">
                                 <div className="flex items-center space-x-2">
                                     <Calendar className="w-4 h-4 text-orange-600" />
                                     <span className="text-sm text-gray-600">
                                         Próximo pago: {new Date(stats.next_payment_date).toLocaleDateString()}
                                     </span>
                                 </div>
                             </div>
                         )}
                     </CardContent>
                 </Card>

                {/* Participantes y Pagos */}
                <Card>
                    <CardHeader>
                        <CardTitle>Participantes y Pagos</CardTitle>
                        <CardDescription>
                            Estado de pagos de cada participante
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Participante</TableHead>
                                        <TableHead>Posición</TableHead>
                                        <TableHead>Contacto</TableHead>
                                        <TableHead>Pagos Completados</TableHead>
                                        <TableHead>Próximo Pago</TableHead>
                                        <TableHead>Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                                                 <TableBody>
                                                                           {(() => {
                                          // Calcular el progreso de la tanda por rondas
                                          const totalParticipants = tanda.participants.length;
                                          const totalPaidPayments = stats.paid_payments;
                                          const completedRounds = Math.floor(totalPaidPayments / totalParticipants);
                                          const currentRoundProgress = totalPaidPayments % totalParticipants;
                                          
                                          // Separar participantes por estado de rondas
                                          const participantsWithCompletedPayments = tanda.participants.filter(participant => {
                                              const paidPayments = participant.payments.filter(p => p.status === 'paid').length;
                                              const totalPayments = participant.payments.length;
                                              return paidPayments === totalPayments && totalPayments > 0;
                                          });
                                          
                                          // Participantes que ya completaron la ronda actual (tienen más pagos que la ronda actual)
                                          const participantsCompletedCurrentRound = tanda.participants.filter(participant => {
                                              const paidPayments = participant.payments.filter(p => p.status === 'paid').length;
                                              return paidPayments > completedRounds;
                                          });
                                          
                                          // Participantes que están en la ronda actual (tienen exactamente los pagos de la ronda actual)
                                          const participantsInCurrentRound = tanda.participants.filter(participant => {
                                              const paidPayments = participant.payments.filter(p => p.status === 'paid').length;
                                              return paidPayments === completedRounds && paidPayments < participant.payments.length;
                                          });
                                          
                                          // Participantes que están atrasados (tienen menos pagos que la ronda actual)
                                          const participantsBehind = tanda.participants.filter(participant => {
                                              const paidPayments = participant.payments.filter(p => p.status === 'paid').length;
                                              return paidPayments < completedRounds;
                                          });
                                         
                                         return (
                                                                                           <>
                                                  {/* Participantes que ya completaron la ronda actual */}
                                                  {participantsCompletedCurrentRound.length > 0 && (
                                                      <>
                                                          <TableRow className="bg-green-50">
                                                              <TableCell colSpan={6} className="text-center py-3">
                                                                  <div className="flex items-center justify-center space-x-2">
                                                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                                                      <span className="font-medium text-green-800">
                                                                          Ronda {completedRounds + 1} Completada ({participantsCompletedCurrentRound.length})
                                                                      </span>
                                                                  </div>
                                                              </TableCell>
                                                          </TableRow>
                                                          {participantsCompletedCurrentRound.map((participant) => {
                                                              const paidPayments = participant.payments.filter(p => p.status === 'paid').length;
                                                              const totalPayments = participant.payments.length;
                                                              const nextPayment = participant.payments.find(p => p.status === 'pending');
                                                              
                                                              return (
                                                                  <TableRow key={participant.id} className="hover:bg-green-50 opacity-75">
                                                                      <TableCell>
                                                                          <div>
                                                                              <p className="font-medium">{participant.name}</p>
                                                                          </div>
                                                                      </TableCell>
                                                                      <TableCell>
                                                                          <Badge variant="outline">#{participant.position}</Badge>
                                                                      </TableCell>
                                                                      <TableCell>
                                                                          <div className="text-sm text-gray-600">
                                                                              {participant.phone && (
                                                                                  <p>{participant.phone}</p>
                                                                              )}
                                                                              <div className="mt-2">
                                                                                  <Button
                                                                                      size="sm"
                                                                                      variant="ghost"
                                                                                      onClick={() => copyTrackingUrl(participant.token)}
                                                                                      className="text-xs"
                                                                                  >
                                                                                      <Copy className="w-3 h-3 mr-1" />
                                                                                      Copiar enlace
                                                                                  </Button>
                                                                              </div>
                                                                          </div>
                                                                      </TableCell>
                                                                      <TableCell>
                                                                          <div className="flex items-center space-x-2">
                                                                              <span className="text-sm text-green-600 font-medium">
                                                                                  {paidPayments}/{totalPayments} ✅
                                                                              </span>
                                                                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                                                                  <div 
                                                                                      className="bg-green-600 h-2 rounded-full"
                                                                                      style={{ 
                                                                                          width: `${totalPayments > 0 ? (paidPayments / totalPayments) * 100 : 0}%` 
                                                                                      }}
                                                                                  />
                                                                              </div>
                                                                          </div>
                                                                          <div className="text-xs text-gray-500 mt-1">
                                                                              Ronda {completedRounds + 1} completada
                                                                          </div>
                                                                      </TableCell>
                                                                      <TableCell>
                                                                          {nextPayment ? (
                                                                              <div className="flex items-center space-x-2">
                                                                                  <span className="text-sm">
                                                                                      {new Date(nextPayment.due_date).toLocaleDateString()}
                                                                                  </span>
                                                                                  <Badge className={paymentStatusColors[nextPayment.status]}>
                                                                                      {paymentStatusLabels[nextPayment.status]}
                                                                                  </Badge>
                                                                              </div>
                                                                          ) : (
                                                                              <span className="text-sm text-gray-500">Sin pagos pendientes</span>
                                                                          )}
                                                                      </TableCell>
                                                                      <TableCell>
                                                                          <span className="text-sm text-gray-400">Ronda completada</span>
                                                                      </TableCell>
                                                                  </TableRow>
                                                              );
                                                          })}
                                                      </>
                                                  )}
                                                  
                                                  {/* Participantes en la ronda actual */}
                                                  {participantsInCurrentRound.length > 0 && (
                                                      <>
                                                          <TableRow className="bg-blue-50">
                                                              <TableCell colSpan={6} className="text-center py-3">
                                                                  <div className="flex items-center justify-center space-x-2">
                                                                      <Clock className="w-4 h-4 text-blue-600" />
                                                                      <span className="font-medium text-blue-800">
                                                                          Ronda {completedRounds + 1} en Progreso ({participantsInCurrentRound.length})
                                                                      </span>
                                                                  </div>
                                                              </TableCell>
                                                          </TableRow>
                                                          {participantsInCurrentRound.map((participant) => {
                                                              const paidPayments = participant.payments.filter(p => p.status === 'paid').length;
                                                              const totalPayments = participant.payments.length;
                                                              const nextPayment = participant.payments.find(p => p.status === 'pending');
                                                              
                                                              return (
                                                                  <TableRow key={participant.id} className="hover:bg-blue-50">
                                                                      <TableCell>
                                                                          <div>
                                                                              <p className="font-medium">{participant.name}</p>
                                                                          </div>
                                                                      </TableCell>
                                                                      <TableCell>
                                                                          <Badge variant="outline">#{participant.position}</Badge>
                                                                      </TableCell>
                                                                      <TableCell>
                                                                          <div className="text-sm text-gray-600">
                                                                              {participant.phone && (
                                                                                  <p>{participant.phone}</p>
                                                                              )}
                                                                              <div className="mt-2">
                                                                                  <Button
                                                                                      size="sm"
                                                                                      variant="ghost"
                                                                                      onClick={() => copyTrackingUrl(participant.token)}
                                                                                      className="text-xs"
                                                                                  >
                                                                                      <Copy className="w-3 h-3 mr-1" />
                                                                                      Copiar enlace
                                                                                  </Button>
                                                                              </div>
                                                                          </div>
                                                                      </TableCell>
                                                                      <TableCell>
                                                                          <div className="flex items-center space-x-2">
                                                                              <span className="text-sm">
                                                                                  {paidPayments}/{totalPayments}
                                                                              </span>
                                                                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                                                                  <div 
                                                                                      className="bg-blue-600 h-2 rounded-full"
                                                                                      style={{ 
                                                                                          width: `${totalPayments > 0 ? (paidPayments / totalPayments) * 100 : 0}%` 
                                                                                      }}
                                                                                  />
                                                                              </div>
                                                                          </div>
                                                                          <div className="text-xs text-gray-500 mt-1">
                                                                              Ronda {completedRounds + 1} en progreso
                                                                          </div>
                                                                      </TableCell>
                                                                      <TableCell>
                                                                          {nextPayment ? (
                                                                              <div className="flex items-center space-x-2">
                                                                                  <span className="text-sm">
                                                                                      {new Date(nextPayment.due_date).toLocaleDateString()}
                                                                                  </span>
                                                                                  <Badge className={paymentStatusColors[nextPayment.status]}>
                                                                                      {paymentStatusLabels[nextPayment.status]}
                                                                                  </Badge>
                                                                              </div>
                                                                          ) : (
                                                                              <span className="text-sm text-gray-500">Sin pagos</span>
                                                                          )}
                                                                      </TableCell>
                                                                      <TableCell>
                                                                          {nextPayment && nextPayment.status !== 'paid' && (
                                                                              <div className="flex space-x-2">
                                                                                  <Button
                                                                                      size="sm"
                                                                                      onClick={() => markAsPaid(nextPayment.id)}
                                                                                      disabled={processing}
                                                                                  >
                                                                                      Marcar como Pagado
                                                                                  </Button>
                                                                                  {participant.email && (
                                                                                      <Button
                                                                                          size="sm"
                                                                                          variant="outline"
                                                                                          onClick={() => sendReminder(nextPayment.id)}
                                                                                          disabled={processing}
                                                                                      >
                                                                                          Enviar Recordatorio
                                                                                      </Button>
                                                                                  )}
                                                                              </div>
                                                                          )}
                                                                      </TableCell>
                                                                  </TableRow>
                                                              );
                                                          })}
                                                      </>
                                                  )}
                                                  
                                                                                                    {/* Participantes atrasados */}
                                                  {participantsBehind.length > 0 && (
                                                      <>
                                                          <TableRow className="bg-red-50">
                                                              <TableCell colSpan={6} className="text-center py-3">
                                                                  <div className="flex items-center justify-center space-x-2">
                                                                      <AlertCircle className="w-4 h-4 text-red-600" />
                                                                      <span className="font-medium text-red-800">
                                                                          Participantes Atrasados ({participantsBehind.length})
                                                                      </span>
                                                                  </div>
                                                              </TableCell>
                                                          </TableRow>
                                                          {participantsBehind.map((participant) => {
                                                              const paidPayments = participant.payments.filter(p => p.status === 'paid').length;
                                                              const totalPayments = participant.payments.length;
                                                              const nextPayment = participant.payments.find(p => p.status === 'pending');
                                                              
                                                              return (
                                                                  <TableRow key={participant.id} className="hover:bg-red-50">
                                                                      <TableCell>
                                                                          <div>
                                                                              <p className="font-medium">{participant.name}</p>
                                                                          </div>
                                                                      </TableCell>
                                                                      <TableCell>
                                                                          <Badge variant="outline">#{participant.position}</Badge>
                                                                      </TableCell>
                                                                      <TableCell>
                                                                          <div className="text-sm text-gray-600">
                                                                              {participant.phone && (
                                                                                  <p>{participant.phone}</p>
                                                                              )}
                                                                              <div className="mt-2">
                                                                                  <Button
                                                                                      size="sm"
                                                                                      variant="ghost"
                                                                                      onClick={() => copyTrackingUrl(participant.token)}
                                                                                      className="text-xs"
                                                                                  >
                                                                                      <Copy className="w-3 h-3 mr-1" />
                                                                                      Copiar enlace
                                                                                  </Button>
                                                                              </div>
                                                                          </div>
                                                                      </TableCell>
                                                                      <TableCell>
                                                                          <div className="flex items-center space-x-2">
                                                                              <span className="text-sm text-red-600 font-medium">
                                                                                  {paidPayments}/{totalPayments} ⚠️
                                                                              </span>
                                                                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                                                                  <div 
                                                                                      className="bg-red-600 h-2 rounded-full"
                                                                                      style={{ 
                                                                                          width: `${totalPayments > 0 ? (paidPayments / totalPayments) * 100 : 0}%` 
                                                                                      }}
                                                                                  />
                                                                              </div>
                                                                          </div>
                                                                          <div className="text-xs text-red-500 mt-1">
                                                                              Atrasado {completedRounds - paidPayments} rondas
                                                                          </div>
                                                                      </TableCell>
                                                                      <TableCell>
                                                                          {nextPayment ? (
                                                                              <div className="flex items-center space-x-2">
                                                                                  <span className="text-sm">
                                                                                      {new Date(nextPayment.due_date).toLocaleDateString()}
                                                                                  </span>
                                                                                  <Badge className="bg-red-100 text-red-800">
                                                                                      Atrasado
                                                                                  </Badge>
                                                                              </div>
                                                                          ) : (
                                                                              <span className="text-sm text-red-500">Sin pagos</span>
                                                                          )}
                                                                      </TableCell>
                                                                      <TableCell>
                                                                          {nextPayment && nextPayment.status !== 'paid' && (
                                                                              <div className="flex space-x-2">
                                                                                  <Button
                                                                                      size="sm"
                                                                                      onClick={() => markAsPaid(nextPayment.id)}
                                                                                      disabled={processing}
                                                                                  >
                                                                                      Marcar como Pagado
                                                                                  </Button>
                                                                                  {participant.email && (
                                                                                      <Button
                                                                                          size="sm"
                                                                                          variant="outline"
                                                                                          onClick={() => sendReminder(nextPayment.id)}
                                                                                          disabled={processing}
                                                                                      >
                                                                                          Enviar Recordatorio
                                                                                      </Button>
                                                                                  )}
                                                                              </div>
                                                                          )}
                                                                      </TableCell>
                                                                  </TableRow>
                                                              );
                                                          })}
                                                      </>
                                                  )}
                                                  
                                                  {/* Participantes que completaron sus pagos */}
                                                 {participantsWithCompletedPayments.length > 0 && (
                                                     <>
                                                         <TableRow className="bg-green-50">
                                                             <TableCell colSpan={6} className="text-center py-3">
                                                                 <div className="flex items-center justify-center space-x-2">
                                                                     <CheckCircle className="w-4 h-4 text-green-600" />
                                                                     <span className="font-medium text-green-800">
                                                                         Participantes que Completaron sus Pagos ({participantsWithCompletedPayments.length})
                                                                     </span>
                                                                 </div>
                                                             </TableCell>
                                                         </TableRow>
                                                         {participantsWithCompletedPayments.map((participant) => {
                                                             const paidPayments = participant.payments.filter(p => p.status === 'paid').length;
                                                             const totalPayments = participant.payments.length;
                                                             
                                                             return (
                                                                 <TableRow key={participant.id} className="hover:bg-green-50 opacity-75">
                                                                     <TableCell>
                                                                         <div>
                                                                             <p className="font-medium">{participant.name}</p>
                                                                         </div>
                                                                     </TableCell>
                                                                     <TableCell>
                                                                         <Badge variant="outline">#{participant.position}</Badge>
                                                                     </TableCell>
                                                                     <TableCell>
                                                                         <div className="text-sm text-gray-600">
                                                                             {participant.phone && (
                                                                                 <p>{participant.phone}</p>
                                                                             )}
                                                                             <div className="mt-2">
                                                                                 <Button
                                                                                     size="sm"
                                                                                     variant="ghost"
                                                                                     onClick={() => copyTrackingUrl(participant.token)}
                                                                                     className="text-xs"
                                                                                 >
                                                                                     <Copy className="w-3 h-3 mr-1" />
                                                                                     Copiar enlace
                                                                                 </Button>
                                                                             </div>
                                                                         </div>
                                                                     </TableCell>
                                                                     <TableCell>
                                                                         <div className="flex items-center space-x-2">
                                                                             <span className="text-sm text-green-600 font-medium">
                                                                                 {paidPayments}/{totalPayments} ✅
                                                                             </span>
                                                                             <div className="w-16 bg-gray-200 rounded-full h-2">
                                                                                 <div 
                                                                                     className="bg-green-600 h-2 rounded-full"
                                                                                     style={{ width: '100%' }}
                                                                                 />
                                                                             </div>
                                                                         </div>
                                                                         <div className="text-xs text-gray-500 mt-1">
                                                                             Recibió: ${(Number(tanda.amount) * tanda.participants.length).toLocaleString()} por ronda
                                                                         </div>
                                                                     </TableCell>
                                                                     <TableCell>
                                                                         <Badge className="bg-green-100 text-green-800">
                                                                             Completado
                                                                         </Badge>
                                                                     </TableCell>
                                                                     <TableCell>
                                                                         <span className="text-sm text-gray-400">Sin acciones disponibles</span>
                                                                     </TableCell>
                                                                 </TableRow>
                                                             );
                                                         })}
                                                     </>
                                                 )}
                                                 
                                                 
                                             </>
                                         );
                                     })()}
                                 </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
} 