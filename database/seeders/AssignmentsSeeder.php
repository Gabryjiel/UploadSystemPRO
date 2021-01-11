<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Assignment;

class AssignmentsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        for ($subject = 1; $subject <= 10; $subject++) {
            Assignment::factory(10)->create(['subject_id' => $subject]);
        }
    }
}
