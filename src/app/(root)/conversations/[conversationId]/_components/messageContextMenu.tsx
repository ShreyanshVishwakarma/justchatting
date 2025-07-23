import { Button } from "@/components/ui/button"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Pencil, Copy, Trash2, Reply } from "lucide-react"

interface MessageContextMenuProps {
  children: React.ReactNode
  onEdit?: () => void
  onCopy?: () => void
  onHardDelete?: () => void
  onSoftDelete?: () => void
  onReply?: () => void
}

export default function MessageContextMenu({
  children,
  onEdit,
  onCopy,
  onHardDelete,
  onSoftDelete,
  onReply,
}: MessageContextMenuProps) {
  return (
    <Dialog>
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onSelect={onEdit} aria-label="Edit message">
          <Pencil className="mr-2 h-4 w-4" /> Edit
        </ContextMenuItem>
        <ContextMenuItem onSelect={onCopy} aria-label="Copy message">
          <Copy className="mr-2 h-4 w-4" /> Copy
        </ContextMenuItem>
        <DialogTrigger asChild>
        <ContextMenuItem
          variant="destructive"
          aria-label="Delete message"
        >
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </ContextMenuItem>
        </DialogTrigger>
        <ContextMenuItem onSelect={onReply} aria-label="Reply to message">
          <Reply className="mr-2 h-4 w-4" /> Reply
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
    
    <DialogContent>
    <DialogHeader>
      <DialogTitle>
        Are you sure you want to delete this message?
      </DialogTitle>
      <DialogDescription>
        This action cannot be undone. You can choose to soft delete or hard delete the message.
      </DialogDescription>
    </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={onSoftDelete}>
          Soft Delete
        </Button>
        <Button variant="destructive" onClick={onHardDelete}>
          Hard Delete
        </Button>
      </DialogFooter>
    </DialogContent>
    </Dialog>
  )
}