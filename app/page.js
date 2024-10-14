import HomePage from '../components/HomePage';
export const runtime = 'edge';
export default function Home() {
  return (
    <div className="relative w-full flex justify-center rounded-lg">
      <main className="flex items-start justify-center sm:rounded-3xl overflow-hidden z-50 h-fit w-full">
        <HomePage />
      </main>
    </div>
  );
}
