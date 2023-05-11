"use client"

import { useState } from "react"
import { revalidatePath, revalidateTag } from "next/cache"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type FieldError } from "react-hook-form"

import { Medicaments, medSchema } from "@/types/medicament-schema"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"
import { Uploader } from "@/components/uploader"

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

export default function CreateMedicament() {
  const [hasDescription, setHasDescription] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isSubmitted, isDirty, isValid },
  } = useForm<Omit<Medicaments, "id">>({
    mode: "onChange",
    resolver: zodResolver(medSchema.omit({ id: true })),
  })

  // The onSubmit function is invoked by RHF only if the validation is OK.
  function onSubmit(medicament: Omit<Medicaments, "id">) {
    fetch("http://127.0.0.1:3333/med/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: medicament.name,
        price: medicament.price,
        expiration_date: new Date(medicament.expiration_date),
        image_url: "https://picsum.photos/200",
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .then(() => revalidatePath("/"))
      .then(() => revalidateTag("medicament"))
      .catch((err) => console.error(err))
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
        className="m-6 flex max-w-3xl flex-col rounded-lg border border-t-4 border-border bg-background p-6 md:mx-auto"
        noValidate
      >
        {/* use aria-invalid to indicate field contain error for accessiblity reasons. */}
        <div className="flex w-full flex-col space-y-4">
          <Label htmlFor="name">Nome</Label>
          <Input
            type="text"
            placeholder="Nome do medicamento"
            id="name"
            aria-invalid={Boolean(errors.name)}
            autoFocus
            required
            {...register("name")}
          />
          {/* <AlertInput>{errors?.firstName?.message}</AlertInput> */}

          <span
            onClick={() => setHasDescription(!hasDescription)}
            className="flex w-52 cursor-pointer items-center text-sm text-neutral-500 transition-colors duration-100 hover:text-neutral-400"
          >
            <Icons.add className="mr-1 h-4 w-4" />
            {hasDescription ? "Remover descrição" : "Adicionar descrição"}
          </span>
          {hasDescription && (
            <div className="flex flex-col space-y-2">
              <Label htmlFor="description">
                Descrição <span className="text-neutral-500">(opcional)</span>
              </Label>{" "}
              <Textarea
                placeholder="Fale mais, fale mais 👀"
                {...register("description")}
              />
            </div>
          )}

          <div className="flex w-full flex-row justify-around gap-x-4">
            <div className="w-full">
              <Label>Preço</Label>
              <Input
                type="number"
                placeholder="Preço"
                aria-invalid={Boolean(errors.price)}
                {...register("price", {
                  valueAsNumber: true,
                  min: 0,
                })}
              />
              <AlertInput>{errors?.price?.message}</AlertInput>
            </div>

            <div className="w-full">
              <Label>Data de validade</Label>
              <Input
                type="date"
                placeholder="Data de validade"
                {...register("expiration_date")}
                aria-invalid={Boolean(errors.expiration_date)}
              />
              <AlertInput>{errors?.expiration_date?.message}</AlertInput>
            </div>
          </div>
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
        {/* <Uploader medicament_id="" /> */}
      </form>
    </div>
  )
}
