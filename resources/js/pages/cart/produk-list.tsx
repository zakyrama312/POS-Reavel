import FlashAlert from '@/components/flashAlert';
import PointofSales from '@/components/pointofSales';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import { Coffee, Popcorn, ShoppingCart, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
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
    penitip: string;
    price: number;
    quantity: number;
}

interface Props {
    produk: Produk[];
}

export default function POSPage({ produk: initialProduk }: Props) {
    const [cart, setCart] = useState<CartItem[]>(() => {
        try {
            const storedCart = localStorage.getItem('cart');
            return storedCart ? JSON.parse(storedCart) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const [search, setSearch] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<Produk | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [metodeBayar, setMetodeBayar] = useState<'cash' | 'transfer'>('cash');

    const [bayar, setBayar] = useState(0);
    const [showPembayaran, setShowPembayaran] = useState(false);

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const kembali = bayar > total ? bayar - total : 0;

    const displayedProduk = useMemo(() => {
        const cartQtyMap = cart.reduce<Record<number, number>>((acc, it) => {
            acc[it.id] = (acc[it.id] || 0) + it.quantity;
            return acc;
        }, {});
        return initialProduk.map((p) => {
            const reserved = cartQtyMap[p.id] || 0;
            const computed = p.stok_akhirSementara - reserved;
            return {
                ...p,
                stok_akhirSementara: computed >= 0 ? computed : 0,
            };
        });
    }, [initialProduk, cart]);

    const handleTransaksiSubmit = async () => {
        if (cart.length === 0) {
            alert('Keranjang masih kosong!');
            return;
        }

        if (bayar < total && metodeBayar === 'cash') {
            alert('Pembayaran kurang dari total belanja');
            return;
        }

        // kalau metode cash → langsung kirim ke server
        if (metodeBayar === 'cash') {
            router.post(
                '/transaksi',
                {
                    total,
                    bayar,
                    kembali,
                    metode: metodeBayar,
                    cart: cart.map((item) => ({
                        id: item.id,

                        price: item.price,
                        quantity: item.quantity,
                    })),
                },
                {
                    onSuccess: () => {
                        setCart([]);
                        setBayar(0);
                        localStorage.removeItem('cart');
                    },
                },
            );
            return;
        }

        // kalau metode transfer → panggil Snap Midtrans
        try {
            const response = await axios.post('/midtrans/token', {
                total,
                cart: cart.map((item) => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                })),
            });

            const token = response.data.snapToken;

            // popup Snap Midtrans
            window.snap.pay(token, {
                onSuccess: function (result: any) {
                    console.log('Success:', result);
                    router.post('/transaksi', {
                        total,
                        bayar: total,
                        kembali: 0,
                        metode: metodeBayar,
                        cart: cart.map((item) => ({
                            id: item.id,
                            price: item.price,
                            quantity: item.quantity,
                        })),
                        midtrans_result: result,
                    });
                    setCart([]);
                    localStorage.removeItem('cart');
                },
                onPending: function (result: any) {
                    console.log('Pending:', result);
                    alert('Transaksi dalam proses. Silakan selesaikan pembayaran.');
                },
                onError: function (error: any) {
                    console.error('Error:', error);
                    alert('Terjadi kesalahan dalam pembayaran.');
                },
                onClose: function () {
                    console.log('Popup ditutup oleh user');
                },
            });
        } catch (error) {
            console.error(error);
            alert('Gagal mendapatkan token Midtrans.');
        }
    };

    // const handleTransaksiSubmit = () => {
    //     if (cart.length === 0) {
    //         alert('Keranjang masih kosong!');
    //         return;
    //     }

    //     if (bayar < total) {
    //         alert('Pembayaran kurang dari total belanja');
    //         return;
    //     }

    //     const data = {
    //         total,
    //         bayar,
    //         kembali,
    //         metode,
    //         cart: cart.map((item) => ({
    //             id: item.id,
    //             price: item.price,
    //             quantity: item.quantity,
    //         })),
    //     };

    //     router.post('/transaksi', data, {
    //         onSuccess: () => {
    //             setCart([]);
    //             setBayar(0);
    //             setMetode('');
    //             setShowPembayaran(false);
    //             localStorage.removeItem('cart');
    //         },
    //     });
    // };

    const addToCart = () => {
        if (!selectedProduct) return;

        if (quantity > selectedProduct.stok_akhirSementara) {
            setError('Stok tidak cukup');
            return;
        }

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
                    penitip: selectedProduct.penitip.nama_penitip,
                    price: selectedProduct.harga,
                    quantity,
                },
            ];
        });

        setSelectedProduct(null);
        setQuantity(1);
        setError('');
    };

    const removeFromCart = (id: number) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    };

    const productsPerPage = 16;
    const filteredProducts = displayedProduk.filter(
        (p) =>
            p.nama_produk.toLowerCase().includes(search.toLowerCase()) ||
            p.penitip.nama_penitip.toLowerCase().includes(search.toLowerCase()) ||
            p.kategori.nama_kategori.toLowerCase().includes(search.toLowerCase()),
    );
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const sortedProducts = filteredProducts.slice().sort((a, b) => b.stok_akhirSementara - a.stok_akhirSementara);
    const paginatedProducts = sortedProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

    return (
        <>
            <Head title="Point of Sales" />
            <PointofSales />
            <FlashAlert />
            <div className="flex flex-col gap-4 p-4 md:flex-row">
                {/* === Produk List === */}
                <div className="flex-1 rounded-xl bg-white p-4 shadow">
                    {/* Search + Buttons */}
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

                    {/* Grid Produk */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {paginatedProducts.map((product) => (
                            <Card
                                key={product.id}
                                onClick={() => setSelectedProduct(product)}
                                className="cursor-pointer border px-2 py-2 transition hover:shadow-md"
                            >
                                <CardContent className="p-3">
                                    <div className="flex justify-between">
                                        <div className="font-semibold capitalize">{product.nama_produk}</div>
                                        <span
                                            className={`flex h-4 w-6 items-center justify-center rounded ${
                                                product.kategori.nama_kategori === 'Minuman' ? 'text-[#279fef]' : 'text-[#d7900c]'
                                            }`}
                                        >
                                            {product.kategori.nama_kategori === 'Minuman' ? <Coffee /> : <Popcorn />}
                                        </span>
                                    </div>
                                    <span className="font-sans text-xs text-gray-500">{product.penitip.nama_penitip}</span>
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

                    {/* Pagination */}
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

                {/* === Keranjang === */}
                <div className="w-full rounded-xl bg-white p-4 shadow md:w-1/3">
                    <h2 className="mb-4 flex items-center gap-2 font-semibold">
                        <ShoppingCart className="h-4 w-4" /> Keranjang
                    </h2>
                    <div className="space-y-2">
                        {cart.map((item) => (
                            <div key={item.id} className="flex items-center justify-between border-b pb-1">
                                <div>
                                    <div className="capitalize">
                                        {item.name} - {item.penitip}
                                    </div>
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
                    </div>

                    <Button className="mt-4 w-full" onClick={() => setShowPembayaran(true)}>
                        Transaksi
                    </Button>
                </div>
            </div>

            {/* === Modal Pembayaran === */}
            <Dialog open={showPembayaran} onOpenChange={setShowPembayaran}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Pembayaran</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Total Pembayaran</span>
                            <span className="text-lg font-semibold text-black">Rp {total.toLocaleString()}</span>
                        </div>

                        <div>
                            <span className="text-sm text-gray-600">Metode Pembayaran</span>
                            <div className="mt-2 grid grid-cols-2 gap-2">
                                {['cash', 'transfer'].map((m) => (
                                    <Button
                                        key={m}
                                        variant={metodeBayar === m ? 'default' : 'outline'}
                                        onClick={() => setMetodeBayar(m as 'cash' | 'transfer')}
                                        className="w-full capitalize"
                                    >
                                        {m}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-sm text-gray-600">Jumlah Dibayar</label>
                            <NumericFormat
                                value={bayar}
                                thousandSeparator="."
                                decimalSeparator=","
                                prefix="Rp "
                                onValueChange={(values: { floatValue?: number }) => setBayar(values.floatValue || 0)}
                                className="mt-1 w-full rounded border p-2"
                            />
                        </div>

                        <div className="flex justify-between border-t pt-2 text-sm">
                            <span>Kembalian</span>
                            <span className="font-semibold text-green-600">Rp {kembali.toLocaleString()}</span>
                        </div>

                        <div className="flex justify-end gap-2 pt-3">
                            <Button variant="outline" onClick={() => setShowPembayaran(false)}>
                                Batal
                            </Button>
                            <Button onClick={handleTransaksiSubmit}>Proses Pembayaran</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Modal Tambah ke Keranjang */}
            {selectedProduct && (
                <Dialog open={true} onOpenChange={() => setSelectedProduct(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="mt-3 flex justify-between">
                                <div className="flex flex-col">
                                    <span className="font-medium capitalize">{selectedProduct.nama_produk}</span>
                                    <span className="mt-1 text-sm font-light text-gray-600">{selectedProduct.penitip.nama_penitip}</span>
                                </div>
                                <span className="text-sm text-gray-500">
                                    {selectedProduct.stok_akhirSementara === 0 ? 'Habis' : `${selectedProduct.stok_akhirSementara} pcs`}
                                </span>
                            </DialogTitle>
                        </DialogHeader>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                addToCart();
                            }}
                            className="space-y-2"
                        >
                            <label className="block text-sm">Jumlah</label>
                            <input
                                type="number"
                                value={quantity === 0 ? '' : quantity}
                                min={0}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setQuantity(val === '' ? 0 : Math.max(Number(val), 0));
                                }}
                                className="w-full rounded border p-2"
                            />

                            {error && <p className="text-sm text-red-500">{error}</p>}
                            <Button className="mt-2 w-full">Tambah ke Keranjang</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}
