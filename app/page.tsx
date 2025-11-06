import Link from 'next/link';
import DataForm from './components/DataForm';

export default function Page() {
  return (
    <main>
      <DataForm />
      <div className="mt-6 flex gap-4">
        <Link className="text-blue-600 hover:underline" href="/data">
          ????? ??? ???? ?????
        </Link>
      </div>
    </main>
  );
}
