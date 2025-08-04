<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Payment;
use App\Models\Tanda;

class PaymentOverdueNotification extends Notification
{
    use Queueable;

    protected $payment;
    protected $tanda;

    /**
     * Create a new notification instance.
     */
    public function __construct(Payment $payment, Tanda $tanda)
    {
        $this->payment = $payment;
        $this->tanda = $tanda;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $dueDate = \Carbon\Carbon::parse($this->payment->due_date)->format('d/m/Y');
        $amount = number_format($this->tanda->amount, 2);
        $daysOverdue = \Carbon\Carbon::parse($this->payment->due_date)->diffInDays(now());
        
        return (new MailMessage)
            ->subject("⚠️ PAGO VENCIDO - Tanda: {$this->tanda->name}")
            ->greeting("Hola {$this->payment->participant->name},")
            ->line("**IMPORTANTE:** Tu pago en la tanda **{$this->tanda->name}** está vencido.")
            ->line("**Detalles del pago vencido:**")
            ->line("• Monto: \${$amount}")
            ->line("• Fecha de vencimiento: {$dueDate}")
            ->line("• Días de retraso: {$daysOverdue} días")
            ->line("• Frecuencia: " . $this->getFrequencyLabel($this->tanda->frequency))
            ->action('Ver Detalles de la Tanda', url("/tandas/{$this->tanda->id}"))
            ->line("Por favor, realiza tu pago lo antes posible para evitar inconvenientes.")
            ->line("Si ya realizaste el pago, contacta al organizador para que lo marque como pagado.")
            ->salutation("Saludos,\nEl equipo de Tandas");
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'payment_id' => $this->payment->id,
            'tanda_id' => $this->tanda->id,
            'participant_id' => $this->payment->participant_id,
            'due_date' => $this->payment->due_date,
            'amount' => $this->tanda->amount,
            'type' => 'payment_overdue',
        ];
    }

    private function getFrequencyLabel($frequency)
    {
        return match($frequency) {
            'weekly' => 'Semanal',
            'biweekly' => 'Quincenal',
            'monthly' => 'Mensual',
            default => $frequency,
        };
    }
}
