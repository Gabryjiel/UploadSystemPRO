<?php

namespace Database\Seeders;

use App\Models\Feedback;
use Illuminate\Database\Seeder;

class FeedbacksSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        for ($answer = 1; $answer <= 20; $answer++) {
            Feedback::factory(1)->create([
                'answer_id' => $answer,
                'user_id' => 2
            ]);
        }
    }
}
