// Components
import Icon from "@/components/icon";
import Logo from "@/components/logo";
import ThemeToggle from "@/components/ThemeToggle";

export default function ReportsHeader({ dark }) {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-surface-container-lowest/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
            <div className="h-14 w-full px-space-lg flex items-center justify-between gap-space-md">
                <div className="flex items-center gap-space-md shrink-0">

                    <Logo
                        dark={dark}
                    />
                    <div className="hidden sm:flex flex-col">
                        <span className="font-headline-sm leading-none">LpsHub - Reports</span>
                        <span className="font-caption text-on-surface-variant leading-none">Relatórios SAP</span>
                    </div>
                    <span className="hidden lg:inline px-space-xs py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm tracking-wider uppercase">
                        PROD - V1
                    </span>
                </div>

                <div className="flex items-center gap-space-sm shrink-0">
                    <div className="relative hidden sm:flex items-center w-64 lg:w-80">
                        {Icon("search", "absolute left-2.5 text-on-surface-variant text-[18px]")}
                        <input
                            className="w-full h-8 pl-10 pr-space-sm rounded-lg bg-surface-container-low text-on-surface font-body-sm placeholder:text-on-surface-variant focus:outline-none focus:bg-surface-container-lowest"
                            placeholder="Pesquisar transação, relatório ou código..."
                        />
                    </div>

                    <ThemeToggle />

                    <div className="flex items-center gap-space-sm pl-space-xs">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                            {Icon("person", "text-on-primary text-[18px]")}
                        </div>
                        <div className="hidden md:flex flex-col text-left">
                            <span className="font-label-md leading-none">Eduardo Santos</span>
                            <span className="font-caption text-on-surface-variant leading-none mt-1">Controladoria & Finanças</span>
                        </div>
                    </div>
                </div>

                <div className="px-space-md pt-space-sm">
                    <div className="p-space-sm rounded-lg bg-surface-container flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="font-caption text-on-surface-variant">Servidor SAP</span>
                            <span className="font-data-mono font-semibold">RFC: CONN_OK</span>
                        </div>
                        <span className="w-2 h-2 rounded-full bg-success" />
                    </div>
                </div>

            </div>
        </header>

    )
}