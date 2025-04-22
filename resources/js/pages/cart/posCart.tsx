import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { useState } from 'react';

const dummyProducts = [
    // Tambahkan lebih dari 12 produk agar pagination aktif
    { id: 1, name: 'Es serut', price: 4500, stock: 6, category: 'Minuman', creator: 'RPL' },
    { id: 2, name: 'Kerupuk pedas', price: 4500, stock: 6, category: 'Makanan', creator: 'Zaky' },
    { id: 3, name: 'Good day kecil', price: 3500, stock: 6, category: 'Minuman', creator: 'RPL' },
    { id: 4, name: 'Piscek enak', price: 4500, stock: 6, category: 'Makanan', creator: 'Bu Lastri' },
    { id: 5, name: 'Teh Hijau', price: 2000, stock: 6, category: 'Minuman', creator: 'Asri' },
    { id: 6, name: 'Donut', price: 3000, stock: 6, category: 'Makanan', creator: 'Lili' },
    { id: 7, name: 'Drink bang bang', price: 4500, stock: 6, category: 'Minuman', creator: 'RPL' },
    { id: 8, name: 'Bakpia kering coklat', price: 4500, stock: 6, category: 'Makanan', creator: 'Bu Lastri' },
    { id: 9, name: 'Chitato', price: 5000, stock: 6, category: 'Makanan', creator: 'Zaky' },
    { id: 10, name: 'Fanta', price: 4500, stock: 6, category: 'Minuman', creator: 'RPL' },
    { id: 11, name: 'Sprite', price: 4500, stock: 6, category: 'Minuman', creator: 'RPL' },
    { id: 12, name: 'Pop Mie', price: 6000, stock: 6, category: 'Makanan', creator: 'Asri' },
    { id: 13, name: 'Kacang Garuda', price: 3500, stock: 6, category: 'Makanan', creator: 'Lili' },
];

export default function POSPage() {
    const [cart, setCart] = useState<{ id: number; name: string; price: number; quantity: number }[]>([]);
    const [search, setSearch] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<(typeof dummyProducts)[0] | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const productsPerPage = 12;
    const filteredProducts = dummyProducts.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const paginatedProducts = filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

    const addToCart = () => {
        if (!selectedProduct) return;
        if (quantity > selectedProduct.stock) {
            setError('Stok tidak cukup');
            return;
        }
        setCart((prev) => {
            const existing = prev.find((item) => item.id === selectedProduct.id);
            if (existing) {
                return prev.map((item) => (item.id === selectedProduct.id ? { ...item, quantity: item.quantity + quantity } : item));
            } else {
                return [...prev, { id: selectedProduct.id, name: selectedProduct.name, price: selectedProduct.price, quantity }];
            }
        });
        setSelectedProduct(null);
        setQuantity(1);
        setError('');
    };

    const removeFromCart = (id: number) => {
        setCart(cart.filter((item) => item.id !== id));
    };

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="flex flex-col gap-4 p-4 md:flex-row">
            {/* Product List */}
            <div className="flex-1 rounded-xl bg-white p-4 shadow">
                <input
                    type="text"
                    placeholder="Cari produk"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mb-4 w-full rounded border p-2"
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {paginatedProducts.map((product) => (
                        <Card
                            key={product.id}
                            onClick={() => setSelectedProduct(product)}
                            className="cursor-pointer border px-2 py-2 transition hover:shadow-md"
                        >
                            <CardContent className="p-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">{product.creator}</span>
                                    <span
                                        className={`flex h-4 w-6 items-center justify-center rounded-full ${product.category === 'Minuman' ? 'bg-blue-300' : 'bg-orange-300'}`}
                                    >
                                        {product.category === 'Minuman' ? '☕' : '👜'}
                                    </span>
                                </div>
                                <div className="font-semibold">{product.name}</div>
                                <div className="mt-4 flex">
                                    <span className="font-semibold text-red-500">Rp. {product.price.toLocaleString()}</span>
                                    <span className="ml-auto text-xs text-gray-500">{product.stock} pcs</span>
                                </div>
                                {/* <div className="mt-3 text-xs text-gray-500">stok {product.stock}</div>
                                <div className="font-semibold text-red-500">Rp. {product.price.toLocaleString()}</div> */}
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

            {/* Cart */}
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
                    <div className="flex justify-between">
                        <span>Bayar</span>
                        <input type="number" className="w-24 rounded border p-1" />
                    </div>
                    <div className="flex justify-between">
                        <span>Kembali</span>
                        <span>Rp. 0</span>
                    </div>
                </div>

                <Button className="mt-4 w-full bg-red-400 hover:bg-red-500">Transaksi</Button>
            </div>

            {/* Modal */}
            {selectedProduct && (
                <Dialog open={true} onOpenChange={() => setSelectedProduct(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{selectedProduct.name}</DialogTitle>
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
    );
}
