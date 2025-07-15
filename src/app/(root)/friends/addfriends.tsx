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
                <UserPlus className="cursor-pointer text-muted-foreground hover:text-primary transition-colors" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-md max-w-[90vw] top-[10%] md:top-[50%] translate-y-0 md:-translate-y-1/2">
                <DialogHeader>
                    <DialogTitle>Add a Friend</DialogTitle>
                    <DialogDescription>
                        Send a friend request by entering their email address.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="friend@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full">Send Request</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
