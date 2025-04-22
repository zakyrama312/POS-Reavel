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
        Schema::create('produk', function (Blueprint $table) {
            $table->id();
            $table->string('kode_produk');
            $table->string('nama_produk');
            $table->foreignId('id_penitip')->constrained('penitip')->onDelete('cascade')->onUpdate('cascade');
            $table->foreignId('id_kategori')->constrained('kategori')->onDelete('cascade')->onUpdate('cascade');
            $table->decimal('hpp', 10, 2)->nullable();
            $table->decimal('harga', 10, 2);
            $table->decimal('diskon', 10, 2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('produks');
    }
};