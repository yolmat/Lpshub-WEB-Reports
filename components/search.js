// Components shadcn
import { Input } from "@base-ui/react"
import Icon from "@/components/icon"

export default function Search() {
    return (
        <div className="relative flex items-center w-64 lg:w-80">
            {Icon("search", "absolute left-2.5 text-on-surface-variant text-[18px]")}

            <Input
                className="w-full h-8 pl-10 pr-space-sm rounded-lg bg-surface-container-low text-on-surface font-body-sm placeholder:text-on-surface-variant focus:outline-1 focus:bg-surface-container-lowest"
                placeholder="Pesquisar transação, relatório ou código..."
            />
        </div>
    )
}