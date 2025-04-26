<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaksi_item extends Model
{
    protected $table = 'transaksi_items';
    protected $primaryKey = 'id';
    protected $guarded = [];
    public function produk()
    {
        return $this->belongsTo(Produk::class, 'id_produk');
    }
    public function penitip()
    {
        return $this->belongsTo(Penitip::class, 'id_penitip');
    }
    public function transaksi()
    {
        return $this->belongsTo(Transaksi::class, 'id_transaksi');
    }
}