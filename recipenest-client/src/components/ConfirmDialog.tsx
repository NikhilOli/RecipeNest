import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <Dialog.Overlay className="fixed inset-0 bg-black/50" />
      <Dialog.Content className="fixed top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-[90vw] max-w-md shadow-lg">
        <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
        <Dialog.Description className="mt-2 text-gray-700">{description}</Dialog.Description>
        <div className="mt-6 flex justify-end gap-4">
          <Button className="cursor-pointer" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button className="cursor-pointer" variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}
