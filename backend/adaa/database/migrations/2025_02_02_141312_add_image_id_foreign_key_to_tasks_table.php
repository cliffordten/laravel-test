<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->unsignedBigInteger('image_id')->nullable()->change();

            $table->foreign('image_id')
                ->references('id')
                ->on('images')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            // Drop the foreign key constraint
            $table->dropForeign(['image_id']);

            // Revert the column back to a string and not nullable
            $table->string('image_id')->nullable(false)->change();
        });
    }
};
