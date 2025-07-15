import {useRouter} from "next/navigation";
import { useEffect } from "react";

export const RedirectToHome = () => {
  const router = useRouter();
    useEffect(() => {
        router.push('/home');
    }, [router]);
  return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-lg mb-6">Please sign in to continue.</p>
          <a href="/sign-in" className="text-blue-500 hover:underline">
            Sign In
          </a>
        </div>
      </div>
  );
}

export default RedirectToHome;