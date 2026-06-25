import type { Preorder } from "@/types/preorder";

type PreorderTableProps = {
  preorders: Preorder[];
  isLoading: boolean;
};

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

function CheckboxIcon() {
  return (
    <span className="block h-4 w-4 rounded border border-neutral-400 bg-white" />
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

function StatusSwitch({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={`inline-flex h-5 w-8 items-center rounded-md p-1 ${
        isActive ? "bg-neutral-900" : "bg-neutral-200"
      }`}
    >
      <span
        className={`h-3 w-3 rounded-sm bg-white transition ${
          isActive ? "translate-x-3" : "translate-x-0"
        }`}
      />
    </span>
  );
}

export function PreorderTable({ preorders, isLoading }: PreorderTableProps) {
  return (
    <div className="max-w-full overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]">
      <table className="w-full min-w-[920px] border-collapse text-left text-sm">
        <thead className="bg-neutral-50 text-[13px] text-neutral-600">
          <tr>
            <th className="w-9 px-3 py-2.5 font-semibold">
              <CheckboxIcon />
            </th>
            <th className="px-3 py-2.5 font-semibold">Name</th>
            <th className="px-3 py-2.5 font-semibold">Products</th>
            <th className="px-3 py-2.5 font-semibold">Preorder when</th>
            <th className="px-3 py-2.5 font-semibold">Starts at</th>
            <th className="px-3 py-2.5 font-semibold">Ends at</th>
            <th className="px-3 py-2.5 font-semibold">Status</th>
            <th className="px-3 py-2.5 font-semibold">Actions</th>
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
                  <CheckboxIcon />
                </td>
                <td className="px-3 py-2 font-bold text-neutral-800">
                  {item.name}
                </td>
                <td className="px-3 py-2">{item.products}</td>
                <td className="px-3 py-2">{item.preorderWhen}</td>
                <td className="px-3 py-2">{formatDate(item.startsAt)}</td>
                <td className="px-3 py-2">{formatDate(item.endsAt)}</td>
                <td className="px-3 py-2">
                  <StatusSwitch isActive={item.isActive} />
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label={`Edit ${item.name}`}
                      className="grid h-8 w-8 place-items-center rounded-lg border border-neutral-200 bg-white text-neutral-700 transition hover:bg-neutral-50"
                    >
                      <EditIcon />
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${item.name}`}
                      className="grid h-8 w-8 place-items-center rounded-lg border border-neutral-200 bg-white text-neutral-700 transition hover:bg-neutral-50"
                    >
                      <DeleteIcon />
                    </button>
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
