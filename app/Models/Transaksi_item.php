<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaksi_item extends Model
{
    protected $table = 'transaksi_items';
    protected $primaryKey = 'id';
    protected $fillable = [
        'id_transaksi',
        'id_produk',
        'harga',
        'jumlah',
    ];
}
