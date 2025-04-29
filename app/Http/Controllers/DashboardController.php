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
        $bulanIni = now()->format('Y-m');

        // 1. Total Penjualan bulan ini
        $totalPenjualan = Transaksi::where('bulan', $bulanIni)->sum('total_bayar');

        // 2. Jumlah Transaksi bulan ini
        $jumlahTransaksi = Transaksi::where('bulan', $bulanIni)->count();

        // 3. Produk terlaris bulan ini
        $produkTerlaris = Transaksi_item::select('id_produk', DB::raw('SUM(jumlah_beli) as total_terjual'))
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->groupBy('id_produk')
            ->orderByDesc('total_terjual')
            ->with('produk') // pastikan relasi `produk` dibuat di model TransaksiItem
            ->first();

        // 4. Jumlah Produk
        $jumlahProduk = Produk::count();

        // 5. Jumlah Penitip
        $jumlahPenitip = Penitip::count();

        $startOfMonth = Carbon::now()->startOfMonth()->toDateString();
        $endOfMonth = Carbon::now()->endOfMonth()->toDateString();

        $grafikPenjualan = DB::table('transaksi')
            ->selectRaw('DATE(created_at) as tanggal, SUM(total_bayar) as total')
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('tanggal')
            ->get();
        return Inertia::render('dashboard', [
            'totalPenjualan' => $totalPenjualan,
            'jumlahTransaksi' => $jumlahTransaksi,
            'produkTerlaris' => $produkTerlaris?->produk->nama_produk ?? '-',
            'jumlahTerjual' => $produkTerlaris?->total_terjual ?? 0,
            'jumlahProduk' => $jumlahProduk,
            'jumlahPenitip' => $jumlahPenitip,
            'grafikPenjualan' => $grafikPenjualan,
        ]);
    }
}
