<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Subject;
use Illuminate\Support\Facades\DB;

class SubjectsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        Subject::factory(10)->create();

        for ($user = 1; $user <= 10; $user++) {
            for ($subject = 1; $subject <= 10; $subject++) {
                DB::table('subject_user')->insert(['user_id' => $user, 'subject_id' => $subject]);
            }
        }
    }
}
