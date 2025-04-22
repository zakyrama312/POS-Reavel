import React from 'react';
import ProductCard from './produk';

const ProductPage: React.FC = () => {
    return (
        <div className="flex h-screen gap-4 bg-gray-300 p-4">
            {/* KIRI: Daftar Produk */}
            <div className="flex-1 overflow-auto rounded-xl bg-white p-4">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {/* Loop Card di sini */}
                    {Array.from({ length: 19 }).map((_, i) => (
                        <ProductCard key={i} iconColor={i % 2 === 0 ? 'blue' : 'orange'} iconType={i % 2 === 0 ? 'coffee' : 'bag'} />
                    ))}
                </div>
            </div>

            {/* KANAN: Panel Keranjang */}
            <div className="w-[00px] rounded-xl bg-white p-4">
                <h2 className="mb-4 text-xl font-semibold">Keranjang</h2>
                {/* Daftar Item */}
                <div className="text-sm text-gray-500">Belum ada item.</div>
                {/* Nanti kamu bisa render daftar produk yang dipilih di sini */}
            </div>
        </div>
    );
};

export default ProductPage;
