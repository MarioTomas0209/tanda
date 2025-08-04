<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTandaRequest extends FormRequest
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
            'start_date' => 'required|date',
            'status' => 'required|in:active,completed,cancelled',
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
            'status.required' => 'El estado es obligatorio',
            'status.in' => 'El estado debe ser activa, completada o cancelada',
        ];
    }
}
