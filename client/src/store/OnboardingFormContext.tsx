"use client";

import { onboardingSchema } from "@/lib/schema";
import { createContext, ReactNode, useContext, useState } from "react";
import z from "zod";

type FormData = z.infer<typeof onboardingSchema>;

const defaultData: Partial<FormData> = {};

const OnboardingFormContext = createContext<{
  data: Partial<FormData>;
  setData: (data: Partial<FormData>) => void;
}>({ data: defaultData, setData: () => {} });

export const OnboardingFormProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [data, setData] = useState<Partial<FormData>>(defaultData);
  return (
    <OnboardingFormContext.Provider value={{ data, setData }}>
      {children}
    </OnboardingFormContext.Provider>
  );
};

export const useOnboardingForm = () => useContext(OnboardingFormContext);
