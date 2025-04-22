import { Coffee, ShoppingBag } from 'lucide-react';
import React from 'react';

type ProductCardProps = {
    iconColor?: 'blue' | 'orange';
    iconType?: 'coffee' | 'bag';
};

const ProductCard: React.FC<ProductCardProps> = ({ iconColor = 'blue', iconType = 'coffee' }) => {
    return (
        <div className="relative h-[130px] w-[230px] overflow-hidden rounded-xl border bg-white p-2 shadow-sm">
            {/* Badge Icon pojok kanan atas */}
            <div
                className={`absolute top-0 right-0 flex h-8 w-8 items-center justify-center rounded-bl-xl ${
                    iconColor === 'blue' ? 'bg-blue-400' : 'bg-orange-400'
                }`}
            >
                {iconType === 'coffee' ? <Coffee className="h-4 w-4 text-white" /> : <ShoppingBag className="h-4 w-4 text-white" />}
            </div>

            {/* Nama Penjual dan Nama Produk */}
            <div className="text-[10px] text-gray-500">Bu Lastri</div>
            <div className="text-sm font-semibold text-black">Bakpia kering coklat</div>

            {/* Bagian Bawah: stok + harga + tombol tambah */}
            <div className="absolute right-2 bottom-2 left-2 flex items-center justify-between">
                <div>
                    <div className="text-[10px] text-gray-500">stok 6</div>
                    <div className="text-sm font-semibold text-red-500">Rp.4500</div>
                </div>
                <div className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border border-red-500 text-xs text-red-500">
                    +
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
