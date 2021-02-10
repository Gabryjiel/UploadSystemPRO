<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\File;
use Illuminate\Support\Facades\DB;

class FilesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        for ($user = 4; $user <= 10; $user++) {
            File::factory(3)->create([
                'user_id' => $user
            ]);
        }

        for ($assignent = 1; $assignent <= 4; $assignent++) {
            DB::table('files_assignments')
                ->insert([
                    'file_id' => $assignent,
                    'assignment_id' => $assignent
                ]);
        }

        for ($answer = 5; $answer <= 21; $answer++) {
            DB::table('files_answers')
                ->insert([
                    'file_id' => $answer,
                    'answer_id' => $answer
                ]);
        }
    }
}
