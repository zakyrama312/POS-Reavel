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
        Schema::create('produk_stoks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_produk')->constrained('produk')->onDelete('cascade')->onUpdate('cascade');
            $table->foreignId('id_penitip')->constrained('penitip')->onDelete('cascade')->onUpdate('cascade');
            $table->enum('status', ['masuk', 'keluar'])->default('masuk');
            $table->integer('jumlah');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('produk_stoks');
    }
};
