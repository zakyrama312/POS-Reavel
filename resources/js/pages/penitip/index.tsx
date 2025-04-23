import FlashAlert from '@/components/flashAlert';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { useState } from 'react';

interface Penitip {
    id: number;
    nama_penitip: string;
}

interface Props {
    penitips: Penitip[];
}

export default function PenitipPage({ penitips }: Props) {
    const [globalFilter, setGlobalFilter] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const form = useForm({
        nama_penitip: '',
    });

    const openCreateModal = () => {
        form.reset();
        setEditMode(false);
        setModalOpen(true);
    };

    const openEditModal = (penitip: Penitip) => {
        form.setData({ nama_penitip: penitip.nama_penitip });
        setSelectedId(penitip.id);
        setEditMode(true);
        setModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editMode && selectedId !== null) {
            form.put(`/penitip/${selectedId}`, {
                onSuccess: () => setModalOpen(false),
            });
        } else {
            form.post('/penitip', {
                onSuccess: () => setModalOpen(false),
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus penitip ini?')) {
            router.delete(route('penitip.destroy', id));
        }
    };

    const columns: ColumnDef<Penitip>[] = [
        {
            id: 'nomor',
            header: 'No',
            cell: ({ row }) => row.index + 1,
        },
        { accessorKey: 'nama_penitip', header: 'Nama Penitip' },
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
        data: penitips,
        columns,
        state: { globalFilter },
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onGlobalFilterChange: setGlobalFilter,
    });

    return (
        <AppLayout breadcrumbs={[{ title: 'Penitip', href: '/penitip' }]}>
            <FlashAlert />
            <Head title="Penitip" />
            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <Input
                        placeholder="Cari penitip..."
                        value={globalFilter ?? ''}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="max-w-sm"
                    />
                    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={openCreateModal}>Tambah Penitip</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{editMode ? 'Edit Penitip' : 'Tambah Penitip'}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <Input
                                    placeholder="Nama Penitip"
                                    value={form.data.nama_penitip}
                                    onChange={(e) => form.setData('nama_penitip', e.target.value)}
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
