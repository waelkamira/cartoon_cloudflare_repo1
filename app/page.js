import HomePage from '../components/HomePage';
export default function Home() {
  return (
    <div className="relative flex justify-center items-center rounded-lg mt-20 sm:px-8">
      <main className="flex items-center justify-center sm:rounded-3xl overflow-hidden h-fit">
        <HomePage />
      </main>
    </div>
  );
}
