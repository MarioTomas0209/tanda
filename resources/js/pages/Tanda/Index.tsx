import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface Props { }

export default function Index({ }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Index" />

        </AppLayout>
    );
}