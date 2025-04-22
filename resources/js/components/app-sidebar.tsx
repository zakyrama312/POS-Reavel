import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Book, ChartColumnStacked, LayoutGrid, Package, User, Users } from 'lucide-react';
import AppLogo from './app-logo';

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
        title: 'Barang',
        href: '/barang',
        icon: Package,
    },
    {
        title: 'Kategori',
        href: '/kategori',
        icon: ChartColumnStacked,
    },
    {
        title: 'Pengguna',
        href: '/pengguna',
        icon: User,
    },
];

const transaksiNavItems: NavItem[] = [
    {
        title: 'Laporan Penjualan',
        href: '/laporan-penjualan',
        icon: Book,
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
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
                <NavMain label="Transaksi" items={transaksiNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
