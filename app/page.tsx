"use client"

// Study to discover why this not can be a server component with React Query
// Give a try to newest way to handle this stuff with `sever actions` from 13.4
// Like revalidadeTag, experimental_form and etc...
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import { ListMedicaments } from "@/components/list-medicaments"

// export const dynamic = "force-dynamic"

export default function IndexPage() {
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
      <ListMedicaments />
    </section>
  )
}
