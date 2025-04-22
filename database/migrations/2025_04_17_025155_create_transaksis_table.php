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
            $table->char('invoice', 10);
            $table->foreignId('id_users')->constrained('users')->onDelete('cascade')->onUpdate('cascade');
            $table->decimal('total_bayar', 10, 2);
            $table->integer('diskon')->nullable();
            $table->integer('potongan')->nullable();
            $table->decimal('bayar', 10, 2);
            $table->decimal('kembalian', 10, 2);
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