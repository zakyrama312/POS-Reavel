import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {/* Card Total Penjualan */}
                    <div className="rounded-xl border bg-white p-4 shadow-sm">
                        <h2 className="text-lg font-semibold">Total Penjualan</h2>
                        <p className="mt-2 text-2xl font-bold text-green-600">Rp 12.500.000</p>
                        <p className="text-sm text-gray-500">Bulan Ini</p>
                    </div>

                    {/* Card Jumlah Transaksi */}
                    <div className="rounded-xl border bg-white p-4 shadow-sm">
                        <h2 className="text-lg font-semibold">Jumlah Transaksi</h2>
                        <p className="mt-2 text-2xl font-bold text-blue-600">320</p>
                        <p className="text-sm text-gray-500">Bulan Ini</p>
                    </div>

                    {/* Card Produk Terlaris */}
                    <div className="rounded-xl border bg-white p-4 shadow-sm">
                        <h2 className="text-lg font-semibold">Produk Terlaris</h2>
                        <p className="mt-2 text-2xl font-bold text-purple-600">Minuman Botol</p>
                        <p className="text-sm text-gray-500">120 pcs terjual</p>
                    </div>
                </div>

                {/* Grafik Penjualan */}
                <div className="mt-4 min-h-[300px] rounded-xl border bg-white p-4 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold">Grafik Penjualan Bulanan</h2>
                    <div className="relative min-h-[200px]">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
