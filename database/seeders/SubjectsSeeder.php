<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Subject;

class SubjectsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        Subject::factory(10)->create();
    }
}
