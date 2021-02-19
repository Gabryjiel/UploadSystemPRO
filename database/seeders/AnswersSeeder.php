<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Answer;

class AnswersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        for ($user = 4; $user <= 10; $user++) {
            for ($assignment = 1; $assignment <= 100; $assignment++) {
                Answer::factory()->create([
                    'user_id' => $user,
                    'assignment_id' => $assignment,
                ]);
            }
        }
    }
}
