"use client";
import { useState, useEffect } from "react";
import { StudentData } from "@/types/student";

export function useStudentData() {
  const [data, setData] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/me")
      .then((r) => {
        if (r.status === 401) { window.location.href = "/"; return null; }
        return r.json();
      })
      .then((d) => {
        if (d && d.error) setError(d.error);
        else if (d) setData(d);
      })
      .catch(() => setError("데이터를 불러올 수 없습니다."))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
