"use client"

import { useState } from "react"
import { createMedicament } from "@/service/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ArrowRight } from "lucide-react"
import { Controller, useForm, type FieldError } from "react-hook-form"

import { Medicaments, medSchema } from "@/types/medicament-schema"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"
import { Dropzone } from "@/components/uploader"

// JSON.stringify(error) will not work, because of circulare structure. So we need this helper.
const formatErrors = (errors: Record<string, FieldError>) =>
  Object.keys(errors).map((key) => ({
    key,
    message: errors[key].message,
  }))

type AlertType = "error" | "warning" | "success"

const Alert = ({ children, type }: { children: string; type: AlertType }) => {
  const backgroundColor =
    type === "error" ? "tomato" : type === "warning" ? "orange" : "powderBlue"

  return <div style={{ padding: "0 10", backgroundColor }}>{children}</div>
}

const AlertInput = ({ children }: { children: React.ReactNode }) =>
  Boolean(children) ? (
    <span role="alert" style={{ color: "tomato" }}>
      {children}
    </span>
  ) : null

export default function CreateMedicament() {
  const [hasDescription, setHasDescription] = useState(false)
  const [viewDevMode, setViewDevMode] = useState(false)
  const [id_state, setId] = useState("")

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting, isSubmitted, isDirty, isValid },
  } = useForm<Medicaments>({
    mode: "onChange",
    resolver: zodResolver(
      medSchema.omit({
        id: true,
        image_url: true,
      })
    ),
  })

  // The onSubmit function is invoked by RHF only if the validation is OK.
  async function onSubmit(medicament: Medicaments) {
    const { id } = await mutateAsync(medicament)
    setId(id)

    toast({
      title: "Medicamento criado com sucesso!",
      duration: 3000,
    })
  }

  const queryClient = useQueryClient()

  const { mutateAsync, data } = useMutation({
    mutationKey: ["newMedicament"],
    mutationFn: (medicament: Medicaments) => createMedicament(medicament),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["medicament"],
      })
      return data
    },
  })

  const { toast } = useToast()

  return (
    <>
      {!isSubmitted ? (
        <div className="mb-4 p-4">
          <p className="text-center text-base text-slate-500 dark:text-slate-400">
            Parte 1
          </p>
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
                {...register("name", {
                  required: "Campo obrigatário",
                  minLength: 2,
                })}
              />
              <AlertInput>{errors?.name?.message}</AlertInput>

              <span
                onClick={() => setHasDescription(!hasDescription)}
                className="flex w-52 cursor-pointer items-center text-sm text-neutral-500 transition-colors duration-100 hover:text-neutral-400"
              >
                {hasDescription ? (
                  <>
                    <Icons.remove className="mr-1 h-4 w-4" />
                    <span>Remover descrição</span>
                  </>
                ) : (
                  <>
                    <Icons.add className="mr-1 h-4 w-4" />
                    <span>Adicionar descrição</span>
                  </>
                )}
              </span>
              {hasDescription && (
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="description">
                    Descrição{" "}
                    <span className="text-neutral-500">(opcional)</span>
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
                    {...register("expiration_date", {
                      valueAsDate: true,
                    })}
                    aria-invalid={Boolean(errors.expiration_date)}
                  />
                  <AlertInput>{errors?.expiration_date?.message}</AlertInput>
                </div>
              </div>
              <div className="flex w-full flex-row justify-around gap-x-4">
                <div className="w-full">
                  <Label htmlFor="status">Status</Label>
                  <Controller
                    name="status"
                    control={control}
                    defaultValue={null}
                    render={({ field }) => (
                      <Select
                        onValueChange={(selected) => field.onChange(selected)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ideia">Ideia</SelectItem>
                          <SelectItem value="a fazer">A Fazer</SelectItem>
                          <SelectItem value="em progresso">
                            Em Progresso
                          </SelectItem>
                          <SelectItem value="concluido">Concluído</SelectItem>
                          <SelectItem value="cancelado">Cancelado</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="w-full">
                  <Label>Prioridade</Label>
                  <Controller
                    name="priority"
                    control={control}
                    defaultValue={null}
                    render={({ field }) => (
                      <Select
                        onValueChange={(selected) => field.onChange(selected)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Prioridade" />
                        </SelectTrigger>
                        <SelectContent {...register("priority")}>
                          <SelectItem value="baixa">Baixa</SelectItem>
                          <SelectItem value="media">Média</SelectItem>
                          <SelectItem value="alta">Alta</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </div>
            <span
              onClick={() => setViewDevMode(!viewDevMode)}
              className="mt-4 flex w-fit cursor-pointer flex-col items-center gap-x-4 text-left text-sm text-neutral-500 transition-colors duration-100 hover:text-neutral-400"
            >
              {viewDevMode ? (
                <>
                  <Icons.remove className="mr-1 h-4 w-4" />{" "}
                  <span>Sair Dev mode ✨</span>
                </>
              ) : (
                <>
                  <Icons.add className="mr-1 h-4 w-4" />{" "}
                  <span>Dev mode ✨</span>
                </>
              )}
            </span>
            {viewDevMode && (
              <div className="flex flex-col space-y-2">
                <pre>{JSON.stringify(formatErrors, null, 2)}</pre>
                <pre>data = {JSON.stringify(watch(), null, 2)}</pre>
                <pre>
                  formState ={" "}
                  {JSON.stringify(
                    { isSubmitting, isSubmitted, isDirty, isValid },
                    null,
                    2
                  )}
                </pre>
              </div>
            )}

            <Button
              type="submit"
              className="mt-8 gap-2"
              disabled={isSubmitting || !isValid}
            >
              <span>Próximo</span>
              <ArrowRight className="mr-4 h-4 w-4" />
            </Button>
          </form>
        </div>
      ) : (
        <div className="">
          <p className="text-center text-base text-slate-500 dark:text-slate-400">
            Parte 2
          </p>
          <h2 className="mt-8 scroll-m-20 text-center text-3xl font-semibold tracking-tight">
            Faça upload da imagem do medicamento
          </h2>
          <p className="mb-4 text-center text-base text-slate-500 dark:text-slate-400">
            Arraste e solte o arquivo ou clique no botão abaixo para começar o
            upload
          </p>
          <div className="my-12 w-full items-center justify-center px-36">
            {id_state.length > 0 || data?.id ? (
              <Dropzone medicament_id={id_state || data?.id} />
            ) : (
              <>Reinicie a página e tente novamente...</>
            )}
          </div>
        </div>
      )}
    </>
  )
}
