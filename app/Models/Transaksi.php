<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaksi extends Model
{
    protected $table = 'transaksi';
    protected $fillable = [
        'id_users',
        'invoice',
        'total_bayar',
        'bayar',
        'kembalian',
    ];

    public function items()
    {
        return $this->hasMany(Transaksi_item::class, 'id_transaksi');
    }
}