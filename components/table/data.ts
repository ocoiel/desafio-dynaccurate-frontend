import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpCircle,
  CheckCircle2,
  Circle,
  HelpCircle,
  XCircle,
} from "lucide-react"

export const labels = [
  {
    value: "bug",
    label: "Bug",
  },
  {
    value: "feature",
    label: "Feature",
  },
  {
    value: "documentation",
    label: "Documentation",
  },
]

export const statuses = [
  {
    value: "Ideia",
    label: "Ideia",
    icon: HelpCircle,
  },
  {
    value: "A fazer",
    label: "a fazer",
    icon: Circle,
  },
  {
    value: "Em progresso",
    label: "em progresso",
    icon: ArrowUpCircle,
  },
  {
    value: "Concluído",
    label: "concluido",
    icon: CheckCircle2,
  },
  {
    value: "Cancelado",
    label: "cancelado",
    icon: XCircle,
  },
]

export const priorities = [
  {
    label: "Baixa",
    value: "baixa",
    icon: ArrowDown,
  },
  {
    label: "Média",
    value: "media",
    icon: ArrowRight,
  },
  {
    label: "Alta",
    value: "alta",
    icon: ArrowUp,
  },
]
