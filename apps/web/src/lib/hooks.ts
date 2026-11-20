import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { errorMessage } from "@/components/ui";
import { useToast } from "@/lib/toast";

/** Mutation with the app's standard feedback: success toast, localized error toast, and cache invalidation by key prefix. */
export function useAction<B = void, R = unknown>(fn: (body: B) => Promise<R>, invalidate: string[] = [], opts: { ok?: string; silent?: boolean; onDone?: (r: R) => void } = {}) {
  const qc = useQueryClient();
  const toast = useToast();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: fn,
    onSuccess: (r) => {
      if (!opts.silent) toast(opts.ok ?? t("common.saved"));
      for (const k of invalidate) void qc.invalidateQueries({ queryKey: [k] });
      opts.onDone?.(r);
    },
    onError: (e) => toast(errorMessage(e, t as never), "err"),
  });
}

/** Tiny controlled-form helper: `const [f, set, bind, reset] = useForm({a: ""})`; `bind("a")` => {value,onChange} for Input/Select/Textarea. */
export function useForm<T extends Record<string, unknown>>(initial: T) {
  const [f, setF] = useState<T>(initial);
  const set = useCallback((patch: Partial<T>) => setF((x) => ({ ...x, ...patch })), []);
  const bind = (k: keyof T & string) => ({ value: (f[k] ?? "") as string, onChange: (e: { target: { value: string } }) => setF((x) => ({ ...x, [k]: e.target.value })) });
  const reset = useCallback(() => setF(initial), [initial]);
  return [f, set, bind, reset] as const;
}
