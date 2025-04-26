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
        Schema::create('transaksi', function (Blueprint $table) {
            $table->id();
            $table->char('invoice', 20);
            // $table->foreignId('id_users')->constrained('users')->onDelete('cascade')->onUpdate('cascade');
            $table->integer('total_bayar');
            $table->integer('diskon')->nullable();
            $table->integer('potongan')->nullable();
            $table->integer('bayar');
            $table->integer('kembalian');
            $table->char('bulan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaksis');
    }
};