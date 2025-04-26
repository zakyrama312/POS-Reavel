import FlashAlert from '@/components/flashAlert';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { useState } from 'react';

interface Users {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface Props {
    users: Users[];
}

export default function PenitipPage({ users }: Props) {
    const [globalFilter, setGlobalFilter] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const form = useForm({
        name: '',
        email: '',
        password: '',
        role: 'admin',
    });

    const openCreateModal = () => {
        form.reset();
        setEditMode(false);
        setModalOpen(true);
    };

    const openEditModal = (user: Users) => {
        form.setData({
            name: user.name,
            email: user.email,
            password: '',
            role: user.role,
        });
        setSelectedId(user.id);
        setEditMode(true);
        setModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form data:', form.data);
        if (editMode && selectedId !== null) {
            form.put(`/pengguna/${selectedId}`, {
                onSuccess: () => setModalOpen(false),
            });
        } else {
            form.post('/pengguna', {
                onSuccess: () => setModalOpen(false),
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus pengguna ini?')) {
            router.delete(route('penitip.destroy', id));
        }
    };

    const columns: ColumnDef<Users>[] = [
        {
            id: 'nomor',
            header: 'No',
            cell: ({ row }) => row.index + 1,
        },
        { accessorKey: 'name', header: 'Nama Pengguna' },
        { accessorKey: 'email', header: 'Email' },
        { accessorKey: 'role', header: 'Role' },
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
        data: users,
        columns,
        state: { globalFilter },
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onGlobalFilterChange: setGlobalFilter,
    });

    return (
        <AppLayout breadcrumbs={[{ title: 'Pengguna', href: '/pengguna' }]}>
            <FlashAlert />
            <Head title="Pengguna" />
            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <Input
                        placeholder="Cari pengguna..."
                        value={globalFilter ?? ''}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="max-w-sm"
                    />
                    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={openCreateModal}>Tambah Pengguna</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{editMode ? 'Edit Pengguna' : 'Tambah Pengguna'}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <Input
                                    placeholder="Nama Pengguna"
                                    value={form.data.name}
                                    onChange={(e) => form.setData('name', e.target.value)}
                                    required
                                />
                                <Input
                                    placeholder="Email"
                                    type="email"
                                    value={form.data.email}
                                    onChange={(e) => form.setData('email', e.target.value)}
                                    required
                                />
                                {!editMode && (
                                    <Input
                                        placeholder="Password"
                                        type="password"
                                        value={form.data.password}
                                        onChange={(e) => form.setData('password', e.target.value)}
                                        required
                                    />
                                )}
                                <Select value={form.data.role} onValueChange={(value) => form.setData('role', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="petugas">Petugas</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button type="submit" disabled={form.processing}>
                                    Simpan
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
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
