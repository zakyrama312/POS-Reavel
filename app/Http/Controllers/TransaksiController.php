<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\Produk;
use App\Models\Transaksi;
use App\Models\Produk_stok;
use Illuminate\Http\Request;
use App\Models\Transaksi_item;
use Illuminate\Support\Facades\DB;

class TransaksiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $request->validate([
            'cart' => 'required|array',
            'cart.*.id' => 'required|exists:produk,id',
            'cart.*.price' => 'required|numeric',
            'cart.*.quantity' => 'required|integer|min:1',
            'total' => 'required|numeric',
            'bayar' => 'required|numeric',
            'kembali' => 'required|numeric',
        ]);

        DB::transaction(function () use ($request) {

            $transaksi = Transaksi::create([
                'invoice' => strtoupper(uniqid('TRX')),
                'total_bayar' => $request->total,
                'bayar' => $request->bayar,
                'kembalian' => $request->kembali,
            ]);

            foreach ($request->cart as $item) {
                $produk = Produk::findOrFail($item['id']);

                // Update stok produk
                $produk->stok_akhirSementara -= $item['quantity'];
                $produk->save();

                $totalHarga = $item['price'] * $item['quantity'];
                $laba = $totalHarga * 10 / 100; //  perhitungan laba 10% dari total harga
                $totaluangPenitip = $totalHarga - $laba;
                // Simpan item transaksi
                Transaksi_item::create([
                    'id_transaksi' => $transaksi->id,
                    'id_produk' => $produk->id,
                    'id_penitip' => $produk->id_penitip,
                    'harga' => $item['price'],
                    'jumlah_beli' => $item['quantity'],
                    'laba' => $laba,
                    'total_harga' => $totalHarga,
                    'total_uang_penitip' => $totaluangPenitip,
                ]);

                // Simpan ke produk_stok
                Produk_stok::create([
                    'id_produk' => $produk->id,
                    'id_penitip' => $produk->id_penitip,
                    'stok_masuk' => 0,
                    'stok_akhir' => $produk->stok_akhirSementara,
                ]);
            }
        });

        return back()->with('success', 'Transaksi berhasil ');
    }



    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Transaksi $transaksi)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Transaksi $transaksi)
    {
        //
    }

    public function transaksiHarian()
    {
        $today = Carbon::today();

        $transaksiItems = Transaksi_item::with('produk', 'penitip')
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

        return Inertia::render('transaksi/transaksi-harian', [
            'transaksi_items' => $transaksiItems,
        ]);
    }
    public function transaksiHarianRPL()
    {
        $today = Carbon::today();

        $transaksiItems = Transaksi_item::with('produk', 'penitip')
            ->whereDate('created_at', $today)
            ->where('id_penitip', 2)
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

        return Inertia::render('transaksi/transaksi-harian-rpl', [
            'transaksi_items' => $transaksiItems,
        ]);
    }
}