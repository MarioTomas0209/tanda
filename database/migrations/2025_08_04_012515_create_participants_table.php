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
        Schema::create('participants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tanda_id')->constrained()->onDelete('cascade');
            $table->string('name', 100);
            $table->string('email', 100)->nullable(); // Opcional pero útil para notificaciones
            $table->string('phone', 20)->nullable(); // Opcional si se usarán SMS
            $table->integer('position'); // Orden en el que recibe el pago
            $table->string('token', 64)->unique(); // Para acceso sin cuenta (vía link único)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('participants');
    }
};
