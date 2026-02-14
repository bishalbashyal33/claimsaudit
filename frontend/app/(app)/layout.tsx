import Sidebar from "../components/Sidebar";

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />
            <main className="flex-1 ml-[260px] p-10 min-h-screen">
                {children}
            </main>
        </div>
    );
}
