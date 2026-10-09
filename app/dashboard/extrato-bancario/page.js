"use client"

import {
  useRef,
  useState,
} from "react"

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

      <main className="relative min-h-screen pt-14">
        <div className="mx-auto flex w-full max-w-[1720px] flex-col gap-space-lg px-space-xl py-space-lg">
          <SectionHeaderReports
            title="Extrato Bancario"
            subtitle="Consulta das movimentações bancárias, débitos e créditos."
            transaction="FEBAN"
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