import { getReportData, getAuditorias } from "@/app/actions/auditoria";
import ReportsDashboard from "./ReportsDashboard";

export default async function InformesPage() {
    const data = await getReportData();
    const allAudits = await getAuditorias();
    const completedAudits = allAudits.filter(a => a.estado === 'finalizada').slice(0, 10); // Last 10 finished

    return <ReportsDashboard data={data} initialCompletedAudits={completedAudits} />;
}
