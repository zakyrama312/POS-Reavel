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

                $produkStok = Produk_stok::where('id_produk', $produk->id)
                    ->whereDate('created_at', today()) // ambil data stok hari ini
                    ->latest() // jaga-jaga kalau ada lebih dari 1
                    ->first();

                if ($produkStok) {
                    $produkStok->update([
                        'stok_akhir' => $produk->stok_akhirSementara,
                    ]);
                } else {
                    // Kalau gak ada record untuk hari ini, bisa warning/log atau fallback
                    // Misal: abort(500, 'Stok harian tidak ditemukan.');
                }
            }
        });

        return back()->with('success', 'Transaksi berhasil ');
    }

    public function laporanPenitip()
    {

        $laporanPenitip = Produk::with([
            'penitip',
            'produk_stoks' => fn($q) => $q->orderBy('created_at'),
            'transaksi_items'
        ])->whereNot('id_penitip', 2)->get()->flatMap(function ($produk) {
            return $produk->produk_stoks->map(function ($stok) use ($produk) {
                $transaksiItems = $produk->transaksi_items->filter(function ($item) use ($stok) {
                    // Bandingkan berdasarkan tanggal saja (tanpa jam)
                    return $item->created_at->format('Y-m-d') === $stok->created_at->format('Y-m-d');
                });

                $jumlahTerjual = $transaksiItems->sum('jumlah_beli');
                $total = $transaksiItems->sum('total_harga');
                $laba = $transaksiItems->sum('laba');
                $uangKembali = $transaksiItems->sum('total_uang_penitip');
                $sisa = $stok->stok_masuk - $jumlahTerjual;

                return [
                    'id' => $produk->id,
                    'nama_produk' => $produk->nama_produk,
                    'nama_penitip' => $produk->penitip->nama_penitip ?? '-',
                    'harga' => $produk->harga,
                    'stok_awal' => $stok->stok_masuk ?? 0,
                    'sisa' => $sisa ?? 0,
                    'jumlah_terjual' => $jumlahTerjual,
                    'total' => $total,
                    'laba' => $laba,
                    'uang_kembali' => $uangKembali,
                    'created_at' => $stok->created_at,
                ];
            })->sortByDesc('created_at')->values();
            ;
        });




        return Inertia::render('laporan/laporan-penjualan-penitip', [
            'laporanPenitip' => $laporanPenitip,
        ]);


    }
    public function laporanRpl()
    {

        $laporanPenitip = Produk::with([
            'penitip',
            'produk_stoks' => fn($q) => $q->orderBy('created_at'),
            'transaksi_items'
        ])->where('id_penitip', 2)->get()->flatMap(function ($produk) {
            return $produk->produk_stoks->map(function ($stok) use ($produk) {
                $transaksiItems = $produk->transaksi_items->filter(function ($item) use ($stok) {
                    // Bandingkan berdasarkan tanggal saja (tanpa jam)
                    return $item->created_at->format('Y-m-d') === $stok->created_at->format('Y-m-d');
                });

                $jumlahTerjual = $transaksiItems->sum('jumlah_beli');
                $total = $transaksiItems->sum('total_harga');
                $laba = $transaksiItems->sum('laba');
                $uangKembali = $transaksiItems->sum('total_uang_penitip');
                $sisa = $stok->stok_masuk - $jumlahTerjual;

                return [
                    'id' => $produk->id,
                    'nama_produk' => $produk->nama_produk,
                    'nama_penitip' => $produk->penitip->nama_penitip ?? '-',
                    'harga' => $produk->harga,
                    'stok_awal' => $stok->stok_masuk ?? 0,
                    'sisa' => $sisa ?? 0,
                    'jumlah_terjual' => $jumlahTerjual,
                    'total' => $total,
                    'laba' => $laba,
                    'uang_kembali' => $uangKembali,
                    'created_at' => $stok->created_at,
                ];
            })->sortByDesc('created_at')->values();
            ;
        });



        return Inertia::render('laporan/laporan-penjualan-rpl', [
            'laporanPenitip' => $laporanPenitip,
        ]);
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
        $labaPenjualan = Transaksi_item::whereDate('created_at', $today)
            ->whereNot('id_penitip', 2)
            ->sum('laba');

        $total = $transaksiItems->sum('total') + $labaPenjualan + 50000;

        return Inertia::render('transaksi/transaksi-harian-rpl', [
            'transaksi_items' => $transaksiItems,
            'laba' => $labaPenjualan,
            'total' => $total,
        ]);
    }
}
