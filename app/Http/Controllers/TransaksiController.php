<?php

namespace App\Http\Controllers;

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
     * Show the form for creating a new resource.
     */
    public function create()
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
            logger('DATA MASUK:', $request->all());

            $transaksi = Transaksi::create([
                'id_users' => 1,
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

                // Simpan item transaksi
                Transaksi_item::create([
                    'id_transaksi' => $transaksi->id,
                    'id_produk' => $produk->id,
                    'harga' => $item['price'],
                    'jumlah' => $item['quantity'],
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
     * Display the specified resource.
     */
    public function show(Transaksi $transaksi)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Transaksi $transaksi)
    {
        //
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
}
