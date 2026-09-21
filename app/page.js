"use client"

import {
  useRef,
  useState,
} from "react"

import ReportsHeader from "@/components/reports/shared/reportsHeader"

import Metric from "@/components/reports/shared/metric"

import SectionHeaderReports from "@/components/reports/shared/sectionHeaderReports"

import SectionFiltersReports from "@/components/reports/shared/sectionFiltersReports"

import ReportDataTable from "@/components/reports/shared/reportDataTable"

import { bankStatementColumns } from "@/components/reports/bankStatement/bankStatementColumns"

export default function ContasReceberPage() {
  const reportTableRef =
    useRef(null)

  const [reportData, setReportData] =
    useState(null)

  const [
    reportLoading,
    setReportLoading,
  ] = useState(false)

  const [
    exportingExcel,
    setExportingExcel,
  ] = useState(false)

  const [
    exportError,
    setExportError,
  ] = useState("")

  const canExport =
    Array.isArray(reportData) &&
    reportData.length > 0 &&
    !reportLoading

  async function handleExportExcel() {
    if (
      !canExport ||
      exportingExcel
    ) {
      return
    }

    const exportFunction =
      reportTableRef.current
        ?.exportToExcel

    if (!exportFunction) {
      setExportError(
        "A tabela ainda não está pronta para exportação."
      )

      return
    }

    setExportingExcel(true)
    setExportError("")

    try {
      await exportFunction()
    } catch (error) {
      console.error(
        "Erro ao exportar relatório:",
        error
      )

      setExportError(
        error instanceof Error
          ? error.message
          : "Não foi possível gerar o arquivo Excel."
      )
    } finally {
      setExportingExcel(false)
    }
  }

  function handleDataChange(
    newReportData
  ) {
    setReportData(newReportData)
    setExportError("")
  }

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface">
      <ReportsHeader />

      <main className="relative min-h-screen pt-14">
        <div className="mx-auto flex w-full max-w-[1720px] flex-col gap-space-lg px-space-xl py-space-lg">
          <SectionHeaderReports
            title="Contas a Receber — Partidas em Aberto"
            subtitle="Relatório operacional detalhado de títulos a receber por competência, carteira de clientes, ageing de mora e status de compensação financeira."
            transaction="ZFI_REC01"
            onExport={
              handleExportExcel
            }
            exportingExcel={
              exportingExcel
            }
            exportDisabled={
              !canExport
            }
            exportError={
              exportError
            }
          />

          <SectionFiltersReports
            onDataChange={
              handleDataChange
            }
            onLoadingChange={
              setReportLoading
            }
          />

          <section className="flex flex-col justify-between gap-space-md lg:flex-row lg:items-center">
            <div className="grid flex-1 grid-cols-2 gap-space-sm sm:grid-cols-4">
              <Metric
                label="Total Geral"
                value="R$ 4.892.430,00"
              />

              <Metric
                label="Em Aberto"
                value="R$ 2.410.150,00"
                tone="tertiary"
                dot
              />

              <Metric
                label="Vencido"
                value="R$ 684.200,00"
                tone="error"
                dot
              />

              <Metric
                label="Pago"
                value="R$ 1.798.080,00"
                tone="success"
                dot
              />
            </div>
          </section>

          <span className="font-label-sm text-on-surface-variant">
            Registros recebidos:{" "}

            <strong className="text-on-surface">
              {reportData?.length ??
                0}
            </strong>
          </span>

          <ReportDataTable
            ref={reportTableRef}
            data={reportData}
            columns={
              bankStatementColumns
            }
            loading={
              reportLoading
            }
            exportFileName="extratosBancarios"
            exportSheetName="Extratos bancários"
            searchPlaceholder="Pesquisar no extrato bancário..."
            initialTitle="Execute o relatório bancário"
            initialDescription="Informe as empresas e as datas para consultar os lançamentos bancários."
            emptyTitle="Nenhum lançamento encontrado"
            emptyDescription="Não foram encontrados lançamentos bancários para os filtros informados."
            getRowId={(
              row,
              index
            ) =>
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
  )
}