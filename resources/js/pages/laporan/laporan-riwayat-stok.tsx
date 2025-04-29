// resources/js/Pages/LaporanStok.tsx

import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useMemo, useState } from 'react';
import { FaRegFilePdf } from 'react-icons/fa6';
import { RiFileExcel2Line } from 'react-icons/ri';
import * as XLSX from 'xlsx';

interface StokItem {
    id: number;
    nama_penitip: string;
    nama_produk: string;
    stok_awal: number;
    sisa: number;
    created_at: string;
}

interface PageProps {
    laporanStok: StokItem[];
}

export default function LaporanStok({ laporanStok }: PageProps) {
    const [search, setSearch] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [pageSize, setPageSize] = useState(10);

    const filteredData = useMemo(() => {
        return laporanStok.filter((item) => {
            const lower = search.toLowerCase();
            const date = new Date(item.created_at);
            const from = fromDate ? new Date(fromDate) : null;
            const to = toDate ? new Date(toDate + 'T23:59:59') : null;

            const matchSearch = item.nama_produk.toLowerCase().includes(lower) || item.nama_penitip.toLowerCase().includes(lower);

            const matchFrom = from ? date >= from : true;
            const matchTo = to ? date <= to : true;

            return matchSearch && matchFrom && matchTo;
        });
    }, [laporanStok, search, fromDate, toDate]);

    const columns: ColumnDef<StokItem>[] = [
        { id: 'nomor', header: 'No', cell: ({ row }) => row.index + 1 },
        { accessorKey: 'nama_penitip', header: 'Penitip' },
        { accessorKey: 'nama_produk', header: 'Produk' },
        { accessorKey: 'stok_awal', header: 'Stok Awal' },
        { accessorKey: 'sisa', header: 'Stok Akhir' },
        { accessorKey: 'created_at', header: 'Tanggal', cell: (info) => new Date(info.getValue<string>()).toLocaleDateString('id-ID') },
    ];

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: { pagination: { pageSize } },
        onPaginationChange: (updater) => table.setPagination(updater),
    });

    const exportExcel = () => {
        const data = filteredData.map((item) => ({
            Penitip: item.nama_penitip,
            Produk: item.nama_produk,
            'Stok Awal': item.stok_awal,
            'Sisa Sekarang': item.sisa,
            Tanggal: new Date(item.created_at).toLocaleDateString('id-ID'),
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan Stok');

        XLSX.writeFile(workbook, `laporan-stok.xlsx`);
    };

    const exportPDF = () => {
        const doc = new jsPDF();
        const body = filteredData.map((row) => [
            row.nama_penitip,
            row.nama_produk,
            row.stok_awal,
            row.sisa,
            new Date(row.created_at).toLocaleDateString('id-ID'),
        ]);

        autoTable(doc, {
            head: [['Penitip', 'Produk', 'Stok Awal', 'Sisa Sekarang', 'Tanggal']],
            body,
        });

        doc.save('laporan-stok.pdf');
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Laporan Stok', href: '/laporan-stok' }]}>
            <Head title="Laporan Stok" />
            <div className="space-y-4 p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <input
                        type="text"
                        placeholder="Cari produk/penitip..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="rounded border p-2 text-sm"
                    />
                    <div className="flex items-center gap-2">
                        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="rounded border p-2 text-sm" />
                        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="rounded border p-2 text-sm" />
                    </div>
                </div>

                <div className="flex justify-between">
                    <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} className="rounded border p-[1px] text-xs">
                        {[10, 25, 50, 100].map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                    <div className="flex gap-2">
                        <Button className="bg-green-600 hover:bg-green-700" onClick={exportExcel}>
                            <RiFileExcel2Line />
                        </Button>
                        <Button className="bg-red-500 hover:bg-red-700" onClick={exportPDF}>
                            <FaRegFilePdf />
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            onClick={header.column.getToggleSortingHandler()}
                                            className="cursor-pointer px-6 py-3 text-left text-sm text-gray-500"
                                        >
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {table.getRowModel().rows.map((row) => (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="px-6 py-4 text-sm text-gray-700">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <Button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                        Previous
                    </Button>
                    <span>
                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </span>
                    <Button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        Next
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
