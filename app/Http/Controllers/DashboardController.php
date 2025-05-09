<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\Produk;
use App\Models\Penitip;
use App\Models\Transaksi;
use Illuminate\Http\Request;
use App\Models\Transaksi_item;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $bulanIni = now();

        // 1. Total Penjualan bulan ini
        $totalPenjualan = Transaksi::whereYear('created_at', $bulanIni->year)
            ->whereMonth('created_at', $bulanIni->month)
            ->sum('total_bayar');

        // 2. Jumlah Transaksi bulan ini
        $jumlahTransaksi = Transaksi::whereYear('created_at', $bulanIni->year)
            ->whereMonth('created_at', $bulanIni->month)
            ->count();

        // 3. Produk terlaris bulan ini
        $produkTerlaris = Transaksi_item::select('id_produk', DB::raw('SUM(jumlah_beli) as total_terjual'))
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->whereNot('id_penitip', 2)
            ->groupBy('id_produk')
            ->orderByDesc('total_terjual')
            ->get()
            ->load('produk') // memuat relasi setelah get()
            ->first();



        // 4. Jumlah Produk
        $jumlahProduk = Produk::count();

        // 5. Jumlah Penitip
        $jumlahPenitip = Penitip::count();

        $startOfMonth = Carbon::now()->startOfMonth()->toDateString();
        $endOfMonth = Carbon::now()->endOfMonth()->toDateString();

        $grafikPenjualan = DB::table('transaksi')
            ->selectRaw('DATE(created_at) as tanggal, SUM(total_bayar) as total')
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy(DB::raw('DATE(created_at)'))
            ->get();

        return Inertia::render('dashboard', [
            'totalPenjualan' => $totalPenjualan,
            'jumlahTransaksi' => $jumlahTransaksi,
            'produkTerlaris' => $produkTerlaris ? [
                'nama_produk' => $produkTerlaris->produk->nama_produk ?? 'Produk tidak ditemukan',
                'total_terjual' => $produkTerlaris->total_terjual,
            ] : null,
            'jumlahProduk' => $jumlahProduk,
            'jumlahPenitip' => $jumlahPenitip,
            'grafikPenjualan' => $grafikPenjualan,
        ]);
    }
}
