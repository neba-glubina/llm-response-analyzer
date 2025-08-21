import useSWRMutation from "swr/mutation";
import { useStore } from "@/store";
import { authFetch } from "@/lib/auth";

const KEY = "calculation";

const fetcher = async (
  key: typeof KEY,
  {
    arg,
  }: {
    arg: {
      requests: string[];
      ais: string[];
    };
  }
) => {
  console.log("key: ", key);
  console.log("arg: ", arg);

  const res = await authFetch("/api/v1/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(arg),
  });
  if (!res.ok) throw new Error("Failed to start calculation");
  return res.json();
};

export const useCalculation = () => {
  const files = useStore((state) => state.calculationSlice.files);
  const storeAis = useStore((state) => state.calculationSlice.ais);

  const {
    data: calculationData,
    error: calculationError,
    isMutating: calculationIsLoading,
    reset: resetCalculation,
    trigger: triggerCalculationBase,
  } = useSWRMutation(KEY, fetcher, {
    onSuccess: (successData) => {
      // TODO: update store's list
      console.log(successData);
    },
  });

  const triggerCalculation = async () => {
    const filesArr = files ? Object.values(files) : [];
    const requests = filesArr.map((f) => f.content).flat();

    const ais = storeAis ? Object.values(storeAis).map((ai) => ai.value) : [];

    try {
      // Upload files first (optional, since we keep in memory for now)
      if (filesArr.length > 0) {
        const form = new FormData();
        for (const f of filesArr) {
          // Reconstruct a CSV blob from content lines
          const csv = new Blob([f.content.join("\n")], { type: "text/csv" });
          form.append("files", new File([csv], f.name, { type: "text/csv" }));
        }
        await authFetch("/api/v1/files/upload", {
          method: "POST",
          body: form,
        });
      }

      const result = await triggerCalculationBase({ requests, ais });
      // Optionally clear uploaded files after starting calculation
      // removeFiles();
      return result;
    } catch (error) {
      console.error("Error during calculation:", error);
      throw error;
    }
  };

  return {
    calculationData,
    calculationError,
    calculationIsLoading,
    resetCalculation,
    triggerCalculation,
  };
};
