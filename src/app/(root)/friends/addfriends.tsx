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
                <div className="p-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                    <UserPlus className="w-5 h-5" />
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md max-w-[90vw] bg-card/95 backdrop-blur-xl border border-border shadow-2xl rounded-2xl">
                <DialogHeader className="space-y-2">
                    <DialogTitle className="text-xl font-bold text-primary">
                        Add a Friend
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground text-sm">
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
                                    <FormLabel className="text-sm font-semibold">Email Address</FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="friend@example.com" 
                                            {...field} 
                                            className="h-10 bg-background border border-border rounded-lg shadow-lg focus:shadow-xl focus:border-primary transition-all duration-300"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button 
                            type="submit" 
                            className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            Send Friend Request
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
