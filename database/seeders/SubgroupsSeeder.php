<?php

namespace Database\Seeders;

use App\Models\Subgroup;
use Illuminate\Database\Seeder;

class SubgroupsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Subgroup::factory(10)->create();
    }
}
