import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-gray-600">페이지를 찾을 수 없습니다.</p>
      <Link href="/" className="text-blue-600 underline hover:text-blue-800">
        홈으로 돌아가기
      </Link>
    </div>
  );
}
