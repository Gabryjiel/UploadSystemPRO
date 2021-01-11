<?php

namespace Database\Factories;

use App\Models\Subject;
use Illuminate\Database\Eloquent\Factories\Factory;

use function PHPSTORM_META\map;

class SubjectFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Subject::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $subjects = [
            'Technologie sieci WEB',
            'Programowanie w C++',
            'Programowanie w C',
            'Bazy danych',
            'Grafika komputerowa',
            'Inżynieria oprogramowania',
            'Języki, obliczenia i automaty',
            'Mikronapędy w systemach komputerowych',
            'Wstęp do programowanie',
            'Metody numeryczne'
        ];

        return [
            'name' => $this->faker->unique()->randomElement($subjects),
            'description' => $this->faker->text(100),
            'code' => $this->faker->unique()->regexify('[A-Za-z0-9]{16}')
        ];
    }
}
