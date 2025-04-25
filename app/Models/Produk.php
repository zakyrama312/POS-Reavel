<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Produk extends Model
{
    protected $table = 'produk';
    protected $primaryKey = 'id';
    protected $fillable = [
        'kode_produk',
        'id_penitip',
        'id_kategori',
        'nama_produk',
        'harga',
        'stok_masukSementara',
        'stok_akhirSementara',
    ];
    protected static function booted()
    {
        static::creating(function ($produk) {
            $lastId = Produk::max('id') ?? 0;
            $next = $lastId + 1;
            $produk->kode_produk = 'PRD-' . str_pad($next, 6, '0', STR_PAD_LEFT);
        });
    }

    public function penitip()
    {
        return $this->belongsTo(Penitip::class, 'id_penitip');
    }

    public function kategori()
    {
        return $this->belongsTo(Kategori::class, 'id_kategori');
    }
}
