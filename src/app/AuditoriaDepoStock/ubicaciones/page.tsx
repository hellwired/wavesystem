import React from "react";
import { getLocationsData } from "@/app/actions/auditoria";
import LocationsManager from "./LocationsManager";

export default async function UbicacionesPage() {
    const locations = await getLocationsData();

    return <LocationsManager initialLocations={locations} />;
}
