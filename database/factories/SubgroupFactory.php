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
        $subgroups = [
            'L1',
            'L2',
            'L3',
            'L4',
            'L5',
            'P1',
            'P2',
            'P3',
            'P4',
            'P5'
        ];

        return [
            'name' => $this->faker->unique()->randomElement($subgroups)
        ];
    }
}
