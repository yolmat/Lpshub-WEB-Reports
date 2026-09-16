// Components
import CardPerson from "@/components/cardPerson";
import Logo from "@/components/logo";
import Search from "@/components/search";
import StatusPerson from "@/components/statusServer";
import ThemeToggle from "@/components/ThemeToggle";

export default function ReportsHeader() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-surface-container-lowest/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
            <div className="h-14 w-full px-space-xl flex items-center justify-between gap-space-lg">
                <div className="flex items-center gap-space-md shrink-0">

                    <Logo />

                    <div className="hidden sm:flex flex-col">
                        <span className="font-headline-sm leading-none">LpsHub - Reports</span>
                        <span className="font-caption text-on-surface-variant leading-none">Relatórios SAP</span>
                    </div>

                    <StatusPerson />

                </div>

                <Search />

                <div className="flex items-center gap-space-sm shrink-0 justify-center">

                    <ThemeToggle />

                    <CardPerson />
                </div>

            </div>
        </header>

    )
}