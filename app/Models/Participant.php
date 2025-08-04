<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Participant extends Model
{
    protected $fillable = [
        'tanda_id',
        'name',
        'email',
        'phone',
        'position',
        'token',
    ];

    protected $casts = [
        'position' => 'integer',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($participant) {
            if (empty($participant->token)) {
                $participant->token = Str::random(64);
            }
        });
    }

    // Relaciones
    public function tanda(): BelongsTo
    {
        return $this->belongsTo(Tanda::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    // Scopes
    public function scopeByPosition($query, $position)
    {
        return $query->where('position', $position);
    }

    public function scopeWithEmail($query)
    {
        return $query->whereNotNull('email');
    }

    public function scopeWithPhone($query)
    {
        return $query->whereNotNull('phone');
    }

    // Métodos
    public function getNextPaymentAttribute()
    {
        return $this->payments()
            ->where('status', 'pending')
            ->orderBy('due_date')
            ->first();
    }

    public function getCompletedPaymentsAttribute()
    {
        return $this->payments()
            ->where('status', 'paid')
            ->count();
    }
}
