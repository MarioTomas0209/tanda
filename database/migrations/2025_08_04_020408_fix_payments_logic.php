<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Tanda;
use App\Models\Payment;
use Carbon\Carbon;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Limpiar todos los pagos existentes
        Payment::truncate();
        
        // Regenerar pagos con la lógica corregida
        $tandas = Tanda::with('participants')->get();
        
        foreach ($tandas as $tanda) {
            $totalParticipants = $tanda->participants->count();
            $startDate = Carbon::parse($tanda->start_date);
            
            foreach ($tanda->participants as $participant) {
                // Cada participante debe pagar (total_participantes - 1) veces
                $paymentsPerParticipant = $totalParticipants - 1;
                
                for ($i = 0; $i < $paymentsPerParticipant; $i++) {
                    $dueDate = $this->calculateDueDate($tanda->frequency, $startDate, $i);
                    
                    Payment::create([
                        'participant_id' => $participant->id,
                        'tanda_id' => $tanda->id,
                        'due_date' => $dueDate,
                        'status' => 'pending',
                    ]);
                }
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No hay rollback necesario para esta migración
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
};
