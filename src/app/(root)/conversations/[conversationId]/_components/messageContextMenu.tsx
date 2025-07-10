import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Pencil, Copy, Trash2, Reply } from "lucide-react"

interface MessageContextMenuProps {
  children: React.ReactNode
  onEdit?: () => void
  onCopy?: () => void
  onDelete?: () => void
  onReply?: () => void
}

export default function MessageContextMenu({
  children,
  onEdit,
  onCopy,
  onDelete,
  onReply,
}: MessageContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onSelect={onEdit} aria-label="Edit message">
          <Pencil className="mr-2 h-4 w-4" /> Edit
        </ContextMenuItem>
        <ContextMenuItem onSelect={onCopy} aria-label="Copy message">
          <Copy className="mr-2 h-4 w-4" /> Copy
        </ContextMenuItem>
        <ContextMenuItem
          onSelect={onDelete}
          variant="destructive"
          aria-label="Delete message"
        >
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </ContextMenuItem>
        <ContextMenuItem onSelect={onReply} aria-label="Reply to message">
          <Reply className="mr-2 h-4 w-4" /> Reply
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}