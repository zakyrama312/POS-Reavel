import { Button } from '@/components/ui/button';
import { formatRupiah } from '@/components/utils';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useMemo, useState } from 'react';
import { FaRegFilePdf } from 'react-icons/fa6';
import { RiFileExcel2Line } from 'react-icons/ri';
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
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState('');
    const [pageIndex, setPageIndex] = useState(0);

    const filteredData = useMemo(() => {
        const filtered = laporanPenitip.filter((item) => {
            const searchLower = search.toLowerCase();
            const date = new Date(item.created_at);
            const from = fromDate ? new Date(fromDate) : null;
            const to = toDate ? new Date(toDate + 'T23:59:59') : null;

            const matchSearch = item.nama_produk.toLowerCase().includes(searchLower) || item.nama_penitip.toLowerCase().includes(searchLower);
            const matchFrom = from ? date >= from : true;
            const matchTo = to ? date <= to : true;

            return matchSearch && matchFrom && matchTo;
        });

        // 🔽 Urutkan dari terbaru ke terlama berdasarkan tanggal
        return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }, [laporanPenitip, search, fromDate, toDate]);

    const columns: ColumnDef<LaporanPenitipItem>[] = [
        { id: 'no', header: 'No', cell: ({ row }) => row.index + 1 },
        { accessorKey: 'nama_penitip', header: 'Nama Penitip' },
        { accessorKey: 'nama_produk', header: 'Nama Produk' },
        { accessorKey: 'harga', header: 'Harga', cell: (info) => formatRupiah(info.getValue<number>()) },
        { accessorKey: 'stok_awal', header: 'Stok Awal' },
        { accessorKey: 'sisa', header: 'Sisa' },
        { accessorKey: 'jumlah_terjual', header: 'Jumlah Terjual' },
        { accessorKey: 'total', header: 'Total', cell: (info) => formatRupiah(info.getValue<number>()) },
        // { accessorKey: 'laba', header: 'Laba', cell: (info) => formatRupiah(info.getValue<number>()) },
        // { accessorKey: 'uang_kembali', header: 'Uang Kembali', cell: (info) => formatRupiah(info.getValue<number>()) },
        { accessorKey: 'created_at', header: 'Tanggal', cell: (info) => new Date(info.getValue<string>()).toLocaleDateString('id-ID') },
    ];

    const table = useReactTable({
        data: filteredData,
        columns,
        state: { pagination: { pageIndex, pageSize } },
        onPaginationChange: (updater) => {
            const newPagination = typeof updater === 'function' ? updater({ pageIndex, pageSize }) : updater;
            setPageIndex(newPagination.pageIndex);
            setPageSize(newPagination.pageSize);
        },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const exportExcel = () => {
        const data = filteredData.map((row, index) => ({
            No: index + 1,
            'Nama Penitip': row.nama_penitip,
            'Nama Produk': row.nama_produk,
            Harga: row.harga,
            'Stok Awal': row.stok_awal,
            Sisa: row.sisa,
            'Jumlah Terjual': row.jumlah_terjual,
            Total: row.total,
            // Laba: row.laba,
            // 'Uang Kembali': row.uang_kembali,
            Tanggal: new Date(row.created_at).toLocaleDateString('id-ID'),
        }));

        data.push({
            No: 0,
            'Nama Penitip': '',
            'Nama Produk': '',
            Harga: 0,
            'Stok Awal': 0,
            Sisa: 0,
            'Jumlah Terjual': 0,
            Total: filteredData.reduce((sum, item) => sum + item.total, 0),
            // Laba: filteredData.reduce((sum, item) => sum + item.laba, 0),
            // 'Uang Kembali': filteredData.reduce((sum, item) => sum + item.uang_kembali, 0),
            Tanggal: '',
        });

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan');
        let filename = 'laporan-rpl';
        if (fromDate && toDate) {
            const formatDate = (date: string) => {
                const [year, month, day] = date.split('-');
                return `${day}-${month}-${year}`;
            };
            filename += `-${formatDate(fromDate)}-sampai-${formatDate(toDate)}`;
        }

        XLSX.writeFile(workbook, `${filename}.xlsx`);
    };

    const exportPDF = () => {
        const doc = new jsPDF();
        const body = filteredData.map((row, index) => [
            index + 1,
            row.nama_penitip,
            row.nama_produk,
            formatRupiah(row.harga),
            row.stok_awal,
            row.sisa,
            row.jumlah_terjual,
            formatRupiah(row.total),
            // formatRupiah(row.laba),
            // formatRupiah(row.uang_kembali),
            new Date(row.created_at).toLocaleDateString('id-ID'),
        ]);

        body.push([
            '',
            '',
            '',
            '',
            '',
            '',
            'Total',
            formatRupiah(filteredData.reduce((sum, item) => sum + item.total, 0)),
            // formatRupiah(filteredData.reduce((sum, item) => sum + item.laba, 0)),
            // formatRupiah(filteredData.reduce((sum, item) => sum + item.uang_kembali, 0)),
            '',
        ]);

        autoTable(doc, {
            head: [columns.map((col) => col.header as string)],
            body,
        });

        let filename = 'laporan-rpl';
        if (fromDate && toDate) {
            const formatDate = (date: string) => {
                const [year, month, day] = date.split('-');
                return `${day}-${month}-${year}`;
            };
            filename += `-${formatDate(fromDate)}-sampai-${formatDate(toDate)}`;
        }

        doc.save(`${filename}.pdf`);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Laporan Penitip', href: '/laporan-penjualan-penitip' }]}>
            <Head title="Laporan Penitip" />
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
                        <span className="text-sm font-thin">Filter Tanggal:</span>
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="rounded border p-2 text-sm text-[#acabab]"
                        />
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="rounded border p-2 text-sm text-[#acabab]"
                        />
                    </div>
                </div>

                <div className="flex justify-between">
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setPageIndex(0);
                        }}
                        className="rounded border p-[1px] text-xs"
                    >
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
                                            className="cursor-pointer px-6 py-3 text-left text-sm font-medium text-gray-500 capitalize select-none"
                                        >
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {header.column.getIsSorted() ? (header.column.getIsSorted() === 'asc' ? ' ↑' : ' ↓') : ''}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {table.getRowModel().rows.map((row) => (
                                <tr key={row.id} className="capitalize">
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="px-6 py-4 text-sm whitespace-nowrap text-gray-700">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-gray-100">
                            <tr>
                                <td className="px-6 py-2 text-right text-sm font-semibold" colSpan={7}>
                                    Total
                                </td>
                                <td className="px-6 py-2 text-sm font-bold">
                                    {formatRupiah(filteredData.reduce((sum, item) => sum + item.total, 0))}
                                </td>
                                {/* <td className="px-6 py-2 text-sm font-bold">
                                    {formatRupiah(filteredData.reduce((sum, item) => sum + item.laba, 0))}
                                </td>
                                <td className="px-6 py-2 text-sm font-bold">
                                    {formatRupiah(filteredData.reduce((sum, item) => sum + item.uang_kembali, 0))}
                                </td> */}
                                <td></td>
                            </tr>
                        </tfoot>
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
