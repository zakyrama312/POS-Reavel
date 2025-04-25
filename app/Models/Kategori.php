<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kategori extends Model
{
    protected $table = 'kategori';
    protected $primaryKey = 'id';
    protected $guarded = ['id'];

    // Define any relationships here if needed
    // For example:
    public function produk()
    {
        return $this->hasMany(Produk::class);
    }
}
