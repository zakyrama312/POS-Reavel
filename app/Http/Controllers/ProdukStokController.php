<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Produk;
use App\Models\Produk_stok;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProdukStokController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }
    public function reset()
    {
        Produk::query()->update([
            'stok_masukSementara' => 0,
            'stok_akhirSementara' => 0,
        ]);

        return back()->with('success', 'Stok berhasil direset.');
    }

    public function update(Request $request, Produk_stok $produk_stok, $id)
    {
        $request->validate([
            'id' => 'required|exists:produks,id',
            'stok_masuk' => 'nullable|integer|min:0',
            'stok_keluar' => 'nullable|integer|min:0',
        ]);

        $produk = Produk::findOrFail($id);

        $stokMasuk = (int) $request->stok_masuk;
        $stokKeluar = (int) $request->stok_keluar;

        $produk->stok_masukSementara += $stokMasuk;
        $produk->stok_akhirSementara = max(0, $produk->stok_akhirSementara + $stokMasuk - $stokKeluar);
        $produk->save();

        DB::table('produk_stoks')->insert([
            'produk_id' => $produk->id,
            'stok_masuk' => $stokMasuk,
            'stok_keluar' => $stokKeluar,
            'stok_akhir' => $produk->stok_akhirSementara,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return back()->with('success', 'Stok berhasil diperbarui.');
    }

    public function laporanStok()
    {
        $stok = Produk_stok::with(['produk', 'penitip']) // sesuaikan relasi kamu
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'nama_penitip' => $item->penitip->nama_penitip ?? '-',
                    'nama_produk' => $item->produk->nama_produk ?? '-',
                    'stok_awal' => $item->stok_masuk,
                    'sisa' => $item->stok_akhir,
                    'created_at' => $item->created_at->toISOString(),
                ];
            });

        return Inertia::render('laporan/laporan-riwayat-stok', [
            'laporanStok' => $stok,
        ]);

    }
}
