<?php

namespace App\Notifications;

use App\Models\Payment;
use App\Models\Tanda;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PaymentReminderNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $payment;
    public $tanda;

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
        
        return (new MailMessage)
            ->subject("Recordatorio de Pago - Tanda: {$this->tanda->name}")
            ->greeting("Hola {$notifiable->name},")
            ->line("Te recordamos que tienes un pago pendiente en la tanda **{$this->tanda->name}**.")
            ->line("**Detalles del pago:**")
            ->line("• Monto: \${$amount}")
            ->line("• Fecha de vencimiento: {$dueDate}")
            ->line("• Estado: Pendiente")
            ->action('Ver Detalles de la Tanda', url("/tanda/seguimiento/{$notifiable->token}"))
            ->line("Por favor, realiza tu pago antes de la fecha de vencimiento para evitar atrasos.")
            ->line("Si ya realizaste el pago, ignora este mensaje.")
            ->salutation("Saludos,\nEl organizador de la tanda");
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
            'amount' => $this->tanda->amount,
            'due_date' => $this->payment->due_date,
            'message' => "Recordatorio de pago para la tanda {$this->tanda->name}",
        ];
    }
}
