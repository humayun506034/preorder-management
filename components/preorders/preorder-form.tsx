"use client";

import { motion } from "framer-motion";
import { FormEvent, ReactNode, useMemo, useState } from "react";
import type { Preorder, PreorderPayload } from "@/types/preorder";

type PreorderFormProps = {
  preorder?: Preorder;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (payload: PreorderPayload) => Promise<void>;
};

const preorderWhenOptions = [
  "regardless-of-stock",
  "out-of-stock",
  "before-eid",
];

const buttonMotion = {
  whileHover: { scale: 1.03 },
  whileTap: { scale: 0.96 },
  transition: { type: "spring", stiffness: 500, damping: 30 },
} as const;

const toDateTimeInputValue = (value?: string | null) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60_000;

  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

const toIsoOrNull = (value: string) => {
  if (!value) {
    return null;
  }

  return new Date(value).toISOString();
};

export function PreorderForm({
  preorder,
  isSubmitting,
  onCancel,
  onSubmit,
}: PreorderFormProps) {
  const initialValues = useMemo(
    () => ({
      name: preorder?.name ?? "",
      products: preorder?.products ?? 1,
      preorderWhen: preorder?.preorderWhen ?? "regardless-of-stock",
      startsAt: toDateTimeInputValue(preorder?.startsAt),
      endsAt: toDateTimeInputValue(preorder?.endsAt),
      isActive: preorder?.isActive ?? true,
    }),
    [preorder],
  );

  const [name, setName] = useState(initialValues.name);
  const [products, setProducts] = useState(initialValues.products);
  const [preorderWhen, setPreorderWhen] = useState(initialValues.preorderWhen);
  const [startsAt, setStartsAt] = useState(initialValues.startsAt);
  const [endsAt, setEndsAt] = useState(initialValues.endsAt);
  const [isActive, setIsActive] = useState(initialValues.isActive);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await onSubmit({
      name: name.trim(),
      products,
      preorderWhen,
      startsAt: new Date(startsAt).toISOString(),
      endsAt: toIsoOrNull(endsAt),
      isActive,
    });
  };

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#f3f3f3] px-3 py-5 text-neutral-900 sm:px-5 sm:py-8 lg:px-8">
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex w-full min-w-0 max-w-[min(912px,100%)] flex-col gap-5 sm:gap-8"
      >
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <motion.button
            type="button"
            onClick={onCancel}
            {...buttonMotion}
            className="flex h-10 w-fit items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 text-sm font-bold text-neutral-900 shadow-sm transition hover:bg-neutral-50"
          >
            <span aria-hidden="true">&lt;</span>
            Back
          </motion.button>

          <div className="grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 sm:flex sm:items-center">
            <motion.button
              type="button"
              onClick={onCancel}
              {...buttonMotion}
              className="h-10 rounded-lg border border-neutral-200 bg-white px-4 text-sm font-bold text-neutral-900 transition hover:bg-neutral-50 sm:px-5"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              {...buttonMotion}
              className="h-10 rounded-lg bg-neutral-900 px-4 text-sm font-bold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60 sm:px-6"
            >
              {isSubmitting ? "Saving..." : "Save changes"}
            </motion.button>
          </div>
        </div>

        <section className="min-w-0 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
          <div className="border-b border-neutral-200 px-4 py-4 sm:px-6 sm:py-5">
            <h1 className="text-base font-bold text-neutral-950">
              Preorder details
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              These values appear in the preorders list.
            </p>
          </div>

          <div className="divide-y divide-neutral-200 px-4 sm:px-6">
            <FormRow
              title="Name"
              description="A label to recognize this preorder by."
              required
            >
              <input
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="h-10 w-full min-w-0 max-w-[420px] rounded-lg border border-neutral-300 px-3 text-sm outline-none transition focus:border-neutral-500"
              />
            </FormRow>

            <FormRow
              title="Products"
              description="Number of products covered by this preorder."
            >
              <div className="flex min-w-0 flex-wrap items-center gap-3">
                <input
                  required
                  min={1}
                  type="number"
                  value={products}
                  onChange={(event) => setProducts(Number(event.target.value))}
                  className="h-10 w-36 max-w-full rounded-lg border border-neutral-300 px-3 text-sm outline-none transition focus:border-neutral-500"
                />
                <span className="text-sm text-slate-600">product(s)</span>
              </div>
            </FormRow>

            <FormRow
              title="Preorder when"
              description="When customers are allowed to preorder."
            >
              <select
                value={preorderWhen}
                onChange={(event) => setPreorderWhen(event.target.value)}
                className="h-10 w-full min-w-0 max-w-[420px] rounded-lg border border-neutral-300 bg-white px-3 text-sm outline-none transition focus:border-neutral-500"
              >
                {preorderWhenOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </FormRow>

            <FormRow
              title="Starts at"
              description="When the preorder window opens."
            >
              <input
                required
                type="datetime-local"
                value={startsAt}
                onChange={(event) => setStartsAt(event.target.value)}
                className="h-10 w-full min-w-0 max-w-[420px] rounded-lg border border-neutral-300 px-3 text-sm outline-none transition focus:border-neutral-500"
              />
            </FormRow>

            <FormRow title="Ends at" description="Leave empty for no end date.">
              <input
                type="datetime-local"
                value={endsAt}
                onChange={(event) => setEndsAt(event.target.value)}
                className="h-10 w-full min-w-0 max-w-[420px] rounded-lg border border-neutral-300 px-3 text-sm outline-none transition focus:border-neutral-500"
              />
            </FormRow>

            <FormRow
              title="Status"
              description="Active preorders are visible to customers."
            >
              <label className="flex items-center gap-3 text-sm font-medium text-slate-600">
                <motion.button
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setIsActive((current) => !current)}
                  {...buttonMotion}
                  className={`inline-flex h-7 w-11 items-center rounded-lg p-1 transition ${
                    isActive ? "bg-neutral-900" : "bg-neutral-200"
                  }`}
                >
                  <span
                    className={`h-5 w-5 rounded-md bg-white transition ${
                      isActive ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </motion.button>
                Active
              </label>
            </FormRow>
          </div>

          <div className="grid grid-cols-1 gap-3 border-t border-neutral-200 bg-neutral-50 px-4 py-4 min-[380px]:grid-cols-2 sm:flex sm:justify-end sm:px-6">
            <motion.button
              type="button"
              onClick={onCancel}
              {...buttonMotion}
              className="h-10 rounded-lg border border-neutral-200 bg-white px-4 text-sm font-bold text-neutral-900 transition hover:bg-neutral-50 sm:px-5"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              {...buttonMotion}
              className="h-10 rounded-lg bg-neutral-900 px-4 text-sm font-bold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60 sm:px-6"
            >
              {isSubmitting ? "Saving..." : "Save changes"}
            </motion.button>
          </div>
        </section>
      </form>
    </main>
  );
}

type FormRowProps = {
  title: string;
  description: string;
  required?: boolean;
  children: ReactNode;
};

function FormRow({ title, description, required, children }: FormRowProps) {
  return (
    <div className="grid min-w-0 gap-4 py-5 sm:py-6 min-[900px]:grid-cols-[220px_minmax(0,1fr)]">
      <div className="min-w-0">
        <label className="text-sm font-bold text-neutral-950">
          {title}
          {required ? <span className="text-red-600"> *</span> : null}
        </label>
        <p className="mt-1 max-w-full text-sm leading-5 text-slate-500 min-[900px]:max-w-[190px]">
          {description}
        </p>
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
