<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    protected $fillable = [
        'participant_id',
        'tanda_id',
        'due_date',
        'paid_at',
        'amount_paid',
        'status',
    ];

    protected $casts = [
        'due_date' => 'date',
        'paid_at' => 'datetime',
        'amount_paid' => 'decimal:2',
    ];

    // Relaciones
    public function participant(): BelongsTo
    {
        return $this->belongsTo(Participant::class);
    }

    public function tanda(): BelongsTo
    {
        return $this->belongsTo(Tanda::class);
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopePaid($query)
    {
        return $query->where('status', 'paid');
    }

    public function scopeLate($query)
    {
        return $query->where('status', 'late');
    }

    public function scopeOverdue($query)
    {
        return $query->where('due_date', '<', now()->toDateString())
            ->where('status', 'pending');
    }

    // Métodos
    public function markAsPaid($amount = null)
    {
        $this->update([
            'status' => 'paid',
            'paid_at' => now(),
            'amount_paid' => $amount ?? $this->tanda->amount,
        ]);
    }

    public function markAsLate()
    {
        if ($this->status === 'pending' && $this->due_date < now()->toDateString()) {
            $this->update(['status' => 'late']);
        }
    }

    public function isOverdue(): bool
    {
        return $this->status === 'pending' && $this->due_date < now()->toDateString();
    }

    public function isPaid(): bool
    {
        return $this->status === 'paid';
    }
}
