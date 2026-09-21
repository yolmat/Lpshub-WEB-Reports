"use client";

// Components
import ReportsHeader from "@/components/reports/shared/reportsHeader";
import Icon from "@/components/icon"
import Metric from "@/components/reports/shared/metric";
import { useState } from "react"
import SectionHeaderReports from "@/components/reports/shared/sectionHeaderReports";
import SectionFiltersReports from "@/components/reports/shared/sectionFiltersReports";
import ReportDataTable from "@/components/reports/shared/reportDataTable"
import { bankStatementColumns } from "@/components/reports/bankStatement/bankStatementColumns"

export default function ContasReceberPage() {
  const [reportData, setReportData] = useState(null)
  const [reportLoading, setReportLoading] = useState(false)


  return (
    <div>
      <div className="min-h-screen bg-surface text-on-surface font-body-md">

        <ReportsHeader />

        <div className="">
          <main className="relative pt-14 min-h-screen">
            <div className="px-space-xl py-space-lg flex flex-col gap-space-lg max-w-[1720px] mx-auto w-full">

              <SectionHeaderReports
                title="Contas a Receber — Partidas em Aberto"
                subtitle="Relatório operacional detalhado de títulos a receber por competência, carteira de clientes, ageing de mora e status de compensação financeira."
                transaction="ZFI_REC01"

              />

              <SectionFiltersReports
                onDataChange={setReportData}
                onLoadingChange={setReportLoading}
              />

              <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm flex-1">
                  <Metric label="Total Geral" value="R$ 4.892.430,00" />
                  <Metric label="Em Aberto" value="R$ 2.410.150,00" tone="tertiary" dot />
                  <Metric label="Vencido" value="R$ 684.200,00" tone="error" dot />
                  <Metric label="Pago" value="R$ 1.798.080,00" tone="success" dot />
                </div>

              </section>

              <span className="font-label-sm text-on-surface-variant">
                Registros recebidos:{" "}
                <strong className="text-on-surface">
                  {reportData?.length ?? 0}
                </strong>
              </span>

              <ReportDataTable
                data={reportData}
                columns={bankStatementColumns}
                loading={reportLoading}
                searchPlaceholder="Pesquisar no extrato bancário..."
                initialTitle="Execute o relatório bancário"
                initialDescription="Informe as empresas e as datas para consultar os lançamentos bancários."
                emptyTitle="Nenhum lançamento encontrado"
                emptyDescription="Não foram encontrados lançamentos bancários para os filtros informados."
                getRowId={(row, index) =>
                  [
                    row.AccountCode,
                    row.Sequence,
                    row.StatementNumber,
                    index,
                  ].join("-")
                }
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

