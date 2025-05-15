import EditLead from "@/components/leads/EditLead"

export default function EditLeadPage({ params }: { params: { id: string } }) {
  return <EditLead id={params.id} />
}
