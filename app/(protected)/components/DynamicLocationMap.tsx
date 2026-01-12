"use client";

import dynamic from "next/dynamic";

const LocationMap = dynamic(
    () => import("./locationMap"),
    { ssr: false }
);

export default function DynamicLocationMap(props: any) {
    return <LocationMap {...props} />;
}
