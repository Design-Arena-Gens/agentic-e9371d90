"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Submission = {
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  gender: "male" | "female" | "other" | "";
  address: string;
  city: string;
  state: string;
  pincode: string;
  remarks: string;
  createdAt: string;
};

const STORAGE_KEY = "agentic_submissions";

function getSubmissionsFromStorage(): Submission[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Submission[]) : [];
  } catch {
    return [];
  }
}

function saveSubmissionLocally(submission: Submission) {
  if (typeof window === "undefined") return;
  const all = getSubmissionsFromStorage();
  all.unshift(submission);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export default function DataForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    remarks: "",
  });

  const isValid = useMemo(() => {
    const newErrors: Record<string, string> = {};

    if (!form.fullName.trim()) newErrors.fullName = "???? ??? ?????? ??";

    if (!form.email.trim()) newErrors.email = "???? ?????? ??";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) newErrors.email = "????? ???? ???? ????";

    if (!form.phone.trim()) newErrors.phone = "?????? ???? ?????? ??";
    else if (!/^\d{10}$/.test(form.phone)) newErrors.phone = "10 ????? ?? ???? ???? ????";

    if (!form.dob) newErrors.dob = "???? ???? ?????? ??";

    if (!form.gender) newErrors.gender = "???? ?????";

    if (!form.address.trim()) newErrors.address = "??? ?????? ??";

    if (!form.city.trim()) newErrors.city = "??? ?????? ??";

    if (!form.state.trim()) newErrors.state = "????? ?????? ??";

    if (!form.pincode.trim()) newErrors.pincode = "?????? ?????? ??";
    else if (!/^\d{6}$/.test(form.pincode)) newErrors.pincode = "6 ????? ?? ?????? ???? ????";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  useEffect(() => {
    // Warm localStorage to avoid first-write delay
    if (typeof window !== "undefined" && !localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || isSubmitting) return;
    setIsSubmitting(true);

    const payload: Submission = {
      ...form,
      createdAt: new Date().toISOString(),
    } as Submission;

    try {
      await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      saveSubmissionLocally(payload);
      router.push("/success");
    } catch (err) {
      // If network fails, still save locally
      saveSubmissionLocally(payload);
      router.push("/success");
    } finally {
      setIsSubmitting(false);
    }
  }

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function FieldError({ name }: { name: keyof typeof form }) {
    const msg = errors[name];
    if (!msg) return null;
    return <p className="mt-1 text-sm text-red-600">{msg}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-lg bg-white p-6 shadow">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium">???? ???</label>
          <input
            type="text"
            className="mt-1 w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            value={form.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            placeholder="???? ??? ?????"
          />
          <FieldError name="fullName" />
        </div>
        <div>
          <label className="block text-sm font-medium">????</label>
          <input
            type="email"
            className="mt-1 w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="example@domain.com"
          />
          <FieldError name="email" />
        </div>
        <div>
          <label className="block text-sm font-medium">?????? ????</label>
          <input
            type="tel"
            inputMode="numeric"
            className="mt-1 w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
            placeholder="10 ????? ?? ??????"
          />
          <FieldError name="phone" />
        </div>
        <div>
          <label className="block text-sm font-medium">???? ????</label>
          <input
            type="date"
            className="mt-1 w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            value={form.dob}
            onChange={(e) => update("dob", e.target.value)}
          />
          <FieldError name="dob" />
        </div>
        <div>
          <label className="block text-sm font-medium">????</label>
          <select
            className="mt-1 w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            value={form.gender}
            onChange={(e) => update("gender", e.target.value as any)}
          >
            <option value="">?????</option>
            <option value="male">?????</option>
            <option value="female">?????</option>
            <option value="other">????</option>
          </select>
          <FieldError name="gender" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium">???</label>
          <input
            type="text"
            className="mt-1 w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            value={form.address}
            onChange={(e) => update("address", e.target.value)}
            placeholder="?? ????, ???, ???????"
          />
          <FieldError name="address" />
        </div>
        <div>
          <label className="block text-sm font-medium">???</label>
          <input
            type="text"
            className="mt-1 w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            value={form.city}
            onChange={(e) => update("city", e.target.value)}
          />
          <FieldError name="city" />
        </div>
        <div>
          <label className="block text-sm font-medium">?????</label>
          <input
            type="text"
            className="mt-1 w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            value={form.state}
            onChange={(e) => update("state", e.target.value)}
          />
          <FieldError name="state" />
        </div>
        <div>
          <label className="block text-sm font-medium">??????</label>
          <input
            type="text"
            inputMode="numeric"
            className="mt-1 w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            value={form.pincode}
            onChange={(e) => update("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="6 ????? ?? ??????"
          />
          <FieldError name="pincode" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium">???????</label>
          <textarea
            className="mt-1 w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            rows={3}
            value={form.remarks}
            onChange={(e) => update("remarks", e.target.value)}
            placeholder="??? ??? ???????? ??????? ??"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">???? ??????? ???????? ?? (??????? ?? ??????)</p>
        <button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "??? ?? ??? ??..." : "??? ????"}
        </button>
      </div>
    </form>
  );
}
