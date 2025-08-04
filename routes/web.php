<?php

use App\Http\Controllers\PublicTandaController;
use App\Http\Controllers\TandaController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Rutas públicas para participantes
Route::get('/tanda/seguimiento/{token}', [PublicTandaController::class, 'tracking'])
    ->name('public.tracking');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Rutas específicas que deben ir antes que las rutas con parámetros
    Route::get('tandas/historial', [TandaController::class, 'history'])
        ->name('tandas.history');

    // Rutas de Tandas
    Route::resource('tandas', TandaController::class);

    // Rutas con parámetros
    Route::post('tandas/{tanda}/payments/{payment}/mark-as-paid', [TandaController::class, 'markPaymentAsPaid'])
        ->name('tandas.payments.mark-as-paid');
    Route::post('tandas/{tanda}/payments/{payment}/send-reminder', [TandaController::class, 'sendReminder'])
        ->name('tandas.payments.send-reminder');
    Route::post('tandas/{tanda}/mark-all-paid', [TandaController::class, 'markAllAsPaid'])
        ->name('tandas.mark-all-paid');
    Route::post('tandas/{tanda}/send-mass-reminders', [TandaController::class, 'sendMassReminders'])
        ->name('tandas.send-mass-reminders');
    Route::post('tandas/{tanda}/finalize', [TandaController::class, 'finalizeTanda'])
        ->name('tandas.finalize');
    Route::get('tandas/{tanda}/duplicate', [TandaController::class, 'duplicate'])
        ->name('tandas.duplicate');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
