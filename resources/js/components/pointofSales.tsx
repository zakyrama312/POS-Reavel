import { Link } from '@inertiajs/react';

export default function PointofSales() {
    return (
        <div className="flex items-center justify-between border-b p-4">
            <Link href="/point-of-sales">
                <h1 className="text-2xl font-semibold">Point of Sales</h1>
            </Link>
            <Link
                href="/dashboard"
                className="hidden rounded-md border bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300 md:block"
            >
                Dashboard
            </Link>
        </div>
    );
}
