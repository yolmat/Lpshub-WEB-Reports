export default function StatusPerson() {
    return (
        <div className="hidden sm:flex">
            <div className="p-space-sm rounded-lg bg-surface-container flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="font-caption text-on-surface-variant">Servidor SAP</span>
                    <span className="font-data-mono font-semibold">OPERANDO</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-success ml-1.5" />
            </div>
        </div>
    )
}