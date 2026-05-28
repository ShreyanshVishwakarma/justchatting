"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormField, FormItem, FormControl, FormMessage, FormLabel } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import {z} from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";

const addFriendSchema = z.object({
    email: z.string().email("Invalid email address"),
})

export const AddFriend= () => {
    const createRequest = useMutation(api.request.createRequest)

    const form = useForm<z.infer<typeof addFriendSchema>>({
        resolver: zodResolver(addFriendSchema),
        defaultValues: {
            email: "",
        },
    })

    const onSubmit = async (values: z.infer<typeof addFriendSchema>) => {
        try {
            await createRequest({ email: values.email });
            toast.success("Friend request sent!");
            form.reset();
        } catch (error) {
            toast.error("Failed to send friend request.");
        }
    }

    return(
        <Dialog>
            <DialogTrigger asChild>
                <div className="p-3 bg-[#ffeb3b] text-foreground border-[3px] border-border cursor-pointer transition-all duration-200 hover:-translate-y-1 block shadow-[4px_4px_0_0_#2d2d2d] hover:shadow-[6px_6px_0_0_#2d2d2d]" style={{ borderRadius: "var(--radius-wobbly-sm)" }}>
                    <UserPlus className="w-5 h-5" />
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md max-w-[90vw] bg-white border-[3px] border-border shadow-[8px_8px_0_0_#2d2d2d] rotate-[1deg]" style={{ borderRadius: "var(--radius-wobbly)" }}>
                <DialogHeader className="space-y-2">
                    <DialogTitle className="text-3xl font-[family-name:var(--font-kalam)] font-bold text-foreground">
                        Add a Friend
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground text-lg font-[family-name:var(--font-patrick-hand)]">
                        Send a friend request by entering their email address and start connecting.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xl font-[family-name:var(--font-kalam)] font-bold">Email Address</FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="friend@example.com" 
                                            {...field} 
                                            className="h-12 bg-white border-[3px] border-border shadow-[4px_4px_0_0_#2d2d2d] focus-visible:ring-0 focus-visible:ring-offset-0 focus:translate-x-1 focus:translate-y-1 focus:shadow-[2px_2px_0_0_#2d2d2d] transition-all duration-300 font-[family-name:var(--font-patrick-hand)] text-lg" style={{ borderRadius: "var(--radius-wobbly-sm)" }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button 
                            type="submit" 
                            className="w-full h-12 bg-[#ffeb3b] hover:bg-[#ffeb3b]/90 text-foreground font-[family-name:var(--font-patrick-hand)] text-xl border-[3px] border-border shadow-[4px_4px_0_0_#2d2d2d] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#2d2d2d] transition-all duration-200 rotate-[-1deg]" style={{ borderRadius: "var(--radius-wobbly-sm)" }}
                        >
                            Send Friend Request
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
