<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;

use \App\Models\User;
use \App\Models\Subject;
use \App\Models\Assignment;

/* 
Plan:
    - users - 13 (3 predifed + 10 factory)
    - subjects - 10
    - assignments - 10 per subject (100)
    -
*/

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            UsersSeeder::class,
            GroupsSeeder::class,
            SubgroupsSeeder::class,
            SemestersSeeder::class,
            SubjectsSeeder::class,
            AssignmentsSeeder::class,
            FilesSeeder::class,
            AnswersSeeder::class,
            FeedbacksSeeder::class
        ]);

        for ($user = 1; $user <= 10; $user++) {
            for ($subject = 1; $subject <= 10; $subject++) {
                DB::table('users_subjects')->insert(['user_id' => $user, 'subject_id' => $subject]);
            }
        }
    }
}
