<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Produk;
use App\Models\Penitip;
use App\Models\Kategori;
use App\Models\Produk_stok;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class ProdukController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $produk = Produk::with(['kategori', 'penitip'])->get();
        $penitips = Penitip::select('id', 'nama_penitip')->get();
        $kategoris = Kategori::select('id', 'nama_kategori')->get();

        return Inertia::render('produk/index', [
            'produk' => $produk,
            'penitips' => $penitips,
            'kategoris' => $kategoris,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate(rules: [
            'id_penitip' => 'required|exists:penitip,id',
            'id_kategori' => 'required|exists:kategori,id',
            'nama_produk' => 'required|string|max:255',
            'harga' => 'required|numeric',
            'stok_masuk' => 'required|integer',
        ]);
        $produk = Produk::create([
            'id_penitip' => $request->id_penitip,
            'id_kategori' => $request->id_kategori,
            'nama_produk' => $request->nama_produk,
            'harga' => $request->harga,
            'stok_masukSementara' => $request->stok_masuk,
            'stok_akhirSementara' => $request->stok_masuk,
        ]);

        Produk_stok::create([
            'id_produk' => $produk->id,
            'id_penitip' => $request->id_penitip,
            'stok_masuk' => $request->stok_masuk,
            'stok_akhir' => $request->stok_masuk,
        ]);

        return redirect()->back()->with('success', "Produk {$produk->nama_produk} berhasil ditambahkan");

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Produk $produk, $id)
    {
        $request->validate([
            'id_penitip' => 'required|exists:penitip,id',
            'id_kategori' => 'required|exists:kategori,id',
            'nama_produk' => 'required|string|max:255',
            'harga' => 'required|numeric',
            'stok_masuk' => 'required|integer',
        ]);

        $produk = Produk::findOrFail($id);

        // 1. Ambil entry produk_stoks terbaru
        $lastStok = Produk_stok::where('id_produk', $produk->id)
            ->latest('created_at')   // atau orderBy('id','desc')
            ->first();

        if (!$lastStok) {
            return back()->withErrors(['stok_masuk' => 'Data stok awal belum ada.']);
        }

        // 2. Hitung selisih stok
        $oldMasuk = $lastStok->stok_masuk;
        $newMasuk = $request->stok_masuk;
        $diff = $newMasuk - $oldMasuk;
        $newAkhir = $lastStok->stok_akhir + $diff;

        // 3. Update produk utama
        $produk->update([
            'id_penitip' => $request->id_penitip,
            'id_kategori' => $request->id_kategori,
            'nama_produk' => $request->nama_produk,
            'harga' => $request->harga,
            'stok_masukSementara' => $newMasuk,
            'stok_akhirSementara' => $newAkhir,
        ]);

        // 4. Update record produk_stoks terakhir
        $lastStok->update([
            'stok_masuk' => $newMasuk,
            'stok_akhir' => $newAkhir,
        ]);

        return redirect()->route('produk.index')
            ->with('success', "Stok produk {$produk->nama_produk} berhasil diperbarui");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Produk $produk, $id)
    {
        $produk = Produk::findOrFail($id);

        // Option A: Soft delete
        // $produk->delete();

        // Option B: Hard delete (juga akan cascade ke produk_stoks jika migration onDelete cascade)
        $produk->forceDelete();

        return redirect()->route('produk.index')
            ->with('success', "Produk {$produk->nama_produk} berhasil dihapus");

    }

    public function produkList()
    {
        $produk = Produk::with(['kategori', 'penitip'])
            ->orderBy('stok_akhirSementara', 'desc')
            ->get();
        $penitips = Penitip::select('id', 'nama_penitip')->get();
        $kategoris = Kategori::select('id', 'nama_kategori')->get();

        return Inertia::render('cart/produk-list', [
            'produk' => $produk,
            'penitips' => $penitips,
            'kategoris' => $kategoris,
        ]);
    }
    public function produkStok()
    {
        $produk = Produk::with(['kategori', 'penitip'])->get();

        return Inertia::render('cart/produk-stok', [
            'produk' => $produk,
        ]);
    }

    public function resetStok()
    {
        Produk::query()->update([
            'stok_masukSementara' => 0,
            'stok_akhirSementara' => 0,
        ]);

        return redirect()->back()->with('success', 'Stok berhasil direset.');
    }



    public function updateStok(Request $request, $id)
    {
        $request->validate([
            'stok_masukSementara' => 'required|integer|min:0',
        ]);

        $produk = Produk::findOrFail($id);
        $idPenitip = $produk->id_penitip;

        // Tambahkan stok ke produk
        $produk->stok_masukSementara += $request->stok_masukSementara;
        $produk->stok_akhirSementara += $request->stok_masukSementara;
        $produk->save();

        // Tanggal hari ini
        $today = Carbon::now()->toDateString();

        // Cek apakah entri stok untuk produk ini, penitip ini, dan tanggal ini sudah ada
        $existing = DB::table('produk_stoks')
            ->where('id_produk', $produk->id)
            ->where('id_penitip', $idPenitip)
            ->whereDate('created_at', $today)
            ->first();

        if ($existing) {
            // Update entri yang sudah ada
            DB::table('produk_stoks')
                ->where('id', $existing->id)
                ->update([
                    'stok_masuk' => $existing->stok_masuk + $request->stok_masukSementara,
                    'stok_akhir' => $existing->stok_akhir + $request->stok_masukSementara,
                    'updated_at' => now(),
                ]);
        } else {
            // Buat entri baru
            DB::table('produk_stoks')->insert([
                'id_produk' => $produk->id,
                'id_penitip' => $idPenitip,
                'stok_masuk' => $request->stok_masukSementara,
                'stok_akhir' => $produk->stok_akhirSementara,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        return back()->with('success', 'Stok berhasil diperbarui.');
    }

}