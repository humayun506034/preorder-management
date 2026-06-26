import { motion } from "framer-motion";
import type { Preorder } from "@/features/preorders/preorder.types";

type PreorderTableProps = {
  preorders: Preorder[];
  isLoading: boolean;
  selectedIds: string[];
  onEdit: (preorder: Preorder) => void;
  onDelete: (preorder: Preorder) => void;
  onSelectAll: (checked: boolean) => void;
  onSelectOne: (id: string, checked: boolean) => void;
  onStatusToggle: (preorder: Preorder) => void;
  deletingId: string | null;
  updatingStatusId: string | null;
};

const buttonMotion = {
  whileHover: { scale: 1.04 },
  whileTap: { scale: 0.96 },
  transition: { duration: 0.12, ease: "easeOut" },
} as const;

const switchMotion = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
  transition: { duration: 0.12, ease: "easeOut" },
} as const;

const formatDate = (value: string | null) => {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

function RowCheckbox({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <input
      type="checkbox"
      aria-label={label}
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
      className="h-4 w-4 rounded border-neutral-400 accent-neutral-900"
    />
  );
}

function EditIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m16.5 4.5 3 3L8 19H5v-3L16.5 4.5Z" />
      <path d="m14 7 3 3" />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 7h16" />
      <path d="M10 11v6M14 11v6" />
      <path d="M6 7l1 14h10l1-14" />
      <path d="M9 7V4h6v3" />
    </svg>
  );
}

function StatusSwitch({
  isActive,
  isUpdating,
  onToggle,
}: {
  isActive: boolean;
  isUpdating: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.button
      type="button"
      aria-label={isActive ? "Deactivate preorder" : "Activate preorder"}
      aria-pressed={isActive}
      disabled={isUpdating}
      onClick={onToggle}
      {...switchMotion}
      className={`inline-flex h-5 w-8 cursor-pointer items-center rounded-md p-1 transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
        isActive ? "bg-neutral-900" : "bg-neutral-200"
      }`}
    >
      <span
        className={`h-3 w-3 rounded-sm bg-white transition-transform duration-150 ease-out will-change-transform ${
          isActive ? "translate-x-3" : "translate-x-0"
        }`}
      />
    </motion.button>
  );
}

export function PreorderTable({
  preorders,
  isLoading,
  selectedIds,
  onEdit,
  onDelete,
  onSelectAll,
  onSelectOne,
  onStatusToggle,
  deletingId,
  updatingStatusId,
}: PreorderTableProps) {
  const allRowsSelected =
    preorders.length > 0 &&
    preorders.every((preorder) => selectedIds.includes(preorder.id));

  return (
    <div className="max-w-full overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]">
      <table className="w-full min-w-[1040px] table-fixed border-collapse text-left text-sm">
        <thead className="bg-neutral-50 text-[13px] text-neutral-600">
          <tr>
            <th className="w-9 px-3 py-2.5 font-semibold">
              <RowCheckbox
                checked={allRowsSelected}
                label="Select all preorders on this page"
                onChange={onSelectAll}
              />
            </th>
            <th className="w-[180px] px-3 py-2.5 font-semibold">Name</th>
            <th className="w-[90px] px-3 py-2.5 font-semibold">Products</th>
            <th className="w-[170px] px-3 py-2.5 font-semibold">
              Preorder when
            </th>
            <th className="w-[190px] px-3 py-2.5 font-semibold">Starts at</th>
            <th className="w-[190px] px-3 py-2.5 font-semibold">Ends at</th>
            <th className="w-[90px] px-3 py-2.5 font-semibold">Status</th>
            <th className="w-[100px] px-3 py-2.5 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 bg-white text-[13.5px] text-neutral-800">
          {isLoading ? (
            <tr>
              <td className="px-4 py-10 text-center text-neutral-500" colSpan={8}>
                Loading preorders...
              </td>
            </tr>
          ) : preorders.length > 0 ? (
            preorders.map((item) => (
              <tr key={item.id} className="h-[43px] hover:bg-neutral-50">
                <td className="px-3 py-2">
                  <RowCheckbox
                    checked={selectedIds.includes(item.id)}
                    label={`Select ${item.name}`}
                    onChange={(checked) => onSelectOne(item.id, checked)}
                  />
                </td>
                <td className="truncate px-3 py-2 font-bold text-neutral-800">
                  {item.name}
                </td>
                <td className="px-3 py-2">{item.products}</td>
                <td className="truncate px-3 py-2">{item.preorderWhen}</td>
                <td className="whitespace-nowrap px-3 py-2">
                  {formatDate(item.startsAt)}
                </td>
                <td className="whitespace-nowrap px-3 py-2">
                  {formatDate(item.endsAt)}
                </td>
                <td className="px-3 py-2">
                  <StatusSwitch
                    isActive={item.isActive}
                    isUpdating={updatingStatusId === item.id}
                    onToggle={() => onStatusToggle(item)}
                  />
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-1.5">
                    <motion.button
                      type="button"
                      aria-label={`Edit ${item.name}`}
                      onClick={() => onEdit(item)}
                      {...buttonMotion}
                      className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg border border-neutral-200 bg-white text-neutral-700 shadow-sm transition-colors hover:border-neutral-300 hover:bg-neutral-100 hover:text-neutral-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
                    >
                      <EditIcon />
                    </motion.button>
                    <motion.button
                      type="button"
                      aria-label={`Delete ${item.name}`}
                      disabled={deletingId === item.id}
                      onClick={() => onDelete(item)}
                      {...buttonMotion}
                      className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg border border-neutral-200 bg-white text-neutral-700 shadow-sm transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <DeleteIcon />
                    </motion.button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="px-4 py-10 text-center text-neutral-500" colSpan={8}>
                No preorders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
