import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import '../css/app.css';
import { initializeTheme } from './hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        // Ini komponen lokal, nggak perlu bikin file terpisah
        function RootWrapper() {
            useEffect(() => {
                if (document.querySelector('script[src*="snap.js"]')) {
                    return;
                }

                const script = document.createElement('script');
                script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
                script.setAttribute('data-client-key', import.meta.env.VITE_MIDTRANS_CLIENT_KEY);

                script.onload = () => {
                    console.log('Midtrans Snap loaded');
                };

                document.body.appendChild(script);

                return () => {
                    const existingScript = document.querySelector('script[src*="snap.js"]');
                    if (existingScript) {
                        document.body.removeChild(existingScript);
                    }
                };
            }, []);

            return <App {...props} />;
        }

        root.render(<RootWrapper />);
    },
    progress: {
        color: '#4B5563',
    },
});

initializeTheme();
