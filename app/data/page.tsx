"use client";

import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'agentic_submissions';

type Submission = {
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  remarks: string;
  createdAt: string;
};

export default function DataPage() {
  const [data, setData] = useState<Submission[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setData(raw ? (JSON.parse(raw) as Submission[]) : []);
    } catch {
      setData([]);
    }
  }, []);

  const downloadJsonHref = useMemo(() => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    return URL.createObjectURL(blob);
  }, [data]);

  function clearAll() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    setData([]);
  }

  return (
    <main className="rounded-lg bg-white p-6 shadow">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">????? ??? ????</h2>
        <div className="flex gap-3">
          <a
            className="rounded bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700"
            href={downloadJsonHref}
            download="submissions.json"
          >
            JSON ??????? ????
          </a>
          <button
            onClick={clearAll}
            className="rounded bg-gray-200 px-3 py-1.5 text-gray-800 hover:bg-gray-300"
          >
            ?? ??? ????
          </button>
        </div>
      </div>

      {data.length === 0 ? (
        <p className="text-gray-600">??? ??? ???? ?????? ???? ???</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1 text-left">???</th>
                <th className="border px-2 py-1 text-left">????</th>
                <th className="border px-2 py-1 text-left">??????</th>
                <th className="border px-2 py-1 text-left">???? ????</th>
                <th className="border px-2 py-1 text-left">????</th>
                <th className="border px-2 py-1 text-left">???</th>
                <th className="border px-2 py-1 text-left">?????</th>
                <th className="border px-2 py-1 text-left">??????</th>
                <th className="border px-2 py-1 text-left">???????</th>
                <th className="border px-2 py-1 text-left">???</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d, i) => (
                <tr key={i} className="even:bg-gray-50">
                  <td className="border px-2 py-1">{d.fullName}</td>
                  <td className="border px-2 py-1">{d.email}</td>
                  <td className="border px-2 py-1">{d.phone}</td>
                  <td className="border px-2 py-1">{d.dob}</td>
                  <td className="border px-2 py-1">{d.gender}</td>
                  <td className="border px-2 py-1">{d.city}</td>
                  <td className="border px-2 py-1">{d.state}</td>
                  <td className="border px-2 py-1">{d.pincode}</td>
                  <td className="border px-2 py-1">{d.remarks}</td>
                  <td className="border px-2 py-1">{new Date(d.createdAt).toLocaleString('hi-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
