import LeadDetail from "@/components/leads/LeadDetail"

export default function LeadDetailPage({ params }: { params: { id: string } }) {
  return <LeadDetail id={params.id} />
}
