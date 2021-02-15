<?php

namespace Database\Factories;

use App\Models\Group;
use Illuminate\Database\Eloquent\Factories\Factory;

class GroupFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Group::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $groups = [
            '1 EFDI',
            '2 EFDI',
            '3 EFDI'
        ];

        return [
            'name' => $this->faker->unique()->randomElement($groups)
        ];
    }
}
