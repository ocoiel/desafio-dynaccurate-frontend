import { promises as fs } from "fs"
import path from "path"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { z } from "zod"

import { medSchema } from "@/types/medicament-schema"
import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import { columns } from "@/components/table/columns"
import { DataTable } from "@/components/table/data-table"
import { UserNav } from "@/components/user-nav"

export const metadata: Metadata = {
  title: "Tasks",
  description: "A task and issue tracker build using Tanstack Table.",
}

// Simulate a database read for tasks.
async function getMedicaments() {
  const data = await fetch("http://localhost:3333/med")

  const medicaments = await data.json()

  return z.array(medSchema).parse(medicaments)
}

export default async function IndexPage() {
  const medicaments = await getMedicaments()

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
          Beautifully designed components <br className="hidden sm:inline" />
          built with Radix UI and Tailwind CSS.
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
          Accessible and customizable components that you can copy and paste
          into your apps. Free. Open Source. And Next.js 13 Ready.
        </p>
      </div>
      <div className="flex gap-4">
        <Link
          href={siteConfig.links.docs}
          target="_blank"
          rel="noreferrer"
          className={buttonVariants({ size: "lg" })}
        >
          Documentation
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
      <DataTable data={medicaments} columns={columns} />
    </section>
  )
}
