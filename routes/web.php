<?php

use Inertia\Inertia;
use App\Models\Produk_stok;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Redirect;
use App\Http\Controllers\PrintController;
use App\Http\Controllers\ProdukController;
use App\Http\Controllers\PenitipController;
use App\Http\Controllers\KategoriController;
use App\Http\Controllers\PenggunaController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TransaksiController;
use App\Http\Controllers\ProdukStokController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;

// Route::get('/', function () {
//     return Inertia::render('welcome');
// })->name('home');

Route::get('/', function () {
    return Redirect::route('login');
});
require __DIR__ . '/auth.php';

Route::middleware(['auth', 'verified'])->group(function () {
    // Route::get('dashboard', function () {
    //     return Inertia::render('dashboard');
    // })->name('dashboard');
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    // Pengguna CRUD
    Route::get('pengguna', [PenggunaController::class, 'index'])->name('pengguna.index');
    Route::post('/pengguna', [PenggunaController::class, 'store'])->name('pengguna.store');
    Route::delete('/pengguna/{id}', [PenggunaController::class, 'destroy'])->name('pengguna.destroy');
    Route::get('/pengguna/{id}/edit', [PenggunaController::class, 'edit']);
    Route::put('/pengguna/{id}', [PenggunaController::class, 'update']);

    // Penitip CRUD
    Route::get('penitip', [PenitipController::class, 'index'])->name('penitip.index');
    Route::post('/penitip', [PenitipController::class, 'store'])->name('penitip.store');
    Route::delete('/penitip/{id}', [PenitipController::class, 'destroy'])->name('penitip.destroy');
    Route::get('/penitip/{id}/edit', [PenitipController::class, 'edit']);
    Route::put('/penitip/{id}', [PenitipController::class, 'update']);

    // Kategori CRUD
    Route::get('kategori', [KategoriController::class, 'index'])->name('kategori.index');
    Route::post('/kategori', [KategoriController::class, 'store'])->name('kategori.store');
    Route::delete('/kategori/{id}', [KategoriController::class, 'destroy'])->name('kategori.destroy');
    Route::get('/kategori/{id}/edit', [KategoriController::class, 'edit']);
    Route::put('/kategori/{id}', [KategoriController::class, 'update']);

    // Produk CRUD
    Route::get('produk', [ProdukController::class, 'index'])->name('produk.index');
    Route::get('produk-stok', [ProdukController::class, 'produkStok'])->name('produk.produkStok');
    Route::post('/produk', [ProdukController::class, 'store'])->name('produk.store');
    Route::delete('/produk/{id}', [ProdukController::class, 'destroy'])->name('produk.destroy');
    Route::get('/produk/{id}/edit', [ProdukController::class, 'edit']);
    Route::put('/produk/{id}', [ProdukController::class, 'update']);

    // POS
    Route::get('/point-of-sales', [ProdukController::class, 'produkList'])->name('produk.produkList');

    // Produk Stok
    Route::post('/produk/reset', [ProdukController::class, 'resetStok']);
    Route::put('/produk/update-stok/{id}', [ProdukController::class, 'updateStok'])->name('produk.updateStok');

    // Transaksi
    Route::post('/transaksi', [TransaksiController::class, 'store'])->name('transaksi.store');
    Route::get('/transaksi-harian', [TransaksiController::class, 'transaksiHarian'])->name('transaksi.transaksiHarian');
    Route::get('/transaksi-harian-rpl', [TransaksiController::class, 'transaksiHarianRPL'])->name('transaksi.transaksiHarianRPL');

    //Laporan
    Route::get('/laporan-penjualan-penitip', [TransaksiController::class, 'laporanPenitip'])->name('transaksi.laporanPenitip');
    Route::get('/laporan-penjualan-rpl', [TransaksiController::class, 'laporanRpl'])->name('transaksi.laporanRpl');
    Route::get('/laporan-riwayat-stok', [ProdukStokController::class, 'laporanStok'])->name('transaksi.laporanStok');

    // Print
    Route::get('print-label-transaksi-harian', [PrintController::class, 'printLabel'])->name('printLabel');



    // Route::get('laporan-penjualan-penitip', function () {
    //     return Inertia::render('laporan/laporan-penjualan-penitip');
    // })->name('laporan-penjualan-penitip');




    // Route::get('produk-cart', function () {
    //     return Inertia::render('cart/posCart');
    // })->name('produk-cart');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';