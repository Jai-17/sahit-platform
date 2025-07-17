// components/form/MultiSelectDropdown.tsx
"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { HelpType } from "@/lib/schema";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { useState } from "react";

const helpTypes = Object.values(HelpType);

export const MultiSelectDropdown = () => {
  const { control } = useFormContext();
  const [open, setOpen] = useState(false);

  return (
    <FormField
      control={control}
      name="supportTypes"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Support Types</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl className="bg-transparent h-12">
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full flex-wrap justify-between min-h-[44px] gap-1"
                >
                  <div className="flex flex-wrap gap-1 max-w-[100%]">
                    {field.value && field.value.length > 0 ? (
                      field.value.map((type: string) => (
                        <p
                          key={type}
                          className="px-2 py-0.5 text-[8px] md:text-sm bg-[#8300EA10] rounded-md text-violet-800"
                        >
                          {type}
                        </p>
                      ))
                    ) : (
                      <p className="text-muted-foreground">
                        Select support types
                      </p>
                    )}
                  </div>
                  <ChevronsUpDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandGroup className="bg-transparent">
                  {helpTypes.map((type) => {
                    const selected = field.value?.includes(type);
                    return (
                      <CommandItem
                        key={type}
                        onSelect={() => {
                          if (selected) {
                            field.onChange(
                              field.value.filter((val: string) => val !== type)
                            );
                          } else {
                            field.onChange([...(field.value || []), type]);
                          }
                        }}
                      >
                        <div
                          className={cn(
                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                            selected ? "bg-[#8300EA] text-white" : ""
                          )}
                        >
                          {selected && <Check className="h-4 w-4 text-white" />}
                        </div>
                        {type}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
