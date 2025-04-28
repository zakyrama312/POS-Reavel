<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Transaksi_item;

class PrintController extends Controller
{
    public function printLabel()
    {
        $today = Carbon::today();

        $labels = Transaksi_item::with('produk', 'penitip')
            ->whereDate('created_at', $today)
            ->whereNot('id_penitip', 2)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'nama_produk' => $item->produk->nama_produk ?? '',
                    'harga' => $item->harga,
                    'stok_awal' => $item->produk->stok_masukSementara ?? 0,
                    'sisa' => $item->produk->stok_masukSementara - $item->jumlah_beli ?? 0,
                    'jumlah_terjual' => $item->jumlah_beli ?? 0,
                    'total' => $item->total_harga ?? 0,
                    'laba' => $item->laba ?? 0,
                    'uang_kembali' => $item->total_uang_penitip ?? 0,
                    'nama_penitip' => $item->penitip->nama_penitip ?? '',
                ];
            });

        return Inertia::render('print/print-label', [
            'labels' => $labels,
        ]);
    }
}