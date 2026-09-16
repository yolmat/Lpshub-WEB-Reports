import Icon from "@/components/icon";

export default function Metric({ label, value, tone = "default", dot }) {
    const toneClass = {
        default: "text-on-surface",
        tertiary: "text-tertiary",
        error: "text-error",
        success: "text-success",
    }[tone];

    return (
        <div className="bg-surface-container-lowest rounded-xl p-space-md flex flex-col justify-between shadow-sm">
            <span className={`font-caption uppercase tracking-wider font-semibold ${toneClass}`}>{label}</span>
            <div className="flex items-baseline justify-between mt-1">
                <span className={`font-data-mono text-headline-sm font-bold tabular-nums ${toneClass}`}>{value}</span>
                {dot ? <span className={`w-2 h-2 rounded-full ${toneClass.replace("text-", "bg-")}`} /> : Icon("account_balance", "text-on-surface-variant text-[18px]")}
            </div>
        </div>
    );
}