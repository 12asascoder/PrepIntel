import Sidebar from './Sidebar';

export default function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar />
      <main className="ml-[220px] flex-1 p-6 lg:p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
