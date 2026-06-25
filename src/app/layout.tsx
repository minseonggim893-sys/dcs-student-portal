import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "대전도시과학고 학생 포털",
  description: "대전도시과학고 학생 포털 — 평가·생기부·프로젝트·상담",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
