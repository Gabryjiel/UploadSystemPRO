<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
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
            AnswersSeeder::class,
            FeedbacksSeeder::class,
            FilesSeeder::class,
        ]);
    }
}
