import FlashAlert from '@/components/flashAlert';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { useState } from 'react';

interface Produk {
    id: number;
    kode_produk: string;
    nama_produk: string;
    id_penitip: number;
    id_kategori: number;
    harga: number;
    stok_masukSementara: number;
    penitip: { nama_penitip: string };
    kategori: { nama_kategori: string };
}

interface Penitip {
    id: number;
    nama_penitip: string;
}

interface Kategori {
    id: number;
    nama_kategori: string;
}

interface Props {
    produk: Produk[];
    penitips: Penitip[];
    kategoris: Kategori[];
}

export default function ProdukPage({ produk, penitips, kategoris }: Props) {
    const [globalFilter, setGlobalFilter] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const form = useForm({
        nama_produk: '',
        id_penitip: '',
        id_kategori: '',
        harga: '',
        stok_masuk: '',
    });

    const openCreateModal = () => {
        form.reset();
        setEditMode(false);
        setModalOpen(true);
    };

    const openEditModal = (item: Produk) => {
        form.setData({
            nama_produk: item.nama_produk,
            id_penitip: String(item.id_penitip),
            id_kategori: String(item.id_kategori),
            harga: String(item.harga),
            stok_masuk: String(item.stok_masukSementara),
        });
        setSelectedId(item.id);
        setEditMode(true);
        setModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editMode && selectedId !== null) {
            form.put(`/produk/${selectedId}`, {
                onSuccess: () => setModalOpen(false),
            });
        } else {
            form.post('/produk', {
                onSuccess: () => setModalOpen(false),
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus data produk ini?')) {
            router.delete(route('produk.destroy', id));
        }
    };

    const columns: ColumnDef<Produk>[] = [
        { id: 'nomor', header: 'No', cell: ({ row }) => row.index + 1 },
        { accessorKey: 'kode_produk', header: 'Kode Produk' },
        { accessorKey: 'nama_produk', header: 'Nama Produk' },
        { accessorKey: 'penitip.nama_penitip', header: 'Penitip' },
        { accessorKey: 'kategori.nama_kategori', header: 'Kategori' },
        { accessorKey: 'harga', header: 'Harga' },
        { accessorKey: 'stok_masukSementara', header: 'Stok Masuk' },
        {
            id: 'aksi',
            header: 'Aksi',
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Button onClick={() => openEditModal(row.original)} size="sm">
                        Edit
                    </Button>
                    <Button onClick={() => handleDelete(row.original.id)} size="sm" variant="destructive">
                        Hapus
                    </Button>
                </div>
            ),
        },
    ];

    const table = useReactTable({
        data: produk,
        columns,
        state: { globalFilter },
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onGlobalFilterChange: setGlobalFilter,
    });

    return (
        <AppLayout breadcrumbs={[{ title: 'Produk', href: '/produk' }]}>
            <FlashAlert />
            <Head title="Produk" />
            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <Input
                        placeholder="Cari produk..."
                        value={globalFilter ?? ''}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="max-w-sm"
                    />
                    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={openCreateModal}>Tambah Produk</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{editMode ? 'Edit Produk' : 'Tambah Produk'}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <Input
                                    placeholder="Nama Produk"
                                    value={form.data.nama_produk}
                                    onChange={(e) => form.setData('nama_produk', e.target.value)}
                                    required
                                />
                                <select
                                    className="w-full rounded border px-3 py-2"
                                    value={form.data.id_penitip}
                                    onChange={(e) => form.setData('id_penitip', e.target.value)}
                                    required
                                >
                                    <option value="">Pilih Penitip</option>
                                    {penitips.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.nama_penitip}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    className="w-full rounded border px-3 py-2"
                                    value={form.data.id_kategori}
                                    onChange={(e) => form.setData('id_kategori', e.target.value)}
                                    required
                                >
                                    <option value="">Pilih Kategori</option>
                                    {kategoris.map((k) => (
                                        <option key={k.id} value={k.id}>
                                            {k.nama_kategori}
                                        </option>
                                    ))}
                                </select>
                                <Input
                                    type="number"
                                    placeholder="Harga"
                                    value={form.data.harga}
                                    onChange={(e) => form.setData('harga', e.target.value)}
                                    required
                                />
                                <Input
                                    type="number"
                                    placeholder="Stok Masuk"
                                    value={form.data.stok_masuk}
                                    onChange={(e) => form.setData('stok_masuk', e.target.value)}
                                    required
                                />
                                <Button type="submit" disabled={form.processing}>
                                    Simpan
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                        Previous
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        Next
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
