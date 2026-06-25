import type { Preorder } from "@/types/preorder";

type ConfirmDeleteModalProps = {
  preorder: Preorder;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmDeleteModal({
  preorder,
  isDeleting,
  onCancel,
  onConfirm,
}: ConfirmDeleteModalProps) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/30 px-3 py-6 sm:px-4">
      <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-5 shadow-xl sm:p-6">
        <h2 className="text-lg font-bold text-neutral-950">
          Delete preorder?
        </h2>
        <p className="mt-2 text-sm leading-6 text-neutral-600">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-neutral-950">
            {preorder.name}
          </span>
          ? This action cannot be undone.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:flex sm:justify-end">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onCancel}
            className="h-10 rounded-lg border border-neutral-200 bg-white px-5 text-sm font-bold text-neutral-900 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className="h-10 rounded-lg bg-neutral-900 px-5 text-sm font-bold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? "Deleting..." : "Yes, delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
