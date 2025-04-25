<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Produk_stok extends Model
{
    protected $table = 'produk_stoks';
    protected $primaryKey = 'id';
    protected $fillable = ['id_produk', 'id_penitip', 'stok_masuk', 'stok_akhir'];

    public function produkStoks()
    {
        return $this->hasMany(Produk_stok::class, 'id_produk');
    }

    public function produk()
    {
        return $this->belongsTo(Produk::class, 'id_produk');
    }

    public function penitip()
    {
        return $this->belongsTo(Penitip::class, 'id_penitip');
    }
}