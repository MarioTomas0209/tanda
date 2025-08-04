<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('participant_id')->constrained()->onDelete('cascade');
            $table->foreignId('tanda_id')->constrained()->onDelete('cascade');
            $table->date('due_date'); // Fecha en que debe pagar
            $table->datetime('paid_at')->nullable(); // Fecha en que se marcó como pagado
            $table->decimal('amount_paid', 10, 2)->nullable();
            $table->enum('status', ['pending', 'paid', 'late'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
