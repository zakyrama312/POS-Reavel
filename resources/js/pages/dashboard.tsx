import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];
interface DashboardProps {
    totalPenjualan: number;
    jumlahTransaksi: number;
    jumlahProduk: number;
    jumlahPenitip: number;
    produkTerlaris: {
        nama_produk: string;
        total_terjual: number;
    } | null;
    grafikPenjualan: Array<{
        tanggal: string;
        total: number;
    }>;
}

export default function Dashboard({ totalPenjualan, jumlahTransaksi, jumlahProduk, jumlahPenitip, produkTerlaris, grafikPenjualan }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-5">
                    {/* Card Total Penjualan */}
                    <div className="rounded-xl border bg-white p-4 shadow-sm">
                        <h2 className="text-lg font-semibold">Total Penjualan</h2>
                        <p className="mt-2 text-2xl font-bold text-green-600">Rp {Number(totalPenjualan.toLocaleString('id-ID'))}</p>
                        <p className="text-sm text-gray-500">Bulan Ini</p>
                    </div>
                    {/* Card Jumlah Transaksi */}
                    <div className="rounded-xl border bg-white p-4 shadow-sm">
                        <h2 className="text-lg font-semibold">Jumlah Transaksi</h2>
                        <p className="mt-2 text-2xl font-bold text-blue-600">{jumlahTransaksi}</p>
                        <p className="text-sm text-gray-500">Bulan Ini</p>
                    </div>

                    {/* Card Produk Terlaris */}
                    <div className="rounded-xl border bg-white p-4 shadow-sm">
                        <h2 className="text-lg font-semibold">Produk Terlaris</h2>
                        {produkTerlaris ? (
                            <>
                                <p className="mt-2 text-2xl font-bold text-purple-600 capitalize">{produkTerlaris.nama_produk}</p>
                                <p className="text-sm text-gray-500">{produkTerlaris.total_terjual} pcs terjual</p>
                            </>
                        ) : (
                            <p className="mt-2 text-gray-500">Belum ada data</p>
                        )}
                    </div>

                    {/* Card Jumlah Produk */}
                    <div className="rounded-xl border bg-white p-4 shadow-sm">
                        <h2 className="text-lg font-semibold">Jumlah Produk</h2>
                        <p className="mt-2 text-2xl font-bold text-orange-600">{jumlahProduk}</p>
                        <p className="text-sm text-gray-500">Produk</p>
                    </div>

                    {/* Card Jumlah Penitip */}
                    <div className="rounded-xl border bg-white p-4 shadow-sm">
                        <h2 className="text-lg font-semibold">Jumlah Penitip</h2>
                        <p className="mt-2 text-2xl font-bold text-pink-600">{jumlahPenitip}</p>
                        <p className="text-sm text-gray-500">Orang</p>
                    </div>
                </div>

                {/* Grafik Penjualan
                <div className="mt-4 min-h-[300px] rounded-xl border bg-white p-4 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold">Grafik Penjualan Bulanan</h2>
                    <div className="relative min-h-[200px]">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div> */}
                {/* Grafik Penjualan */}
                <div className="mt-4 min-h-[500px] rounded-xl border bg-white p-4 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold">Grafik Penjualan Bulanan</h2>
                    <div className="relative min-h-[200px]">
                        {grafikPenjualan.length === 0 ? (
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        ) : (
                            <ResponsiveContainer width="100%" height={450}>
                                <LineChart data={grafikPenjualan}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="tanggal" tick={{ fontSize: 12 }} />
                                    <YAxis tickFormatter={(value) => `Rp ${value.toLocaleString('id-ID')}`} tick={{ fontSize: 12 }} />
                                    <Tooltip formatter={(value: number) => `Rp ${value.toLocaleString('id-ID')}`} />
                                    <Line type="monotone" dataKey="total" stroke="#16a34a" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
