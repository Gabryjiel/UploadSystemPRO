<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFilesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('files', function(Blueprint $table) {
            $table->id();
            $table->string('name', 255);
            $table->unsignedInteger('size');
            $table->unsignedBigInteger('user_id');
            $table->timestamps();

            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');
        });

        Schema::create('files_assignments', function(Blueprint $table) {
            $table->unsignedBigInteger('file_id');
            $table->unsignedBigInteger('assignment_id');

            $table->foreign('file_id')
                ->references('id')
                ->on('files')
                ->onDelete('cascade');
            
            $table->foreign('assignment_id')
                ->references('id')
                ->on('assignments')
                ->onDelete('cascade');
        });

        Schema::create('files_answers', function(Blueprint $table) {
            $table->unsignedBigInteger('file_id');
            $table->unsignedBigInteger('answer_id');

            $table->foreign('file_id')
                ->references('id')
                ->on('files')
                ->onDelete('cascade');
            
            $table->foreign('answer_id')
                ->references('id')
                ->on('answers')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('files_answers');
        Schema::dropIfExists('files_assignments');
        Schema::dropIfExists('files');
    }
}
