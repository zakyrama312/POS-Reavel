import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Book, ChartColumnStacked, LayoutGrid, Package, ShoppingCartIcon, User, Users } from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { props } = usePage<SharedData>();
    const user = props.auth.user;

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
    ];

    const manajemenData: NavItem[] = [
        {
            title: 'Penitip',
            href: '/penitip',
            icon: Users,
        },
        {
            title: 'Kategori',
            href: '/kategori',
            icon: ChartColumnStacked,
        },
        {
            title: 'Produk',
            href: '/produk',
            icon: Package,
        },
        ...(user?.role === 'admin'
            ? [
                  {
                      title: 'Pengguna',
                      href: '/pengguna',
                      icon: User,
                  },
              ]
            : []),
        {
            title: 'Point of Sales',
            href: '/point-of-sales',
            icon: ShoppingCartIcon,
        },
    ];

    const transaksiNavItems: NavItem[] = [
        ...(user?.role === 'admin'
            ? [
                  {
                      title: 'Laporan Penjualan',
                      href: '/laporan-penjualan',
                      icon: Book,
                  },
              ]
            : []),
    ];

    const footerNavItems: NavItem[] = [];
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain label="Main" items={mainNavItems} />
                <NavMain label="Manajemen Data" items={manajemenData} />
                <NavMain label={user?.role === 'admin' ? 'Transaksi' : ''} items={transaksiNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
