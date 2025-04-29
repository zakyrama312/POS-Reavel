import FlashAlert from '@/components/flashAlert';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';
import { NumericFormat } from 'react-number-format';
import Select from 'react-select';

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

    const openEditModal = useCallback(
        (item: Produk) => {
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
        },
        [form],
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editMode && selectedId !== null) {
            form.put(`/produk/${selectedId}`, { onSuccess: () => setModalOpen(false) });
        } else {
            form.post('/produk', { onSuccess: () => setModalOpen(false) });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus data produk ini?')) {
            router.delete(route('produk.destroy', id));
        }
    };

    const columns = useMemo<ColumnDef<Produk>[]>(
        () => [
            { id: 'nomor', header: 'No', cell: ({ row }) => row.index + 1 },
            { accessorKey: 'kode_produk', header: 'Kode Produk' },
            { accessorKey: 'nama_produk', header: 'Nama Produk' },
            { accessorKey: 'penitip.nama_penitip', header: 'Penitip' },
            { accessorKey: 'kategori.nama_kategori', header: 'Kategori' },
            {
                accessorKey: 'harga',
                header: 'Harga',
                cell: ({ getValue }) => (
                    <NumericFormat value={Number(getValue())} displayType="text" thousandSeparator="." decimalSeparator="," prefix="Rp. " />
                ),
                footer: (info) => {
                    const total = info.table.getFilteredRowModel().rows.reduce((sum, row) => sum + (row.original.harga || 0), 0);
                    return (
                        <div className="font-bold">
                            Total: <NumericFormat value={total} displayType="text" thousandSeparator="." decimalSeparator="," prefix="Rp. " />
                        </div>
                    );
                },
            },
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
        ],
        [openEditModal],
    );

    const table = useReactTable({
        data: produk,
        columns,
        state: { globalFilter },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <AppLayout breadcrumbs={[{ title: 'Produk', href: '/produk' }]}>
            <FlashAlert />
            <Head title="Produk" />
            <div className="space-y-4 p-4">
                {/* Search & Button Create */}
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
                                <Select
                                    options={penitips.map((p) => ({ value: p.id, label: p.nama_penitip }))}
                                    value={penitips
                                        .map((p) => ({ value: p.id, label: p.nama_penitip }))
                                        .find((option) => String(option.value) === form.data.id_penitip)}
                                    onChange={(selected) => form.setData('id_penitip', String(selected?.value ?? ''))}
                                    placeholder="Pilih Penitip"
                                    isClearable
                                />

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
                                <NumericFormat
                                    value={form.data.harga}
                                    thousandSeparator="."
                                    decimalSeparator=","
                                    prefix="Rp. "
                                    onValueChange={(values) => form.setData('harga', values.value)}
                                    className="w-full rounded border p-1"
                                    allowNegative={false}
                                    placeholder="Harga"
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

                {/* Table */}
                <div className="overflow-x-auto rounded-md border">
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
                            {table.getRowModel().rows.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="capitalize">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="text-center">
                                        Tidak ada data.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                        <tfoot>
                            {table.getFooterGroups().map((footerGroup) => (
                                <TableRow key={footerGroup.id}>
                                    {footerGroup.headers.map((header) => (
                                        <TableCell key={header.id}>{flexRender(header.column.columnDef.footer, header.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </tfoot>
                    </Table>
                </div>

                {/* Pagination */}
                <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                            Previous
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
