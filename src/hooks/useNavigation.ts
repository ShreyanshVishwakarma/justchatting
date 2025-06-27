import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { MessageSquare, Users } from "lucide-react"; // Example icons

export function useNavingation(){
    const path = usePathname();
    const paths = useMemo(() => [
        { label: "Chats", icon: MessageSquare, href: "/conversations" ,active: path.startsWith("/conversations")},
          { label: "Friends", icon: Users, href: "/friends" , active: path.startsWith("/friends") },
    ],[path])

    return paths
}