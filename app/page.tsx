"use client"

import { Metadata } from "next"
import Link from "next/link"
import { getMedicaments } from "@/service/api"
import { useQuery } from "@tanstack/react-query"

import { siteConfig } from "@/config/site"
import { RequestAPI, fetcher } from "@/lib/fetcher"
import { buttonVariants } from "@/components/ui/button"
import { ListMedicaments } from "@/components/listMedicaments"
import { columns } from "@/components/table/columns"
import { DataTable } from "@/components/table/data-table"
import { UserNav } from "@/components/user-nav"

// export const dynamic = "force-dynamic"

// export const metadata: Metadata = {
//   title: "Tasks",
//   description: "A task and issue tracker build using Tanstack Table.",
// }

export default async function IndexPage() {
  // const { items: medicaments } = await fetcher<RequestAPI>(
  //   "http://127.0.0.1:3333/med",
  //   ["medicament"]
  // )

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
          Desafio - Desenvolvedor Frontend <br className="hidden sm:inline" />
          para a startup Dynaccurate.
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
          O Desafio consiste consiste em desenvolver uma aplicação web para a
          gestão de medicamentos.
        </p>
      </div>
      <div className="flex gap-4">
        <Link
          href={"/new"}
          rel="noreferrer"
          className={buttonVariants({ size: "lg" })}
        >
          Criar novo medicamento
        </Link>
        <Link
          target="_blank"
          rel="noreferrer"
          href={siteConfig.links.github}
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          GitHub
        </Link>
      </div>
      <div className="flex items-center space-x-2">
        <UserNav />
      </div>
      <ListMedicaments />
    </section>
  )
}
