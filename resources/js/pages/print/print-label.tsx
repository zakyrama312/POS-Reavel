import { useEffect, useMemo } from 'react';

interface PrintLabel {
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
    labels: PrintLabel[];
}
export default function PrintLabel({ labels }: Props) {
    useEffect(() => {
        if (labels.length > 0) {
            window.print();
        }
    }, [labels]);

    const groupedData = useMemo(() => {
        const groupMap = new Map<string, PrintLabel>();

        labels.forEach((item) => {
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
                    sisa: existing.stok_awal - (existing.jumlah_terjual + item.jumlah_terjual),
                });
            }
        });

        return Array.from(groupMap.values());
    }, [labels]);

    return (
        <div className="print-label-page p-4">
            <div className="grid grid-cols-4 gap-4">
                {groupedData.map((label) => (
                    <div key={label.id} className="border p-4">
                        <h5 className="text-lg font-semibold capitalize">{label.nama_produk}</h5>
                        <p className="text-sm capitalize">{label.nama_penitip}</p>
                        <div className="mt-4 flex justify-between">
                            <p className="text-sm font-thin text-red-500">sisa {label.sisa}</p>
                            <p className="text-sm font-bold">Rp. {label.uang_kembali.toLocaleString('id-ID')}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
