<?php

use App\Http\Controllers\KategoriController;
use App\Http\Controllers\PenitipController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
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





    Route::get('produk-list', function () {
        return Inertia::render('cart/produk-list');
    })->name('produk-list');




    Route::get('produk-cart', function () {
        return Inertia::render('cart/posCart');
    })->name('produk-cart');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
