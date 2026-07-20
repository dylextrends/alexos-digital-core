import { createFileRoute } from "@tanstack/react-router";
import { ModulePlaceholder } from "@/components/module-placeholder";
import { modules } from "@/lib/modules";
const m = modules.find((x) => x.url === "/vehicle-sales")!;
export const Route = createFileRoute("/_authenticated/vehicle-sales")({
  component: () => <ModulePlaceholder title={m.title} description={m.description} icon={m.icon} />,
});
