<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateTandaRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:100',
            'amount' => 'required|numeric|min:0.01|max:999999.99',
            'frequency' => 'required|in:weekly,biweekly,monthly',
            'start_date' => 'required|date|after_or_equal:yesterday',

            'participants' => 'required|array|min:1|max:20',
            'participants.*.name' => 'required|string|max:100',
            'participants.*.phone' => 'nullable|string|max:20',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'El nombre de la tanda es obligatorio',
            'name.max' => 'El nombre no puede tener más de 100 caracteres',
            'amount.required' => 'El monto es obligatorio',
            'amount.numeric' => 'El monto debe ser un número válido',
            'amount.min' => 'El monto debe ser mayor a 0',
            'frequency.required' => 'La frecuencia es obligatoria',
            'frequency.in' => 'La frecuencia debe ser semanal, quincenal o mensual',
            'start_date.required' => 'La fecha de inicio es obligatoria',
            'start_date.date' => 'La fecha de inicio debe ser una fecha válida',
            'start_date.after_or_equal' => 'La fecha de inicio debe ser hoy o una fecha futura',
            'participants.required' => 'Debe agregar al menos 2 participantes',
            'participants.min' => 'Debe agregar al menos 1 participante',
            'participants.max' => 'No puede agregar más de 20 participantes',
            'participants.*.name.required' => 'El nombre del participante es obligatorio',
            'participants.*.email.email' => 'El email del participante debe ser válido',
        ];
    }
}
