<?php

namespace Database\Factories;

use App\Models\Subgroup;
use Illuminate\Database\Eloquent\Factories\Factory;

class SubgroupFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Subgroup::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->numberBetween(0, 5).' '.$this->faker->randomLetter()
        ];
    }
}
