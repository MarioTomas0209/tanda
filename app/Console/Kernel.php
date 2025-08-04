<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // Enviar recordatorios de pagos diariamente a las 9:00 AM
        $schedule->command('tanda:send-reminders')
            ->dailyAt('09:00')
            ->appendOutputTo(storage_path('logs/payment-reminders.log'));

        // Enviar recordatorios de pagos vencidos diariamente a las 2:00 PM
        $schedule->command('tanda:send-reminders --days-before=0')
            ->dailyAt('14:00')
            ->appendOutputTo(storage_path('logs/payment-overdue.log'));
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
} 