import React from "react";
import { getChecklists } from "@/app/actions/auditoria";
import ChecklistManager from "./ChecklistManager";

export default async function ChecklistsPage() {
    const checklists = await getChecklists();

    return <ChecklistManager initialChecklists={checklists} />;
}
