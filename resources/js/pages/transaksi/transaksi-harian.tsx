import PointofSales from '@/components/pointofSales';
import { Link } from '@inertiajs/react';
import { Printer } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface TransaksiItem {
    id: number;
    nama_produk: string;
    harga: number;
    stok_awal: number;
    sisa: number;
    jumlah_terjual: number;
    total: number;
    laba: number;
    uang_kembali: number;
    nama_penitip: string;
}

interface Props {
    transaksi_items: TransaksiItem[];
}

export default function Harian({ transaksi_items }: Props) {
    const [data, setData] = useState<TransaksiItem[]>([]);

    useEffect(() => {
        setData(transaksi_items);
    }, [transaksi_items]);

    const groupedData = useMemo(() => {
        const groupMap = new Map<string, TransaksiItem>();

        transaksi_items.forEach((item) => {
            const key = `${item.nama_produk}-${item.nama_penitip}`;
            if (!groupMap.has(key)) {
                groupMap.set(key, { ...item });
            } else {
                const existing = groupMap.get(key)!;
                groupMap.set(key, {
                    ...existing,
                    jumlah_terjual: existing.jumlah_terjual + item.jumlah_terjual,
                    total: existing.total + item.total,
                    laba: existing.laba + item.laba,
                    uang_kembali: existing.uang_kembali + item.uang_kembali,
                    // stok_awal tetap ambil dari existing
                    // harga tetap ambil dari existing
                    // sisa kita update ambil dari item terakhir (yang sekarang)
                    sisa: existing.stok_awal - (existing.jumlah_terjual + item.jumlah_terjual),
                });
            }
        });

        return Array.from(groupMap.values());
    }, [transaksi_items]);

    const totalSemua = data.reduce((acc, item) => acc + item.total, 0);
    const totalLaba = data.reduce((acc, item) => acc + item.laba, 0);
    const totalUangKembali = data.reduce((acc, item) => acc + item.uang_kembali, 0);

    return (
        <>
            <PointofSales />
            <div className="p-4">
                <div className="rounded-xl bg-white p-4 shadow">
                    <div className="mb-4 flex items-center justify-between">
                        <Link href="/transaksi-harian-rpl" className="btn border-0 bg-[#d73fd7] shadow-none hover:bg-[#a056b2]">
                            RPL
                        </Link>
                        <div className="flex gap-1">
                            <Link href="/print-transaksi-harian" className="btn border-0 bg-[#f25353] shadow-none" title="Print Transaksi Harian">
                                <Printer />
                            </Link>
                            <Link href="/print-label-transaksi-harian" className="btn border-0 bg-[#f79a18] shadow-none" title="Print Label">
                                <Printer />
                            </Link>
                        </div>
                    </div>
                    <div className="mb-4 flex items-center justify-between">
                        <h1 className="text-2xl font-bold">Transaksi Harian</h1>
                        <p className="font-tiny text-lg text-gray-600">
                            {new Date().toLocaleDateString('id-ID', {
                                weekday: 'long',
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                            })}
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full table-auto border text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border px-2 py-1">No</th>
                                    <th className="border px-2 py-1">Produk</th>
                                    <th className="border px-2 py-1">Harga</th>
                                    <th className="border px-2 py-1">Stok Awal</th>
                                    <th className="border px-2 py-1">Sisa</th>
                                    <th className="border px-2 py-1">Terjual</th>
                                    <th className="border px-2 py-1">Total</th>
                                    <th className="border px-2 py-1">Laba</th>
                                    <th className="border px-2 py-1">Uang Kembali</th>
                                    <th className="border px-2 py-1">Penitip</th>
                                </tr>
                            </thead>
                            <tbody>
                                {groupedData.map((item, index) => (
                                    <tr key={index}>
                                        <td className="border px-2 py-1 text-center">{index + 1}</td>
                                        <td className="border px-2 py-1">{item.nama_produk}</td>
                                        <td className="border px-2 py-1 text-right">Rp {item.harga.toLocaleString()}</td>
                                        <td className="border px-2 py-1 text-center">{item.stok_awal}</td>
                                        <td className="border px-2 py-1 text-center">{item.sisa}</td>
                                        <td className="border px-2 py-1 text-center">{item.jumlah_terjual}</td>
                                        <td className="border px-2 py-1 text-right">Rp {item.total.toLocaleString()}</td>
                                        <td className="border px-2 py-1 text-right">Rp {item.laba.toLocaleString()}</td>
                                        <td className="border px-2 py-1 text-right">Rp {item.uang_kembali.toLocaleString()}</td>
                                        <td className="border px-2 py-1">{item.nama_penitip}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-gray-200 font-semibold">
                                <tr>
                                    <td colSpan={6} className="border px-2 py-1 text-center">
                                        Total
                                    </td>
                                    <td className="border px-2 py-1 text-right text-green-600">Rp {totalSemua.toLocaleString()}</td>
                                    <td className="border px-2 py-1 text-right text-blue-600">Rp {totalLaba.toLocaleString()}</td>
                                    <td className="border px-2 py-1 text-right text-orange-600">Rp {totalUangKembali.toLocaleString()}</td>
                                    <td className="border px-2 py-1"></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
