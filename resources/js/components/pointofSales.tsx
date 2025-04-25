import { Button } from '@/components/ui/button';

export default function PointofSales() {
    return (
        <div className="flex items-center justify-between border-b p-4">
            <h1 className="text-2xl font-semibold">Point of Sales</h1>
            <Button variant="outline" className="hidden md:block">
                Logout
            </Button>
        </div>
    );
}
