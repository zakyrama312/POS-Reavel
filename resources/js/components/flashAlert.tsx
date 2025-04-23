import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import Swal from 'sweetalert2';

// Tentukan tipe untuk flash message
interface FlashProps {
    flash: {
        success?: string;
        error?: string;
    };
}

export default function FlashAlert() {
    const { props } = usePage<FlashProps>();
    const flash = props.flash;

    useEffect(() => {
        if (flash.success) {
            Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: flash.success,
                timer: 2000,
                showConfirmButton: false,
            });
        } else if (flash.error) {
            Swal.fire({
                icon: 'error',
                title: 'Gagal',
                text: flash.error,
                timer: 3000,
                showConfirmButton: false,
            });
        }
    }, [flash]);

    return null;
}
