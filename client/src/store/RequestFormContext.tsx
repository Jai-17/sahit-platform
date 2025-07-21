"use client";

import { requestFormSchema } from "@/lib/schema";
import { createContext, ReactNode, useContext, useState } from "react";
import z from "zod";

type FormData = z.infer<typeof requestFormSchema>;

const defaultData: Partial<FormData> = {};

const RequestFormContext = createContext<{
  data: Partial<FormData>;
  setData: (data: Partial<FormData>) => void;
}>({ data: defaultData, setData: () => {} });

export const RequestFormProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [data, setData] = useState<Partial<FormData>>(defaultData);
  return (
    <RequestFormContext.Provider value={{ data, setData }}>
      {children}
    </RequestFormContext.Provider>
  );
};

export const useRequestForm = () => useContext(RequestFormContext);
