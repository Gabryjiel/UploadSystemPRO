<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSubjectsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('groups', function (Blueprint $table) {
            $table->id();
            $table->string('name', 32);
            $table->timestamps();
        });

        Schema::create('subgroups', function (Blueprint $table) {
            $table->id();
            $table->string('name', 32);
            $table->timestamps();
        });

        Schema::create('semesters', function (Blueprint $table) {
            $table->id();
            $table->string('name', 32);
            $table->timestamps();
        });

        Schema::create('subjects', function (Blueprint $table) {
            $table->id();
            $table->string('name', 64);
            $table->text('description')->nullable();
            $table->unsignedBigInteger('group_id')->nullable();
            $table->unsignedBigInteger('subgroup_id')->nullable();
            $table->unsignedBigInteger('semester_id')->nullable();
            $table->string('code', 16);
            $table->timestamps();

            $table->foreign('group_id')
                ->references('id')
                ->on('groups')
                ->onDelete('set null');

            $table->foreign('subgroup_id')
                ->references('id')
                ->on('subgroups')
                ->onDelete('set null');

            $table->foreign('semester_id')
                ->references('id')
                ->on('semesters')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('subjects');
        Schema::dropIfExists('groups');
        Schema::dropIfExists('subgroups');
        Schema::dropIfExists('semesters');
    }
}
