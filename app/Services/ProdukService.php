<?php

namespace App\Services;

use App\Models\Produk;

class ProdukService
{
    public function generateKodeProduk(): string
    {
        $last = Produk::where('kode_produk', 'like', 'BRG-%')
            ->orderBy('kode_produk', 'desc')
            ->first();

        if (!$last) {
            return 'BRG-0001';
        }

        $lastNumber = (int) str_replace('BRG-', '', $last->kode_produk);
        $nextNumber = $lastNumber + 1;

        return 'BRG-' . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
    }
}