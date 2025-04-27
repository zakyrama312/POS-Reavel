import PointofSales from '@/components/pointofSales';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import DataTable from 'react-data-table-component';

interface Produk {
    id: number;
    nama_produk: string;
    harga: number;
    stok_masukSementara: number;
    stok_akhirSementara: number;
    kategori: { nama_kategori: string };
    penitip: { nama_penitip: string };
    kode_produk?: string;
}

interface Props {
    produk: Produk[];
}

export default function StokPage({ produk }: Props) {
    const [search, setSearch] = useState('');
    const [stokInput, setStokInput] = useState<Record<number, string>>({}); // key: produk.id, value: jumlah input

    const handleSubmit = (produk: Produk) => {
        const value = stokInput[produk.id];

        if (value === '' || isNaN(Number(value))) {
            alert('Masukkan jumlah stok terlebih dahulu.');
            return;
        }

        router.put(
            `/produk/update-stok/${produk.id}`,
            {
                id: produk.id,
                stok_masukSementara: Number(value),
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    // alert('Stok berhasil diperbarui');
                    setStokInput((prev) => ({ ...prev, [produk.id]: '' })); // kosongkan input
                },
            },
        );
    };

    const handleResetStok = () => {
        if (confirm('Yakin ingin mereset semua stok?')) {
            router.post(
                '/produk/reset',
                {},
                {
                    preserveScroll: true,
                    onSuccess: () => alert('Stok berhasil direset.'),
                },
            );
        }
    };

    const filteredRows = produk.filter(
        (r) => r.nama_produk.toLowerCase().includes(search.toLowerCase()) || r.penitip.nama_penitip.toLowerCase().includes(search.toLowerCase()),
    );

    const columns = [
        { name: 'No', cell: (row, index) => index + 1, width: '50px' },
        { name: 'Kode Produk', selector: (row) => row.kode_produk, sortable: true },
        { name: 'Produk', selector: (row) => row.nama_produk, sortable: true },
        { name: 'Penitip', selector: (row) => row.penitip.nama_penitip, sortable: true },
        { name: 'Harga', selector: (row) => `Rp. ${row.harga.toLocaleString()}`, sortable: true },
        { name: 'Stok Masuk', selector: (row) => `${row.stok_masukSementara} pcs`, sortable: true },
        { name: 'Stok Akhir', selector: (row) => `${row.stok_akhirSementara} pcs`, sortable: true },
        {
            name: 'Input Stok',
            cell: (row) => (
                <div className="flex items-center gap-2">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit(row);
                        }}
                    >
                        <input
                            type="number"
                            placeholder="Stok masuk"
                            className="input input-sm input-bordered w-24 border bg-[#eeececf1]"
                            value={stokInput[row.id] ?? ''}
                            onChange={(e) => setStokInput((prev) => ({ ...prev, [row.id]: e.target.value }))}
                        />
                        {/* <button className="btn btn-sm btn-primary" type="submit">
                            Simpan
                        </button> */}
                    </form>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Kelola Stok" />
            <PointofSales />

            <div className="p-4">
                {/* <Link href="/produk-list">
                    <SquareArrowLeft className="text-red" />
                </Link> */}
                <div className="rounded-xl bg-white p-4 shadow">
                    <div className="mb-4 flex items-center justify-between">
                        <input
                            type="text"
                            className="input input-bordered border-black bg-[#eeececf1]"
                            placeholder="Cari produk..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button className="btn btn-error text-white" onClick={handleResetStok}>
                            Reset Stok
                        </button>
                    </div>

                    <DataTable columns={columns} data={filteredRows} pagination responsive highlightOnHover striped />
                </div>
            </div>
        </>
    );
}
