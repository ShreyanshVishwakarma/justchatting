"use client";

import {useRouter} from "next/navigation";
import { useEffect } from "react";

export const RedirectToHome = () => {
  const router = useRouter();
    useEffect(() => {
        router.push('/home');
    }, [router]);

  return (
      <div className="flex items-center justify-center h-full">
        </div>
  );
}

export default RedirectToHome;