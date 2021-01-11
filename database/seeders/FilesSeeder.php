<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\File;

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
    }
}
