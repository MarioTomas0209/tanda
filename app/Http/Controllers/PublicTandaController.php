<?php

namespace App\Http\Controllers;

use App\Models\Participant;
use App\Models\Tanda;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicTandaController extends Controller
{
    public function tracking($token)
    {
        $participant = Participant::with(['tanda.participants', 'payments'])
            ->where('token', $token)
            ->first();

        if (!$participant) {
            return Inertia::render('Public/NotFound', [
                'message' => 'Enlace no válido o expirado'
            ]);
        }

        $tanda = $participant->tanda;
        
        // Obtener estadísticas del participante
        $participantStats = [
            'total_payments' => $participant->payments->count(),
            'paid_payments' => $participant->payments->where('status', 'paid')->count(),
            'pending_payments' => $participant->payments->where('status', 'pending')->count(),
            'overdue_payments' => $participant->payments->where('status', 'late')->count(),
            'next_payment' => $participant->payments->where('status', 'pending')->sortBy('due_date')->first(),
            'total_contributed' => $participant->payments->where('status', 'paid')->sum('amount_paid'),
            // Agregar estadísticas de toda la tanda para verificar si terminó
            'tanda_total_paid_payments' => $tanda->payments()->where('status', 'paid')->count(),
        ];

        // Obtener información de quién cobra actualmente
        $currentCollector = $this->getCurrentCollector($tanda);
        
        // Obtener historial de pagos del participante
        $paymentHistory = $participant->payments()
            ->orderBy('due_date', 'desc')
            ->get()
            ->map(function ($payment) {
                return [
                    'id' => $payment->id,
                    'due_date' => $payment->due_date,
                    'paid_at' => $payment->paid_at,
                    'amount_paid' => $payment->amount_paid,
                    'status' => $payment->status,
                    'is_overdue' => $payment->isOverdue(),
                ];
            });

        return Inertia::render('Public/Tracking', [
            'participant' => [
                'id' => $participant->id,
                'name' => $participant->name,
                'email' => $participant->email,
                'phone' => $participant->phone,
                'position' => $participant->position,
                'token' => $participant->token,
            ],
            'tanda' => [
                'id' => $tanda->id,
                'name' => $tanda->name,
                'amount' => $tanda->amount,
                'frequency' => $tanda->frequency,
                'start_date' => $tanda->start_date,
                'status' => $tanda->status,
                'total_participants' => $tanda->participants->count(),
            ],
            'stats' => $participantStats,
            'currentCollector' => $currentCollector,
            'paymentHistory' => $paymentHistory,
            'trackingUrl' => url("/tanda/seguimiento/{$token}"),
        ]);
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

        return $collector ? [
            'name' => $collector->name,
            'position' => $collector->position,
            'email' => $collector->email,
            'phone' => $collector->phone,
        ] : null;
    }
}
