"use client";

import dynamic from "next/dynamic";

const AdminQuestions = dynamic(() => import("@/components/admin/admin-questions").then((mod) => mod.AdminQuestions), {
  loading: () => (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="size-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
    </div>
  ),
});

export default function AdminQuestionsPage() {
  return <AdminQuestions />;
}
