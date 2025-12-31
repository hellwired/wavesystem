import { getSession } from '@/app/actions/logistica';
import AuditoriaClientLayout from './AuditoriaClientLayout';

export default async function AuditoriaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getSession();

    return (
        <AuditoriaClientLayout user={user}>
            {children}
        </AuditoriaClientLayout>
    );
}
