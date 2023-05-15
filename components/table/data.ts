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
    value: "ideia",
    label: "Ideia",
    icon: HelpCircle,
  },
  {
    value: "a fazer",
    label: "A fazer",
    icon: Circle,
  },
  {
    value: "em progresso",
    label: "Em progresso",
    icon: ArrowUpCircle,
  },
  {
    value: "concluido",
    label: "Concluído",
    icon: CheckCircle2,
  },
  {
    value: "cancelado",
    label: "Cancelado",
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
