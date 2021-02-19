<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SubjectStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array {
        return [
            'name' => 'required|string|max:64',
            'description' => 'required|string',
            'group_id' => 'required',
            'subgroup_id' => 'required',
            'semester_id' => 'required'
        ];
    }
}
