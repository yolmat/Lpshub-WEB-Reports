"use client";

// Components
import ReportsHeader from "@/components/reports/shared/reportsHeader";
import Icon from "@/components/icon"
import Metric from "@/components/reports/shared/metric";
import { useMemo, useState } from "react";

const rows = [
  ["100482", "NF-948102", "PetroTech Brasil S.A.", "02/01/2026", "15/01/2026", "Faturamento", "R$ 142.850,00", "R$ 142.850,00", "Vencido", "Carlos Mendes"],
  ["100519", "NF-948215", "Suzano Papel & Celulose", "04/01/2026", "28/01/2026", "Serviço", "R$ 89.400,00", "R$ 89.400,00", "Em aberto", "Mariana Lima"],
  ["100204", "NF-947930", "Gerdau Aços Longos", "20/12/2025", "05/01/2026", "Faturamento", "R$ 310.200,00", "R$ 0,00", "Pago", "Roberto Faria"],
  ["100788", "NF-948330", "Ambev Logística Nacional", "08/01/2026", "22/01/2026", "Faturamento", "R$ 540.000,00", "R$ 540.000,00", "Em aberto", "Eduardo Santos"],
  ["100912", "NF-948411", "Votorantim Cimentos S.A.", "10/01/2026", "30/01/2026", "Adiantamento", "R$ 275.500,00", "R$ 275.500,00", "Em aberto", "Carlos Mendes"],
  ["100344", "NF-947701", "Natura Cosméticos S.A.", "15/12/2025", "10/01/2026", "Faturamento", "R$ 195.400,00", "R$ 195.400,00", "Vencido", "Mariana Lima"],
  ["100650", "NF-948512", "Magazine Varejo Total", "11/01/2026", "25/01/2026", "Faturamento", "R$ 412.000,00", "R$ 412.000,00", "Em aberto", "Eduardo Santos"],
  ["100115", "NF-947540", "Vale Mineração Global", "02/12/2025", "02/01/2026", "Serviço", "R$ 820.000,00", "R$ 0,00", "Pago", "Roberto Faria"],
  ["100802", "NF-948601", "Localiza Rent a Car S.A.", "14/01/2026", "29/01/2026", "Serviço", "R$ 163.250,00", "R$ 163.250,00", "Em aberto", "Carlos Mendes"],
  ["100411", "NF-947889", "Klabin Embalagens S.A.", "18/12/2025", "12/01/2026", "Faturamento", "R$ 345.950,00", "R$ 345.950,00", "Vencido", "Mariana Lima"],
  ["100984", "NF-948700", "WEG Equipamentos Elétricos", "16/01/2026", "31/01/2026", "Faturamento", "R$ 528.000,00", "R$ 528.000,00", "Em aberto", "Eduardo Santos"],
  ["100192", "NF-947321", "Embraer Defesa & Segurança", "10/12/2025", "08/01/2026", "Faturamento", "R$ 667.880,00", "R$ 0,00", "Pago", "Roberto Faria"],
];

const clients = [
  ["PetroTech Brasil S.A.", true],
  ["Suzano Papel & Celulose", true],
  ["Ambev Logística Nacional", true],
  ["Gerdau Aços Longos S.A.", false],
  ["Vale Mineração Global", false],
];

function Status({ value }) {
  const styles = {
    Vencido: "bg-error-container text-error",
    "Em aberto": "bg-tertiary-fixed text-tertiary",
    Pago: "bg-success-container text-success",
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-caption font-bold ${styles[value]}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {value}
    </span>
  );
}

export default function ContasReceberPage() {
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [density, setDensity] = useState("normal");
  const [executing, setExecuting] = useState(false);
  const [search, setSearch] = useState("");
  const [clientSearch, setClientSearch] = useState("");
  const [selectedClients, setSelectedClients] = useState(
    Object.fromEntries(clients.map(([name, checked]) => [name, checked]))
  );

  const filteredRows = useMemo(() => {
    const query = search.toLowerCase().trim();
    return rows.filter((row) => {
      const matchesSearch =
        !query || row.join(" ").toLowerCase().includes(query);
      const selected = Object.entries(selectedClients)
        .filter(([, checked]) => checked)
        .map(([name]) => name);

      const matchesClient =
        selected.length === 0 || selected.includes(row[2]) ||
        selected.includes(`${row[2]}.`);
      return matchesSearch && matchesClient;
    });
  }, [search, selectedClients]);

  function executeReport() {
    setExecuting(true);
    globalThis.setTimeout(() => setExecuting(false), 600);
  }

  function clearFilters() {
    setSearch("");
    setClientSearch("");
    setSelectedClients(Object.fromEntries(clients.map(([name]) => [name, true])));
  }

  function toggleClient(name) {
    setSelectedClients((current) => ({ ...current, [name]: !current[name] }));
  }

  return (
    <div>
      <div className="min-h-screen bg-surface text-on-surface font-body-md">

        <ReportsHeader />

        <div className="">
          <main className="relative pt-14 min-h-screen">
            <div className="px-space-xl py-space-lg flex flex-col gap-space-lg max-w-[1720px] mx-auto w-full">
              <section className="flex flex-col xl:flex-row xl:items-center justify-between gap-space-md">
                <div className="flex flex-col gap-space-xs">

                  <div className="flex items-center gap-space-sm flex-wrap">
                    <h1 className="font-headline-lg font-bold tracking-tight">Contas a Receber — Partidas em Aberto</h1>
                    <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-data-mono font-semibold">
                      {Icon("terminal", "text-[13px]")} [Transação: ZFI_REC01]
                    </span>
                    <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded bg-surface-container text-tertiary font-label-sm">ALV Grid v4.8 Active</span>
                  </div>

                  <p className="text-on-surface-variant max-w-3xl">
                    Relatório operacional detalhado de títulos a receber por competência, carteira de clientes, ageing de mora e status de compensação financeira.
                  </p>
                </div>

                <div className="flex items-center gap-space-xs flex-wrap shrink-0">
                  {[
                    ["bookmark", "Salvar Variante"],
                    ["print", "Imprimir / PDF"],
                    ["table_chart", "Exportar CSV"],
                  ].map(([ico, label]) => (
                    <button type="button" key={label} className="toolbar-button">{Icon(ico, "text-[17px]")}<span>{label}</span></button>
                  ))}
                  <button type="button" className="toolbar-button primary">{Icon("download", "text-[18px]")}<span>Exportar Excel (XLSX)</span></button>
                </div>
              </section>

              <section className="panel flex flex-col gap-space-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-space-sm">
                    <div className="w-7 h-7 rounded bg-surface-container-high flex items-center justify-center text-primary">
                      {Icon("manage_search", "text-[18px]")}
                    </div>
                    <div>
                      <h2 className="font-headline-sm leading-tight">Critérios de Seleção</h2>
                    </div>
                  </div>
                  <div className="flex items-center gap-space-xs">
                    <button type="button" onClick={() => setFiltersOpen(!filtersOpen)} className="square-button">
                      {Icon(filtersOpen ? "keyboard_arrow_up" : "keyboard_arrow_down", "text-[18px]")}
                    </button>
                  </div>
                </div>

                {filtersOpen && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-space-md">
                    <FilterField label="Filial" code="BRANCH" iconName="expand_more">
                      <SelectField options={["001 — Matriz São Paulo", "002 — CD Betim / MG", "003 — Planta Camaçari / BA", "004 — Terminal Paranaguá / PR"]} />
                    </FilterField>
                  </div>
                )}

                <div className="flex items-center justify-end pt-space-xs">
                  <div className="flex items-center gap-space-sm">
                    <button type="button" onClick={clearFilters} className="toolbar-button">{Icon("restart_alt", "text-[16px]")} Limpar Filtros</button>
                    <button type="button" onClick={executeReport} disabled={executing} className="toolbar-button primary">
                      {Icon(executing ? "refresh" : "play_arrow", `text-[18px] ${executing ? "animate-spin" : ""}`)}
                      {executing ? "Executando RFC..." : "Executar Relatório (F8)"}
                    </button>
                  </div>
                </div>
              </section>

              <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm flex-1">
                  <Metric label="Total Geral" value="R$ 4.892.430,00" />
                  <Metric label="Em Aberto" value="R$ 2.410.150,00" tone="tertiary" dot />
                  <Metric label="Vencido" value="R$ 684.200,00" tone="error" dot />
                  <Metric label="Pago" value="R$ 1.798.080,00" tone="success" dot />
                </div>

                <div className="flex items-center gap-space-md shrink-0 flex-wrap justify-between lg:justify-end">
                  <div className="relative flex items-center">
                    {Icon("search", "absolute left-2 text-on-surface-variant text-[16px]")}
                    <input value={search} onChange={(e) => setSearch(e.target.value)} className="h-8 pl-10 pr-3 rounded-lg bg-surface-container-lowest shadow-sm focus:outline-none w-50 focus:w-100 transition-all" placeholder="Filtrar dados da tabela..." />
                  </div>
                </div>
              </section>

              <div className="flex items-center justify-between px-space-xs -mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-label-sm text-on-surface-variant">Exibindo <strong className="text-on-surface">{filteredRows.length ? "1–12" : "0"}</strong> de <strong className="text-on-surface">1.284</strong> registros</span>
                  <span className="text-outline-variant">•</span>
                  <span className="font-caption text-on-surface-variant">Tempo de resposta SAP RFC: 142ms</span>
                </div>
              </div>

              <div className="relative bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden mb-10">
                <div className="overflow-x-auto max-h-[620px] overflow-y-auto">
                  <table className="w-full text-left border-collapse min-w-[1240px]">
                    <thead className="sticky top-0 z-20 bg-surface-container-high shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                      <tr className="h-9 font-label-md text-on-surface-variant select-none">
                        {[
                          ["Cód. SAP", "sort"],
                          ["Documento", "unfold_more"],
                          ["Cliente / Razão Social", "filter_alt"],
                          ["Emissão", "calendar_month"],
                          ["Vencimento", "calendar_month"],
                          ["Categoria", "filter_list"],
                          ["Valor Original", "sort"],
                          ["Saldo Atual", "sort"],
                          ["Status", "tune"],
                          ["Responsável", null],
                          ["Ações", null],
                        ].map(([label, ico], index) => (
                          <th key={label} className={`px-space-md bg-surface-container-high ${index === 2 ? "min-w-[240px] relative" : ""} ${index === 6 || index === 7 ? "text-right" : ""} ${index === 8 || index === 10 ? "text-center" : ""}`} scope="col">
                            <div className={`flex items-center ${index === 6 || index === 7 || index === 8 || index === 10 ? "justify-center" : "justify-between"} gap-1`}>
                              <div className="flex items-center gap-1.5">
                                <span>{label}</span>
                                {index === 2 && <span className="w-2 h-2 rounded-full bg-primary" title="Filtro Ativo" />}
                              </div>
                              {ico && (
                                <button type="button" onClick={() => index === 2 && setPopoverOpen(!popoverOpen)} className={index === 2 && popoverOpen ? "w-6 h-6 rounded bg-primary-container text-on-primary-container flex items-center justify-center" : "hover:text-primary"}>
                                  {Icon(ico, "text-[14px]")}
                                </button>
                              )}
                            </div>

                            {index === 2 && popoverOpen && (
                              <div role="dialog" aria-label="Filtro de Clientes" className="absolute left-4 top-10 w-72 bg-surface-container-lowest rounded-xl shadow-xl p-space-md z-30 flex flex-col gap-space-sm text-on-surface">
                                <div className="flex items-center justify-between">
                                  <span className="font-label-md font-bold">Filtro de Clientes</span>
                                  <button type="button" onClick={() => setPopoverOpen(false)} className="w-5 h-5 rounded hover:bg-surface-container flex items-center justify-center">{Icon("close", "text-[14px]")}</button>
                                </div>
                                <div className="relative flex items-center">
                                  {Icon("search", "absolute left-2 text-on-surface-variant text-[15px]")}
                                  <input value={clientSearch} onChange={(e) => setClientSearch(e.target.value)} className="w-full h-7 pl-7 pr-2 rounded bg-surface-container-low focus:outline-none" placeholder="Pesquisar carteira..." />
                                </div>
                                <div className="flex flex-col gap-1 max-h-36 overflow-y-auto py-1">
                                  {clients.filter(([name]) => name.toLowerCase().includes(clientSearch.toLowerCase())).map(([name]) => (
                                    <label key={name} className="flex items-center gap-2 px-1 py-1 rounded hover:bg-surface-container cursor-pointer">
                                      <input type="checkbox" checked={!!selectedClients[name]} onChange={() => toggleClient(name)} className="w-3.5 h-3.5 accent-primary" />
                                      <span className="truncate">{name}</span>
                                    </label>
                                  ))}
                                </div>
                                <div className="flex items-center justify-between pt-1">
                                  <button type="button" onClick={() => setSelectedClients({})} className="font-label-sm text-on-surface-variant hover:text-on-surface">Limpar</button>
                                  <button type="button" onClick={() => setPopoverOpen(false)} className="px-space-sm py-1 rounded bg-primary text-on-primary font-label-sm shadow-sm">Aplicar</button>
                                </div>
                              </div>
                            )}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="text-on-surface">
                      {filteredRows.map((row, index) => (
                        <tr key={row[0]} className={`${density === "compact" ? "h-7" : "h-9"} ${index % 2 ? "bg-surface-container-low/40" : ""} hover:bg-surface-container transition-colors group`}>
                          <td className="px-space-md font-data-mono text-on-surface-variant font-medium">{row[0]}</td>
                          <td className="px-space-md font-data-mono font-semibold text-primary">
                            <span className="flex items-center gap-1">{Icon("description", "text-[15px]")}{row[1]}</span>
                          </td>
                          <td className="px-space-md font-semibold truncate max-w-[240px]">{row[2]}</td>
                          <td className="px-space-md font-data-mono text-on-surface-variant">{row[3]}</td>
                          <td className={`px-space-md font-data-mono font-medium ${row[8] === "Vencido" ? "text-error" : row[8] === "Em aberto" ? "text-tertiary" : "text-on-surface-variant"}`}>{row[4]}</td>
                          <td className="px-space-md"><span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-caption font-semibold">{row[5]}</span></td>
                          <td className="px-space-md text-right font-data-mono font-medium tabular-nums">{row[6]}</td>
                          <td className={`px-space-md text-right font-data-mono font-semibold tabular-nums ${row[8] === "Vencido" ? "text-error" : row[8] === "Pago" ? "text-on-surface-variant" : "text-on-surface"}`}>{row[7]}</td>
                          <td className="px-space-md text-center"><Status value={row[8]} /></td>
                          <td className="px-space-md text-on-surface-variant truncate">{row[9]}</td>
                          <td className="px-space-md text-center">
                            <div className="flex items-center justify-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                              <button type="button" className="row-action" title="Ver Partida Contábil">{Icon("receipt_long", "text-[16px]")}</button>
                              <button type="button" className="row-action" title="Menu">{Icon("more_vert", "text-[16px]")}</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function FilterField({ label, code, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-label-sm text-on-surface-variant flex items-center justify-between">
        <span>{label}</span><span className="font-caption">{code}</span>
      </label>
      {children}
    </div>
  );
}

function SelectField({ options, className = "" }) {
  return (
    <div className="relative">
      <select className={`field-input appearance-none cursor-pointer ${className}`}>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
      {Icon("expand_more", "absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px] pointer-events-none")}
    </div>
  );
}
