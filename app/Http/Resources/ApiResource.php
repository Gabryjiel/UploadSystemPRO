<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ApiResource extends JsonResource
{
    /**
     * Check if resource should be collection
     * @param string $path
     * @return bool
     */
    public function isCollection(string $path): bool {
        return !is_numeric(explode('/', strrev($path))[0]);
    }
}
