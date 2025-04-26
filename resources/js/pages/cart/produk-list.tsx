import FlashAlert from '@/components/flashAlert';
import PointofSales from '@/components/pointofSales';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Link, router } from '@inertiajs/react';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { NumericFormat } from 'react-number-format';

interface Produk {
    id: number;
    nama_produk: string;
    harga: number;
    stok_masukSementara: number;
    stok_akhirSementara: number;
    kategori: { nama_kategori: string };
    penitip: { nama_penitip: string };
}

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

interface Props {
    produk: Produk[];
}

export default function POSPage({ produk: initialProduk }: Props) {
    const [produk, setProduk] = useState<Produk[]>(initialProduk);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [search, setSearch] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<Produk | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [bayar, setBayar] = useState(0);

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const kembali = bayar > total ? bayar - total : 0;

    const handleTransaksiSubmit = () => {
        if (cart.length === 0) {
            alert('Keranjang masih kosong!');
            return;
        }

        if (bayar < total) {
            alert('Pembayaran kurang dari total belanja');
            return;
        }

        const data = {
            total,
            bayar,
            kembali,
            cart: cart.map((item) => ({
                id: item.id,
                price: item.price,
                quantity: item.quantity,
            })),
        };

        router.post('/transaksi', data, {
            onSuccess: () => {
                setCart([]);
                setBayar(0);
            },
        });
    };

    const productsPerPage = 16;
    const filteredProducts = produk.filter(
        (p) =>
            p.nama_produk.toLowerCase().includes(search.toLowerCase()) ||
            p.penitip.nama_penitip.toLowerCase().includes(search.toLowerCase()) ||
            p.kategori.nama_kategori.toLowerCase().includes(search.toLowerCase()),
    );
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const paginatedProducts = filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

    const addToCart = () => {
        if (!selectedProduct) return;
        // Cek stok lokal
        if (quantity > selectedProduct.stok_akhirSementara) {
            setError('Stok tidak cukup');
            return;
        }
        // Tambah ke cart
        setCart((prev) => {
            const existing = prev.find((item) => item.id === selectedProduct.id);
            if (existing) {
                return prev.map((item) => (item.id === selectedProduct.id ? { ...item, quantity: item.quantity + quantity } : item));
            }
            return [
                ...prev,
                {
                    id: selectedProduct.id,
                    name: selectedProduct.nama_produk,
                    price: selectedProduct.harga,
                    quantity,
                },
            ];
        });
        // Kurangi stok di UI
        setProduk((prev) => prev.map((p) => (p.id === selectedProduct.id ? { ...p, stok_akhirSementara: p.stok_akhirSementara - quantity } : p)));
        // Reset modal
        setSelectedProduct(null);
        setQuantity(1);
        setError('');
    };

    const removeFromCart = (id: number) => {
        setCart((prevCart) => {
            const itemToRemove = prevCart.find((item) => item.id === id);
            // kembalikan stok ke produk UI jika item ditemukan
            if (itemToRemove) {
                setProduk((prevProduk) =>
                    prevProduk.map((p) => (p.id === id ? { ...p, stok_akhirSementara: p.stok_akhirSementara + itemToRemove.quantity } : p)),
                );
            }
            // hapus dari keranjang
            return prevCart.filter((item) => item.id !== id);
        });
    };

    // const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <>
            <PointofSales />
            <FlashAlert />
            <div className="flex flex-col gap-4 p-4 md:flex-row">
                <div className="flex-1 rounded-xl bg-white p-4 shadow">
                    <div className="mb-4 flex justify-between">
                        <input
                            type="text"
                            placeholder="Cari produk"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-2/3 rounded border p-2"
                        />
                        <div className="flex gap-2">
                            <Link
                                href="/produk-stok"
                                className="flex items-center gap-2 rounded-[8px] border bg-blue-500 px-4 py-2 text-base text-white hover:bg-blue-600"
                            >
                                <span>Kelola Produk</span>
                            </Link>
                            <Link
                                href="/transaksi-harian"
                                className="flex items-center gap-2 rounded-[8px] border bg-[#f75959ce] px-4 py-2 text-white hover:bg-red-500"
                            >
                                <span>Laporan Penjualan</span>
                            </Link>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {paginatedProducts.map((product) => (
                            <Card
                                key={product.id}
                                onClick={() => setSelectedProduct(product)}
                                className="cursor-pointer border px-2 py-2 transition hover:shadow-md"
                            >
                                <CardContent className="p-3">
                                    <div className="flex justify-between">
                                        <div className="font-semibold">{product.nama_produk}</div>
                                        <span
                                            className={`flex h-4 w-6 items-center justify-center rounded-full ${product.kategori.nama_kategori === 'Minuman' ? 'bg-blue-300' : 'bg-orange-300'}`}
                                        >
                                            {product.kategori.nama_kategori === 'Minuman' ? '☕' : '👜'}
                                        </span>
                                    </div>
                                    <span className="text-sm text-gray-500">{product.penitip.nama_penitip}</span>
                                    <div className="mt-4 flex">
                                        <span className="font-semibold text-red-500">Rp. {product.harga.toLocaleString()}</span>

                                        <span className={`ml-auto text-xs ${product.stok_akhirSementara === 0 ? 'text-red-500' : 'text-gray-500'}`}>
                                            {product.stok_akhirSementara === 0 ? 'Habis' : `${product.stok_akhirSementara} pcs`}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    {totalPages > 1 && (
                        <div className="mt-4 flex justify-center gap-2">
                            <Button variant="outline" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
                                Previous
                            </Button>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <Button key={i} variant={currentPage === i + 1 ? 'default' : 'outline'} onClick={() => setCurrentPage(i + 1)}>
                                    {i + 1}
                                </Button>
                            ))}
                            <Button
                                variant="outline"
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </div>
                <div className="w-full rounded-xl bg-white p-4 shadow md:w-1/3">
                    <h2 className="mb-4 flex items-center gap-2 font-semibold">
                        <ShoppingCart className="h-4 w-4" /> Keranjang
                    </h2>
                    <div className="space-y-2">
                        {cart.map((item) => (
                            <div key={item.id} className="flex items-center justify-between border-b pb-1">
                                <div>
                                    <div>{item.name}</div>
                                    <div className="text-sm text-gray-500">
                                        Rp. {item.price.toLocaleString()} x {item.quantity}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="text-sm font-semibold">Rp. {(item.price * item.quantity).toLocaleString()}</div>
                                    <button onClick={() => removeFromCart(item.id)} className="text-red-500">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 space-y-2 border-t pt-4 text-sm">
                        <div className="flex justify-between">
                            <span>Total</span>
                            <span className="font-bold">Rp. {total.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Bayar</span>
                            {/* <input
                                type="number"
                                value={bayar}
                                onChange={(e) => setBayar(Number(e.target.value))}
                                className="w-24 rounded border p-1"
                            /> */}
                            <NumericFormat
                                value={bayar}
                                thousandSeparator="."
                                decimalSeparator=","
                                prefix="Rp. "
                                onValueChange={(values: { floatValue?: number }) => {
                                    setBayar(values.floatValue || 0);
                                }}
                                className="w-24 rounded border p-1"
                            />
                        </div>
                        <div className="flex justify-between">
                            <span>Kembali</span>
                            <span>Rp. {kembali.toLocaleString()}</span>
                        </div>
                    </div>
                    <Button className="mt-4 w-full" onClick={handleTransaksiSubmit}>
                        Transaksi
                    </Button>
                </div>
                {selectedProduct && (
                    <Dialog open={true} onOpenChange={() => setSelectedProduct(null)}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{selectedProduct.nama_produk}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-2">
                                <label className="block text-sm">Jumlah</label>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    className="w-full rounded border p-2"
                                />
                                {error && <p className="text-sm text-red-500">{error}</p>}
                                <Button className="mt-2 w-full" onClick={addToCart}>
                                    Tambah ke Keranjang
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </>
    );
}
