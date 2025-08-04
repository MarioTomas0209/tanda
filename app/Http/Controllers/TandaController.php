<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateTandaRequest;
use App\Http\Requests\UpdateTandaRequest;
use App\Models\Tanda;
use App\Models\Participant;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class TandaController extends Controller
{
    public function index()
    {
        $tandas = Auth::user()->tandas()
            ->with(['participants', 'payments'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($tanda) {
                return [
                    'id' => $tanda->id,
                    'name' => $tanda->name,
                    'amount' => $tanda->amount,
                    'frequency' => $tanda->frequency,
                    'start_date' => $tanda->start_date,
                    'status' => $tanda->status,
                    'participants_count' => $tanda->participants->count(),
                    'payments_count' => $tanda->payments->count(),
                    'paid_payments_count' => $tanda->payments->where('status', 'paid')->count(),
                    'created_at' => $tanda->created_at,
                ];
            });

        return Inertia::render('Tanda/Index', [
            'tandas' => $tandas,
        ]);
    }

    public function create()
    {
        return Inertia::render('Tanda/Create');
    }

    public function store(CreateTandaRequest $request)
    {
        DB::transaction(function () use ($request) {
            // Crear la tanda
            $tanda = Tanda::create([
                'user_id' => Auth::id(),
                'name' => $request->name,
                'amount' => $request->amount,
                'frequency' => $request->frequency,
                'start_date' => $request->start_date,
                'status' => 'active',
            ]);

            // Crear participantes
            foreach ($request->participants as $index => $participantData) {
                $participant = $tanda->participants()->create([
                    'name' => $participantData['name'],
                    'phone' => $participantData['phone'] ?? null,
                    'position' => $index + 1,
                ]);
            }

            // Crear pagos para todos los participantes después de que todos estén creados
            foreach ($tanda->participants as $participant) {
                $this->createPaymentsForParticipant($tanda, $participant);
            }
        });

        $tanda = Tanda::latest()->first();

        return redirect()->route('tandas.show', $tanda->id)
            ->with('success', 'Tanda creada exitosamente');
    }

    public function show(Tanda $tanda)
    {
        // Verificar que el usuario sea el organizador
        if ($tanda->user_id !== Auth::id()) {
            abort(403);
        }

        $tanda->load([
            'participants.payments' => function ($query) use ($tanda) {
                $query->where('tanda_id', $tanda->id);
            },
            'payments.participant'
        ]);

        // Calcular estadísticas
        $stats = [
            'total_participants' => $tanda->participants->count(),
            'total_payments' => $tanda->payments->count(),
            'paid_payments' => $tanda->payments->where('status', 'paid')->count(),
            'pending_payments' => $tanda->payments->where('status', 'pending')->count(),
            'late_payments' => $tanda->payments->where('status', 'late')->count(),
            'next_payment_date' => $this->getNextPaymentDate($tanda),
        ];

        return Inertia::render('Tanda/Show', [
            'tanda' => $tanda,
            'stats' => $stats,
        ]);
    }

    public function edit(Tanda $tanda)
    {
        // Verificar que el usuario sea el organizador
        if ($tanda->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('Tanda/Edit', [
            'tanda' => $tanda,
        ]);
    }

    public function update(UpdateTandaRequest $request, Tanda $tanda)
    {
        // Verificar que el usuario sea el organizador
        if ($tanda->user_id !== Auth::id()) {
            abort(403);
        }

        $tanda->update([
            'name' => $request->name,
            'amount' => $request->amount,
            'frequency' => $request->frequency,
            'start_date' => $request->start_date,
            'status' => $request->status,
        ]);

        return redirect()->route('tandas.show', $tanda)
            ->with('success', 'Tanda actualizada exitosamente');
    }

    public function markPaymentAsPaid(Request $request, Tanda $tanda, Payment $payment)
    {
        // Verificar que el usuario sea el organizador
        if ($tanda->user_id !== Auth::id()) {
            abort(403);
        }

        $payment->markAsPaid($request->amount_paid);

        return back()->with('success', 'Pago marcado como realizado');
    }

    public function markAllAsPaid(Request $request, Tanda $tanda)
    {
        // Verificar que el usuario sea el organizador
        if ($tanda->user_id !== Auth::id()) {
            abort(403);
        }

        $pendingPayments = $tanda->payments()->where('status', 'pending')->get();
        
        foreach ($pendingPayments as $payment) {
            $payment->markAsPaid($tanda->amount);
        }

        return back()->with('success', 'Todos los pagos marcados como realizados');
    }

    private function createPaymentsForParticipant($tanda, $participant)
    {
        $startDate = Carbon::parse($tanda->start_date);
        $totalParticipants = $tanda->participants->count();

        // Generar pagos automáticamente basados en la frecuencia
        // Ejemplo: 10 semanas si hay 10 participantes y es semanal
        $paymentsPerParticipant = $totalParticipants;

        for ($i = 0; $i < $paymentsPerParticipant; $i++) {
            // Calcular la fecha de vencimiento basada en la frecuencia
            $dueDate = $this->calculateDueDate($tanda->frequency, $startDate, $i);
            
            Payment::create([
                'participant_id' => $participant->id,
                'tanda_id' => $tanda->id,
                'due_date' => $dueDate,
                'status' => 'pending',
            ]);
        }
    }

    private function calculateDueDate($frequency, $startDate, $paymentNumber)
    {
        $date = $startDate->copy();
        
        switch ($frequency) {
            case 'weekly':
                return $date->addWeeks($paymentNumber);
            case 'biweekly':
                return $date->addWeeks($paymentNumber * 2);
            case 'monthly':
                return $date->addMonths($paymentNumber);
            default:
                return $date->addWeeks($paymentNumber);
        }
    }

    private function getNextPaymentDate($tanda)
    {
        $nextPayment = $tanda->payments()
            ->where('status', 'pending')
            ->orderBy('due_date')
            ->first();

        return $nextPayment ? $nextPayment->due_date : null;
    }

    private function getCurrentCollector($tanda)
    {
        $totalParticipants = $tanda->participants->count();
        $totalPaidPayments = $tanda->payments()->where('status', 'paid')->count();
        
        // Si no hay pagos realizados, el primer participante cobra
        if ($totalPaidPayments === 0) {
            $collector = $tanda->participants()
                ->where('position', 1)
                ->first();
        } else {
            // El cobrador cambia después de que TODOS los participantes paguen
            // Cada ronda tiene N pagos (uno por participante)
            $currentRound = floor($totalPaidPayments / $totalParticipants);
            $currentPosition = ($currentRound % $totalParticipants) + 1;
            
            $collector = $tanda->participants()
                ->where('position', $currentPosition)
                ->first();
        }

        return $collector;
    }

    public function sendReminder(Request $request, Tanda $tanda, Payment $payment)
    {
        // Verificar que el usuario sea el organizador
        if ($tanda->user_id !== Auth::id()) {
            abort(403);
        }

        // Verificar que el participante tenga email
        if (!$payment->participant->email) {
            return back()->with('error', 'El participante no tiene email configurado');
        }

        // Enviar recordatorio
        $payment->participant->notify(new \App\Notifications\PaymentReminderNotification($payment, $tanda));

        return back()->with('success', 'Recordatorio enviado exitosamente');
    }

    public function sendMassReminders(Request $request, Tanda $tanda)
    {
        // Verificar que el usuario sea el organizador
        if ($tanda->user_id !== Auth::id()) {
            abort(403);
        }

        $pendingPayments = $tanda->payments()
            ->where('status', 'pending')
            ->with('participant')
            ->get();

        $sentCount = 0;
        foreach ($pendingPayments as $payment) {
            if ($payment->participant->email) {
                $payment->participant->notify(new \App\Notifications\PaymentReminderNotification($payment, $tanda));
                $sentCount++;
            }
        }

        return back()->with('success', "Se enviaron {$sentCount} recordatorios");
    }

    public function finalizeTanda(Request $request, Tanda $tanda)
    {
        // Verificar que el usuario sea el organizador
        if ($tanda->user_id !== Auth::id()) {
            abort(403);
        }

        // Verificar que todos los pagos estén completados
        $totalExpectedPayments = $tanda->participants->count() * $tanda->participants->count();
        $totalPaidPayments = $tanda->payments()->where('status', 'paid')->count();

        if ($totalPaidPayments < $totalExpectedPayments) {
            return back()->with('error', 'No se puede finalizar la tanda. Faltan pagos por completar.');
        }

        // Finalizar la tanda
        $tanda->update([
            'status' => 'completed',
            'completed_at' => now(),
        ]);

        return back()->with('success', 'Tanda finalizada exitosamente');
    }

    public function history()
    {
        $tandas = Auth::user()->tandas()
            ->with(['participants', 'payments'])
            ->get()
            ->map(function ($tanda) {
                return [
                    'id' => $tanda->id,
                    'name' => $tanda->name,
                    'amount' => $tanda->amount,
                    'frequency' => $tanda->frequency,
                    'start_date' => $tanda->start_date,
                    'status' => $tanda->status,
                    'created_at' => $tanda->created_at,
                    'completed_at' => $tanda->completed_at,
                    'participants' => $tanda->participants->map(function ($participant) {
                        return [
                            'id' => $participant->id,
                            'name' => $participant->name,
                            'position' => $participant->position,
                        ];
                    }),
                    'total_participants' => $tanda->participants->count(),
                    'total_payments' => $tanda->payments->count(),
                    'paid_payments' => $tanda->payments->where('status', 'paid')->count(),
                ];
            });

        return Inertia::render('Tanda/History', [
            'tandas' => $tandas,
        ]);
    }

    public function duplicate(Tanda $tanda)
    {
        if ($tanda->user_id !== Auth::id()) { abort(403); }

        $originalTanda = [
            'id' => $tanda->id,
            'name' => $tanda->name,
            'amount' => $tanda->amount,
            'frequency' => $tanda->frequency,
            'start_date' => $tanda->start_date,
            'participants' => $tanda->participants->map(function ($participant) {
                return [
                    'name' => $participant->name,
                    'email' => $participant->email,
                    'phone' => $participant->phone,
                ];
            }),
        ];

        return Inertia::render('Tanda/Duplicate', [
            'originalTanda' => $originalTanda,
        ]);
    }
}
