"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  useForm,
  type Control,
  type FieldPath,
  type FieldValues,
  type ErrorOption,
} from "react-hook-form";
import type {
  ChangeEvent,
  ComponentProps,
  HTMLAttributes,
  Ref,
} from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ApiError } from "@/lib/api/client";
import { useLogin, useRegister } from "@/features/auth/hooks";
import {
  loginSchema,
  registerSchema,
  type LoginFormValues,
  type RegisterFormValues,
} from "@/features/auth/schemas";
import type { Role } from "@/config/nav";

const demoAccounts = [
  { role: "mentor", email: "mentor@kss.test" },
  { role: "school", email: "school@kss.test" },
  { role: "admin", email: "admin@kss.test" },
] as const;

function PasswordInput({
  value,
  onChange,
  onBlur,
  name,
  ref,
  id,
  "aria-describedby": ariaDescribedby,
  "aria-invalid": ariaInvalid,
  autoComplete,
}: {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  name: string;
  ref: Ref<HTMLInputElement>;
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean | "true" | "false";
  autoComplete: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <Input
        aria-describedby={ariaDescribedby}
        aria-invalid={ariaInvalid}
        autoComplete={autoComplete}
        id={id}
        name={name}
        onBlur={onBlur}
        onChange={onChange}
        ref={ref}
        required
        type={visible ? "text" : "password"}
        value={value}
      />
      <button
        aria-label={visible ? "Hide password" : "Show password"}
        className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2"
        onClick={() => setVisible((current) => !current)}
        type="button"
      >
        {visible ? <EyeOff aria-hidden="true" size={18} /> : <Eye aria-hidden="true" size={18} />}
      </button>
    </div>
  );
}

function Field({
  control,
  name,
  label,
  type = "text",
  autoComplete,
  autoFocus = false,
  inputMode,
}: {
  control: Control<LoginFormValues>;
  name: FieldPath<LoginFormValues>;
  label: string;
  type?: ComponentProps<typeof Input>["type"];
  autoComplete?: string;
  autoFocus?: boolean;
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {type === "password" ? (
              <PasswordInput
                {...field}
                autoComplete={autoComplete ?? "current-password"}
                value={String(field.value ?? "")}
              />
            ) : (
              <Input
                {...field}
                autoComplete={autoComplete}
                autoFocus={autoFocus}
                inputMode={inputMode}
                type={type}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function FormInput({
  label,
  error,
  ...props
}: ComponentProps<typeof Input> & {
  label: string;
  error?: string;
}) {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium" htmlFor={props.id}>
        {label}
      </label>
      <Input {...props} aria-invalid={Boolean(error)} />
      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
}

function mapServerFieldErrors<T extends FieldValues>(
  error: unknown,
  setError: (name: FieldPath<T>, value: ErrorOption) => void,
) {
  if (!(error instanceof ApiError) || !error.fieldErrors) {
    toast.error(
      error instanceof Error ? error.message : "We couldn’t complete that request. Please try again.",
    );
    return;
  }
  for (const [field, messages] of Object.entries(error.fieldErrors)) {
    const message = messages[0];
    if (message) {
      setError(field, { type: "server", message });
    }
  }
  if (error.fieldErrors.form?.[0]) {
    toast.error(error.fieldErrors.form[0]);
  }
}

export function LoginForm() {
  const login = useLogin();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const mockingEnabled = process.env.NEXT_PUBLIC_API_MOCKING === "enabled";

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form
          className="space-y-4"
          noValidate
          onSubmit={form.handleSubmit((values) =>
            login.mutate(values, {
              onError: (error) =>
                mapServerFieldErrors<LoginFormValues>(error, (name, value) =>
                  form.setError(name, value),
                ),
            }),
          )}
        >
          <Field
            autoComplete="email"
            autoFocus
            control={form.control}
            label="Email"
            name="email"
            type="email"
          />
          <Field
            autoComplete="current-password"
            control={form.control}
            label="Password"
            name="password"
            type="password"
          />
          <Button className="w-full" disabled={login.isPending} type="submit">
            {login.isPending && <LoaderCircle aria-hidden="true" className="animate-spin" />}
            Log in
          </Button>
        </form>
      </Form>
      {mockingEnabled && (
        <section aria-label="Demo accounts" className="border-border border-t pt-4">
          <p className="mb-3 text-sm font-medium">Demo accounts</p>
          <div className="flex flex-wrap gap-2">
            {demoAccounts.map((account) => (
              <Button
                key={account.role}
                onClick={() =>
                  form.reset({ email: account.email, password: "password123" })
                }
                size="sm"
                type="button"
                variant="outline"
              >
                {account.role}
              </Button>
            ))}
          </div>
          <p className="text-muted-foreground mt-2 text-xs">
            Password: password123
          </p>
        </section>
      )}
      <p className="text-muted-foreground text-sm">
        New to KSS?{" "}
        <Link className="text-forest-700 font-medium underline" href="/register">
          Create an account
        </Link>
      </p>
    </div>
  );
}

const roles: { value: Role; title: string; description: string }[] = [
  { value: "mentor", title: "Mentor", description: "A college student supporting a local school." },
  { value: "school", title: "School", description: "A school joining hands-on learning." },
  { value: "admin", title: "College admin", description: "A college coordinator managing RAWE." },
];

function isStudyYear(value: string): value is "1" | "2" | "3" | "4" {
  return value === "1" || value === "2" || value === "3" || value === "4";
}

export function RegisterForm() {
  const registerMutation = useRegister();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "mentor",
      name: "",
      email: "",
      password: "",
      college: "",
      year: "1",
      phone: "",
    },
  });
  const errors = form.formState.errors;

  useEffect(() => {
    const role = new URLSearchParams(window.location.search).get("role");
    if (role === "mentor" || role === "school" || role === "admin") {
      setSelectedRole(role);
      form.setValue("role", role);
    }
  }, [form]);

  function chooseRole(value: string) {
    if (value === "mentor" || value === "school" || value === "admin") {
      setSelectedRole(value);
      form.setValue("role", value);
      form.clearErrors();
    }
  }

  function errorFor(name: string) {
    const error = (errors as Record<string, { message?: string }>)[name];
    return error?.message;
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form
          className="space-y-5"
          noValidate
          onSubmit={form.handleSubmit((values) =>
            registerMutation.mutate(values, {
              onError: (error) =>
                mapServerFieldErrors<RegisterFormValues>(error, (name, value) =>
                  form.setError(name, value),
                ),
            }),
          )}
        >
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium">I’m joining as a</legend>
            <RadioGroup
              aria-label="Choose your role"
              className="grid gap-3 sm:grid-cols-3"
              onValueChange={chooseRole}
              value={selectedRole ?? ""}
            >
              {roles.map((role) => (
                <label
                  className={`border-border flex cursor-pointer gap-3 rounded-lg border p-3 transition-colors ${selectedRole === role.value ? "border-forest-700 bg-forest-50" : "hover:bg-muted"}`}
                  htmlFor={`role-${role.value}`}
                  key={role.value}
                >
                  <RadioGroupItem
                    className="mt-1"
                    id={`role-${role.value}`}
                    value={role.value}
                  />
                  <span>
                    <span className="block text-sm font-semibold">{role.title}</span>
                    <span className="text-muted-foreground mt-1 block text-xs">{role.description}</span>
                  </span>
                </label>
              ))}
            </RadioGroup>
          </fieldset>

          {!selectedRole ? (
            <p className="text-muted-foreground text-sm">
              Choose a role to see the details needed for your account.
            </p>
          ) : (
          <div className="space-y-4">
            <FormInput
              autoComplete="name"
              autoFocus
              error={errorFor("name")}
              id="register-name"
              label="Your name"
              {...form.register("name")}
            />
            <FormInput
              autoComplete="email"
              error={errorFor("email")}
              id="register-email"
              label="Email"
              type="email"
              {...form.register("email")}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      autoComplete="new-password"
                      value={String(field.value ?? "")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {selectedRole === "mentor" && (
              <>
                <FormInput
                  autoComplete="organization"
                  error={errorFor("college")}
                  id="register-college"
                  label="College"
                  {...form.register("college")}
                />
                <div className="grid gap-2">
                  <label className="text-sm font-medium" htmlFor="register-year">Year of study</label>
                  <Select
                    defaultValue="1"
                    onValueChange={(value) => {
                      if (isStudyYear(value)) {
                        form.setValue("year", value, { shouldValidate: true });
                      }
                    }}
                  >
                    <SelectTrigger aria-label="Year of study" id="register-year">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["1", "2", "3", "4"].map((year) => (
                        <SelectItem key={year} value={year}>Year {year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errorFor("year") && <p className="text-destructive text-sm">{errorFor("year")}</p>}
                </div>
                <FormInput
                  autoComplete="tel"
                  error={errorFor("phone")}
                  id="register-phone"
                  label="Phone (optional)"
                  type="tel"
                  {...form.register("phone")}
                />
              </>
            )}
            {selectedRole === "school" && (
              <>
                <FormInput error={errorFor("schoolName")} id="register-school" label="School name" {...form.register("schoolName")} />
                <FormInput error={errorFor("village")} id="register-village" label="Village" {...form.register("village")} />
                <FormInput error={errorFor("district")} id="register-district" label="District" {...form.register("district")} />
                <FormInput
                  error={errorFor("studentCount")}
                  id="register-student-count"
                  inputMode="numeric"
                  label="Number of students"
                  type="number"
                  {...form.register("studentCount", { valueAsNumber: true })}
                />
              </>
            )}
            {selectedRole === "admin" && (
              <>
                <FormInput error={errorFor("collegeName")} id="register-college-name" label="College name" {...form.register("collegeName")} />
                <FormInput error={errorFor("designation")} id="register-designation" label="Designation" {...form.register("designation")} />
              </>
            )}
          </div>
          )}
          {selectedRole && <Button className="w-full" disabled={registerMutation.isPending} type="submit">
            {registerMutation.isPending && <LoaderCircle aria-hidden="true" className="animate-spin" />}
            Create account
          </Button>}
        </form>
      </Form>
      <p className="text-muted-foreground text-sm">
        Already have an account?{" "}
        <Link className="text-forest-700 font-medium underline" href="/login">Log in</Link>
      </p>
    </div>
  );
}
