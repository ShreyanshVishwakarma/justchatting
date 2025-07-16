import {useRouter} from "next/navigation";
import { useEffect } from "react";

export const RedirectToHome = () => {
  const router = useRouter();
    useEffect(() => {
        router.push('/');
    }, [router]);
  return (
      <div className="flex items-center justify-center h-full">
        </div>
  );
}

export default RedirectToHome;