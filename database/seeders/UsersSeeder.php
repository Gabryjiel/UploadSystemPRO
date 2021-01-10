<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $users = [
            [
                'name' => 'admin',
                'password' => bcrypt('admin'),
                'email' => 'admin@prz.pl',
                'role' => 0
            ],
            [
                'name' => 'teacher',
                'password' => bcrypt('teacher'),
                'email' => 'teacher@prz.pl',
                'role' => 1
            ],
            [
                'name' => 'student',
                'password' => bcrypt('student'),
                'email' => 'student@stud.prz.pl',
                'role' => 2
            ]
        ];
        
        foreach ($users as $user) {
            User::create($user);
        }
        
        User::factory(10)->create();
        
    }
}
