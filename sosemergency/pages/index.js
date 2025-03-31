import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Welcome to SOS</h1>
      <p className="text-gray-600 mb-4">Tap below to log in or register.</p>

      <button
        onClick={() => router.push("/auth")}
        className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-700 transition"
      >
        Go to Login/Register
      </button>
    </div>
  );
}
