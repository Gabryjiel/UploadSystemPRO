<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProfileChangeRequest extends FormRequest
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
            'name' => 'min:2|max:64',
            'oldPassword' => 'string|required_with:password|required_with:passwordConfirm',
            'password' => 'string|required_with:oldPassword|required_with:passwordConfirm|same:passwordConfirm|min:2|max:64',
            'passwordConfirm' => 'string|required_with:password|required_with:oldPassword|same:password|min:2|max:64'
        ];
    }
}
