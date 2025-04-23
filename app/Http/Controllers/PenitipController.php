<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Penitip;
use Illuminate\Http\Request;

class PenitipController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $penitips = Penitip::latest()->get();
        return Inertia::render('penitip/index', [
            'penitips' => $penitips,
        ]);
    }



    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'nama_penitip' => 'required',
        ]);
        Penitip::create($data);
        return redirect()->back()->with('success', 'Data penitip berhasil ditambahkan');
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Penitip $penitip, $id)
    {
        $penitip = Penitip::findOrFail($id);
        $request->validate([
            'nama_penitip' => 'required',
        ]);

        $penitip->update($request->only('nama_penitip'));
        return redirect()->back()->with('success', 'Data penitip berhasil diubah');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $penitip = Penitip::find($id);
        // Check if penitip has related data in other tables
        if ($penitip->relatedData()->exists()) {
            return redirect()->back()->with('error', 'Data penitip tidak dapat dihapus karena memiliki data terkait');
        }
        $penitip->delete();
        return redirect()->back()->with('success', 'Data penitip berhasil dihapus');
    }
}
