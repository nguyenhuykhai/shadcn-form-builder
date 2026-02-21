import { zodResolver } from "@hookform/resolvers/zod";
import { Highlight, themes } from "prism-react-renderer";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import If from "@/components/ui/if";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormLibrary } from "@/constants";
import { renderFormField } from "@/screens/render-form-field";
import { FormFieldType } from "@/types";

import { formatJSXCode } from "@/lib/utils";
import {
  generateDefaultValues,
  generateFormCodeForLibrary,
  generateZodSchema,
} from "@/screens/generate-code-parts";
import { Code, Copy, Eye, RotateCw } from "lucide-react";
import { SiReacthookform, SiReactquery } from "react-icons/si";
import { VscJson } from "react-icons/vsc";

export type FormFieldOrGroup = FormFieldType | FormFieldType[];

export type FormPreviewProps = {
  formFields: FormFieldOrGroup[];
  selectedLibrary: FormLibrary;
  onLibraryChange: (library: FormLibrary) => void;
  handleResetForm: () => void;
};

const renderFormFields = (fields: FormFieldOrGroup[], form: any) => {
  return fields.map((fieldOrGroup, index) => {
    if (Array.isArray(fieldOrGroup)) {
      // Calculate column span based on number of fields in the group
      const getColSpan = (totalFields: number) => {
        switch (totalFields) {
          case 2:
            return 6; // Two columns
          case 3:
            return 4; // Three columns
          default:
            return 12; // Single column or fallback
        }
      };

      return (
        <div key={index} className="grid grid-cols-12 gap-4">
          {fieldOrGroup.map((field) => {
            const rendered = renderFormField(field, form);
            const isValid = rendered != null && React.isValidElement(rendered);
            return (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name}
                render={({ field: formField }) => (
                  <FormItem
                    className={`col-span-${getColSpan(fieldOrGroup.length)}`}
                  >
                    {isValid ? (
                      <FormControl>
                        {React.cloneElement(rendered, { ...formField })}
                      </FormControl>
                    ) : (
                      <>
                        <FormLabel>{field.label || field.name}</FormLabel>
                        <FormControl>
                          <div className="min-h-10 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive flex items-center">
                            Unsupported field type: &quot;{field.variant}&quot;
                          </div>
                        </FormControl>
                        <p className="text-xs text-destructive">
                          This component type is not available in the preview.
                        </p>
                      </>
                    )}
                  </FormItem>
                )}
              />
            );
          })}
        </div>
      );
    } else {
      const rendered = renderFormField(fieldOrGroup, form);
      const isValid = rendered != null && React.isValidElement(rendered);
      return (
        <FormField
          key={index}
          control={form.control}
          name={fieldOrGroup.name}
          render={({ field: formField }) => (
            <FormItem className="col-span-12">
              {isValid ? (
                <FormControl>
                  {React.cloneElement(rendered, { ...formField })}
                </FormControl>
              ) : (
                <>
                  <FormLabel>
                    {fieldOrGroup.label || fieldOrGroup.name}
                  </FormLabel>
                  <FormControl>
                    <div className="min-h-10 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive flex items-center">
                      Unsupported field type: &quot;{fieldOrGroup.variant}&quot;
                    </div>
                  </FormControl>
                  <p className="text-xs text-destructive">
                    This component type is not available in the preview.
                  </p>
                </>
              )}
            </FormItem>
          )}
        />
      );
    }
  });
};

export const FormPreview: React.FC<FormPreviewProps> = ({
  formFields,
  selectedLibrary,
  onLibraryChange,
  handleResetForm,
}) => {
  const formSchema = generateZodSchema(formFields);

  const defaultVals = generateDefaultValues(formFields);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultVals,
  });

  function onSubmit(data: any) {
    try {
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>,
      );
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  const generatedCode = generateFormCodeForLibrary(formFields, selectedLibrary);
  const formattedCode = formatJSXCode(generatedCode);
  const formFieldsJson = JSON.stringify(formFields, null, 2);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard`);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="w-full h-full col-span-1 rounded-xl flex justify-center">
      <Tabs defaultValue="preview" className="w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center w-fit gap-2">
            {/* Reset Form */}
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 shrink-0 px-2.5 transition-all duration-200 group hover:bg-white"
                onClick={handleResetForm}
            >
              <RotateCw
                className="size-4 shrink-0 transition-transform duration-300 ease-out group-hover:rotate-45"
              />
              <span className="text-sm font-medium">Reset</span>
            </Button>
            <Select
              value={selectedLibrary}
              onValueChange={(value) => onLibraryChange(value as FormLibrary)}
            >
              <SelectTrigger className="h-8 w-auto min-w-40 border-0 px-2.5 focus:ring-0">
                <SelectValue placeholder="Select library">
                  <div className="flex items-center gap-2">
                    {selectedLibrary === "react-hook-form" && (
                      <>
                        <SiReacthookform className="size-4 shrink-0"/>
                        <span className="text-sm font-medium">React Hook Form</span>
                      </>
                    )}
                    {selectedLibrary === "tanstack-form" && (
                      <>
                        <SiReactquery className="size-4 shrink-0"/>
                        <span className="text-sm font-medium">TanStack Form</span>
                      </>
                    )}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel className="text-xs font-medium text-muted-foreground">Form library</SelectLabel>
                  <SelectItem
                    value="react-hook-form"
                    className="cursor-pointer transition-colors focus:bg-muted"
                  >
                    <div className="flex items-center gap-2 py-0.5">
                      <SiReacthookform className="size-4 shrink-0"/>
                      <span>React Hook Form</span>
                    </div>
                  </SelectItem>
                  <SelectItem
                    value="tanstack-form"
                    className="cursor-pointer transition-colors focus:bg-muted"
                  >
                    <div className="flex items-center gap-2 py-0.5">
                      <SiReactquery className="size-4 shrink-0" />
                      <span>TanStack Form</span>
                    </div>
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <TabsList>
            <TabsTrigger value="preview">
              <div className="flex items-center gap-1">
                <Eye className="size-4" />{" "}
                <span className="text-sm">Preview</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="json">
              <div className="flex items-center gap-1">
                <VscJson />
                <span className="text-sm">JSON</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="code">
              <div className="flex items-center gap-1">
                <Code className="size-4" />
                <span className="text-sm">Code</span>
              </div>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="preview"
          className="space-y-4 h-full md:max-h-[75vh] overflow-auto"
        >
          <If
            condition={formFields.length > 0}
            render={() => (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4 py-5 max-w-lg"
                >
                  {renderFormFields(formFields, form)}
                  <Button type="submit">Submit</Button>
                </form>
              </Form>
            )}
            otherwise={() => (
              <div className="h-full md:max-h-[75vh] flex justify-center items-center">
                <p>No form element selected yet.</p>
              </div>
            )}
          />
        </TabsContent>
        <TabsContent value="json">
          <If
            condition={formFields.length > 0}
            render={() => (
              <div className="relative rounded-lg border border-border bg-secondary/50 overflow-hidden">
                <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-border bg-muted/50">
                  <span className="text-xs font-medium text-muted-foreground">
                    Form schema (JSON)
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5 shrink-0"
                    onClick={() => copyToClipboard(formFieldsJson, "JSON")}
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Copy JSON
                  </Button>
                </div>
                <pre className="p-4 text-sm overflow-auto h-[calc(75vh-3.5rem)] md:max-h-[calc(75vh-3.5rem)]">
                  {formFieldsJson}
                </pre>
              </div>
            )}
            otherwise={() => (
              <div className="h-full md:max-h-[75vh] flex justify-center items-center">
                <p>No form element selected yet.</p>
              </div>
            )}
          />
        </TabsContent>
        <TabsContent value="code">
          <If
            condition={formFields.length > 0}
            render={() => (
              <div className="relative rounded-lg border border-border overflow-hidden">
                <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-border bg-muted/50">
                  <span className="text-xs font-medium text-muted-foreground">
                    {selectedLibrary === "react-hook-form"
                      ? "React Hook Form"
                      : "TanStack Form"}{" "}
                    · TSX
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5 shrink-0"
                    onClick={() => copyToClipboard(formattedCode, "Code")}
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Copy Code
                  </Button>
                </div>
                <Highlight
                  code={formattedCode}
                  language="tsx"
                  theme={themes.oneDark}
                >
                  {({
                    className,
                    style,
                    tokens,
                    getLineProps,
                    getTokenProps,
                  }: any) => (
                    <pre
                      className={`${className} p-4 text-sm rounded-b-lg overflow-auto h-[calc(75vh-3.5rem)] md:max-h-[calc(75vh-3.5rem)]`}
                      style={style}
                    >
                      {tokens.map((line: any, i: number) => (
                        <div key={i} {...getLineProps({ line, key: i })}>
                          {line.map((token: any, key: any) => (
                            <span
                              key={key}
                              {...getTokenProps({ token, key })}
                            />
                          ))}
                        </div>
                      ))}
                    </pre>
                  )}
                </Highlight>
              </div>
            )}
            otherwise={() => (
              <div className="h-[50vh] flex justify-center items-center">
                <p>No form element selected yet.</p>
              </div>
            )}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
