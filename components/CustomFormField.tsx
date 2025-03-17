import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { category } from "@/lib/CreateBlog";

interface CustomFormFieldProps {
  form: UseFormReturn<
    {
      title: string;
      caption: string;
      seo: {
        metaTitle: string;
        metaDescription: string;
      };
      category: string;
    },
    Record<string, unknown>,
    undefined
  >;
  label: string;
  description: string;
  name:
    | "title"
    | "caption"
    | "seo.metaTitle"
    | "seo.metaDescription"
    | "category";
  type?: string;
  categories?: category[] | [];
  loading?: boolean;
  defaultSelected?: string;
}

const CustomFormField = ({
  form,
  label,
  description,
  name,
  type = "text",
  loading,
  categories,
  defaultSelected,
}: CustomFormFieldProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="my-3">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {type !== "select" ? (
              type === "text" ? (
                <Input className="bg-white" {...field} />
              ) : (
                <Textarea className="bg-white" {...field} />
              )
            ) : (
              <Select
                disabled={loading}
                onValueChange={field.onChange}
                defaultValue={defaultSelected || field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select blog category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories &&
                    categories.length > 0 &&
                    categories.map((category, i) => (
                      <SelectItem key={i} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
