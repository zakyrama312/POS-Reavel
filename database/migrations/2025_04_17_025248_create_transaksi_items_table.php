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
        Schema::create('transaksi_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_transaksi')->constrained('transaksi')->onDelete('cascade')->onUpdate('cascade');
            $table->foreignId('id_produk')->constrained('produk')->onDelete('cascade')->onUpdate('cascade');
            $table->foreignId('id_penitip')->constrained('penitip')->onDelete('cascade')->onUpdate('cascade');
            $table->integer('jumlah_beli');
            $table->integer('harga');
            $table->integer('laba');
            $table->integer('total_harga');
            $table->integer('total_uang_penitip');
            $table->integer('diskon')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaksi_items');
    }
};