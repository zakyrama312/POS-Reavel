import { Button } from '@/components/ui/button';
import { formatRupiah } from '@/components/utils';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useMemo, useState } from 'react';
import * as XLSX from 'xlsx';

interface LaporanPenitipItem {
    id: number;
    nama_penitip: string;
    nama_produk: string;
    harga: number;
    stok_awal: number;
    sisa: number;
    jumlah_terjual: number;
    total: number;
    laba: number;
    uang_kembali: number;
    created_at: string;
}

interface PageProps {
    laporanPenitip: LaporanPenitipItem[];
}

export default function LaporanPenitip({ laporanPenitip }: PageProps) {
    const [search, setSearch] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [pageSize, setPageSize] = useState(10);

    const groupedData = useMemo(() => {
        const map = new Map<string, LaporanPenitipItem>();

        laporanPenitip.forEach((item) => {
            const date = new Date(item.created_at).toLocaleDateString('id-ID');
            const key = `${date}-${item.nama_penitip}-${item.nama_produk}`;

            if (!map.has(key)) {
                map.set(key, { ...item, created_at: item.created_at });
            } else {
                const existing = map.get(key)!;
                map.set(key, {
                    ...existing,
                    stok_awal: Math.max(existing.stok_awal, item.stok_awal), // ambil stok awal terbesar (kalau logikamu gitu)
                    sisa: Math.min(existing.sisa, item.sisa), // ambil sisa paling kecil (karena makin laku makin habis)
                    jumlah_terjual: existing.jumlah_terjual + item.jumlah_terjual,
                    total: existing.total + item.total,
                    laba: existing.laba + item.laba,
                    uang_kembali: existing.uang_kembali + item.uang_kembali,
                });
            }
        });

        return Array.from(map.values());
    }, [laporanPenitip]);

    const filteredData = useMemo(() => {
        return groupedData.filter((item) => {
            const lowerSearch = search.toLowerCase();
            const date = new Date(item.created_at);
            const from = fromDate ? new Date(fromDate) : null;
            const to = toDate ? new Date(toDate) : null;

            const matchSearch = item.nama_produk.toLowerCase().includes(lowerSearch) || item.nama_penitip.toLowerCase().includes(lowerSearch);
            const matchFrom = from ? date >= from : true;
            const matchTo = to ? date <= to : true;

            return matchSearch && matchFrom && matchTo;
        });
    }, [groupedData, search, fromDate, toDate]);

    const columns: ColumnDef<LaporanPenitipItem>[] = [
        { accessorKey: 'nama_penitip', header: 'Nama Penitip' },
        { accessorKey: 'nama_produk', header: 'Nama Produk' },
        { accessorKey: 'harga', header: 'Harga', cell: (info) => formatRupiah(info.getValue<number>()) },
        { accessorKey: 'stok_awal', header: 'Stok Awal' },
        { accessorKey: 'sisa', header: 'Sisa' },
        { accessorKey: 'jumlah_terjual', header: 'Jumlah Terjual' },
        { accessorKey: 'total', header: 'Total', cell: (info) => formatRupiah(info.getValue<number>()) },
        { accessorKey: 'laba', header: 'Laba', cell: (info) => formatRupiah(info.getValue<number>()) },
        { accessorKey: 'uang_kembali', header: 'Uang Kembali', cell: (info) => formatRupiah(info.getValue<number>()) },
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
        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan');
        XLSX.writeFile(workbook, 'laporan-penitip.xlsx');
    };

    const exportPDF = () => {
        const doc = new jsPDF();
        autoTable(doc, {
            head: [columns.map((col) => col.header as string)],
            body: filteredData.map((row) => [
                row.nama_penitip,
                row.nama_produk,
                formatRupiah(row.harga),
                row.stok_awal,
                row.sisa,
                row.jumlah_terjual,
                formatRupiah(row.total),
                formatRupiah(row.laba),
                formatRupiah(row.uang_kembali),
                new Date(row.created_at).toLocaleDateString('id-ID'),
            ]),
        });
        doc.save('laporan-penitip.pdf');
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Laporan Penitip', href: '/laporan-penjualan-penitip' }]}>
            <Head title="Laporan Penitip" />
            <div className="space-y-4 p-6">
                <div className="flex flex-wrap items-center gap-2">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari produk/penitip..."
                        className="rounded border p-2 text-sm"
                    />
                    <div className="flex items-center gap-2">
                        <span>Filter Tanggal:</span>
                        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="rounded border p-2 text-sm" />
                        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="rounded border p-2 text-sm" />
                    </div>
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            table.setPageSize(Number(e.target.value));
                        }}
                        className="rounded border p-2 text-sm"
                    >
                        {[10, 25, 50, 100].map((size) => (
                            <option key={size} value={size}>
                                {size} per page
                            </option>
                        ))}
                    </select>
                    <Button onClick={exportExcel} className="bg-green-600 text-sm text-white hover:bg-green-700">
                        Export Excel
                    </Button>
                    <Button variant="destructive" onClick={exportPDF} className="text-sm">
                        Export PDF
                    </Button>
                </div>

                <div className="overflow-x-auto rounded shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            onClick={header.column.getToggleSortingHandler()}
                                            className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase select-none"
                                        >
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {header.column.getIsSorted() ? (header.column.getIsSorted() === 'asc' ? ' ▲' : ' ▼') : ''}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {table.getRowModel().rows.map((row) => (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="px-6 py-4 text-sm whitespace-nowrap text-gray-700">
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
