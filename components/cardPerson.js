"use client"

// Components
import Icon from "@/components/icon";

import {
    BadgeCheckIcon,
    BellIcon,
    CreditCardIcon,
    LogOutIcon,
} from "lucide-react"

import {
    Avatar
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function CardPerson() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger render={
                <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="flex items-center justify-center bg-primary">
                        {Icon("person", "text-on-primary text-[18px]")}
                    </Avatar>
                </Button>} />
            <DropdownMenuContent align="end" className="w-fit">
                <DropdownMenuGroup>
                    <div className="flex items-center gap-3 px-2 py-2 text-xs">
                        <div className="flex items-center gap-1.5">
                            <Avatar className="flex items-center justify-center bg-primary">
                                {Icon("person", "text-on-primary text-[18px]")}
                            </Avatar>
                            <div className="">
                                <p>Mateus Saraiva</p>
                                <p>msaraiva@lopes.com.br</p>
                            </div>
                        </div>
                    </div>
                    <DropdownMenuItem className="text-xs">
                        {Icon("settings", "text-primary")}
                        Configuração
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-xs">
                    {Icon("exit_to_app", "text-primary")}
                    Sign Out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
