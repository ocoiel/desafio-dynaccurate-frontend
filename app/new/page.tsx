"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type FieldError } from "react-hook-form"
import { z } from "zod"

import { Input } from "@/components/ui/input"

// JSON.stringify(error) will not work, because of circulare structure. So we need this helper.
const formatErrors = (errors: Record<string, FieldError>) =>
  Object.keys(errors).map((key) => ({
    key,
    message: errors[key].message,
  }))

/* ---------- Some UI components ----------*/

type AlertType = "error" | "warning" | "success"

// Global Alert div.
const Alert = ({ children, type }: { children: string; type: AlertType }) => {
  const backgroundColor =
    type === "error" ? "tomato" : type === "warning" ? "orange" : "powderBlue"

  return <div style={{ padding: "0 10", backgroundColor }}>{children}</div>
}

// Use role="alert" to announce the error message.
const AlertInput = ({ children }: { children: React.ReactNode }) =>
  Boolean(children) ? (
    <span role="alert" style={{ color: "tomato" }}>
      {children}
    </span>
  ) : null

/* ---------- Zod schema et TS type ----------*/

const titles = ["Mr", "Mrs", "Miss", "Dr"] as const // as const is mandatory to get litteral types in UserType.

// Describe the correctness of data's form.
const userSchema = z
  .object({
    firstName: z.string().max(36),
    lastName: z
      .string()
      .min(1, { message: "The lastName is required." })
      .max(36),
    mobileNumber: z.string().min(10).max(13).optional(),
    email: z
      .string()
      .min(1, "The email is required.")
      .email({ message: "The email is invalid." }),
    confirmEmail: z.string().min(1, "The email is required."),
    // At first, no option radio are checked so this is null. So the error is "Expected string, received null".
    // So we need to accept first string or null, in order to apply refine to set a custom message.
    isDeveloper: z.union([z.string(), z.null()]).refine((val) => val !== null, {
      message: "Please, make a choice!",
    }),
    title: z.enum(titles),
    age: z
      .number({ invalid_type_error: "Un nombre est attendu" })
      .int()
      .refine((val) => val >= 18, { message: "Vous devez être majeur" }),
  })
  // The refine method is used to add custom rules or rules over multiple fields.
  .refine((data) => data.email === data.confirmEmail, {
    message: "Emails don't match.",
    path: ["confirmEmail"], // Set the path of this error on the confirmEmail field.
  })

// Infer the TS type according to the zod schema.
type UserType = z.infer<typeof userSchema>

export default function CreateMedicament() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isSubmitted, isDirty, isValid },
  } = useForm<UserType>({
    mode: "onChange",
    resolver: zodResolver(userSchema), // Configuration the validation with the zod schema.
    defaultValues: {
      isDeveloper: undefined,
      mobileNumber: "666-666666",
      firstName: "toto",
      lastName: "titi",
      email: "",
      confirmEmail: "",
      title: "Miss",
    },
  })

  // The onSubmit function is invoked by RHF only if the validation is OK.
  const onSubmit = (user: UserType) => {
    console.log("dans onSubmit", user)
  }

  return (
    <div className="mb-4 p-4">
      <h2 className="mt-8 scroll-m-20 text-center text-3xl font-semibold tracking-tight">
        Crie o medicamento
      </h2>
      <p className="text-center text-base text-slate-500 dark:text-slate-400">
        Preencha os campos abaixo para cadastrar o medicamento.
      </p>

      {Boolean(Object.keys(errors)?.length) && (
        <Alert type="error">There are errors in the form.</Alert>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="m-6 flex max-w-3xl flex-col rounded-lg border-t-4 border-black bg-white p-6 dark:border-white dark:bg-neutral-900 md:mx-auto"
        noValidate
      >
        {/* use aria-invalid to indicate field contain error for accessiblity reasons. */}
        <div className="flex w-full flex-col space-y-4">
          <Input
            type="text"
            placeholder="First name is not mandatory"
            {...register("firstName")}
            aria-invalid={Boolean(errors.firstName)}
          />
          <AlertInput>{errors?.firstName?.message}</AlertInput>

          <Input
            type="text"
            placeholder="Last name (mandatory)"
            {...register("lastName")}
            aria-invalid={Boolean(errors.lastName)}
          />
          <AlertInput>{errors?.lastName?.message}</AlertInput>

          <Input
            type="text"
            placeholder="Email (mandatory)"
            {...register("email")}
            aria-invalid={Boolean(errors.email)}
          />
          <AlertInput>{errors?.email?.message}</AlertInput>

          <Input
            type="text"
            placeholder="The same email as above"
            {...register("confirmEmail")}
            aria-invalid={Boolean(errors.confirmEmail)}
          />
          <AlertInput>{errors?.confirmEmail?.message}</AlertInput>

          <input
            type="tel"
            placeholder="Mobile number (mandatory)"
            {...register("mobileNumber")}
            aria-invalid={Boolean(errors.mobileNumber)}
          />
          <AlertInput>{errors?.mobileNumber?.message}</AlertInput>

          <select {...register("title")} aria-invalid={Boolean(errors.title)}>
            {titles.map((elt) => (
              <option key={elt} value={elt}>
                {elt}
              </option>
            ))}
          </select>

          <label>
            Âge
            <input
              type="number"
              placeholder="Age"
              {...register("age", { valueAsNumber: true })}
              aria-invalid={Boolean(errors.age)}
            />
          </label>
          <AlertInput>{errors?.age?.message}</AlertInput>

          <div>
            <p>Are you a developer? (mandatory)</p>
            <label>
              Yes
              <input {...register("isDeveloper")} type="radio" value="Yes" />
            </label>
          </div>
          <div>
            <label>
              No
              <input {...register("isDeveloper")} type="radio" value="No" />
            </label>
          </div>
          <AlertInput>{errors?.isDeveloper?.message}</AlertInput>
        </div>

        <input
          type="submit"
          title="koeeee"
          disabled={isSubmitting || !isValid}
        />
        <pre>{JSON.stringify(formatErrors, null, 2)}</pre>
        <pre>{JSON.stringify(watch(), null, 2)}</pre>
        <pre>
          formState ={" "}
          {JSON.stringify(
            { isSubmitting, isSubmitted, isDirty, isValid },
            null,
            2
          )}
        </pre>
      </form>
    </div>
  )
}
