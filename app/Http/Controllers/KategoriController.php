<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Kategori;
use Illuminate\Http\Request;

class KategoriController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $kategoris = Kategori::latest()->get();
        return Inertia::render('kategori/index', ['kategoris' => $kategoris]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'nama_kategori' => 'required',
        ]);
        Kategori::create($data);
        return redirect()->back()->with('success', 'Data kategori berhasil ditambahkan');
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Kategori $kategori, $id)
    {
        $kategori = Kategori::findOrFail($id);
        $request->validate([
            'nama_kategori' => 'required',
        ]);

        $kategori->update($request->only('nama_kategori'));
        return redirect()->back()->with('success', 'Data kategori berhasil diubah');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $kategori = Kategori::find($id);
        // Check if kategori has related data in other tables
        if ($kategori->relatedData()->exists()) {
            return redirect()->back()->with('error', 'Data kategori tidak dapat dihapus karena memiliki data terkait');
        }
        $kategori->delete();
        return redirect()->back()->with('success', 'Data kategori berhasil dihapus');
    }
}
