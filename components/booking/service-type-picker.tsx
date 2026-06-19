"use client";

import { CleaningTypeTabs } from "@/components/booking/cleaning-type-tabs";
import { NannyTypeTabs } from "@/components/booking/nanny-type-tabs";
import { AirbnbTypeTabs } from "@/components/booking/airbnb-type-tabs";
import {
  defaultServiceDetails,
  getAirbnbCleaningTypes,
  getResidentialCleaningTypes,
} from "@/lib/services/catalog";
import { buildBookUrl } from "@/lib/services/utils";

interface ServiceTypePickerProps {
  onSelect?: (categoryKey: "nanny" | "cleaning", serviceTypeId: string) => void;
}

export function ServiceTypePicker(_props: ServiceTypePickerProps) {
  const cleaningTypes = getResidentialCleaningTypes();
  const airbnbTypes = getAirbnbCleaningTypes();

  return (
    <div className="space-y-8">
      <p className="text-sm text-muted-foreground">
        Pick the service that best matches your visit. You&apos;ll set your address and schedule
        next.
      </p>

      <section>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">
          House cleaning
        </p>
        <CleaningTypeTabs
          value={cleaningTypes[0]?.id ?? "standard"}
          getHref={(typeId) =>
            buildBookUrl({
              ...defaultServiceDetails("cleaning"),
              serviceType: typeId,
            })
          }
          showDetails={false}
        />
      </section>

      <section>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">
          Nannies & childcare
        </p>
        <NannyTypeTabs
          value="day_nanny"
          getHref={(typeId) =>
            buildBookUrl({
              ...defaultServiceDetails("nanny"),
              serviceType: typeId,
            })
          }
          showDetails={false}
        />
      </section>

      <section>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">
          Airbnb clean
        </p>
        <AirbnbTypeTabs
          value={airbnbTypes[0]?.id ?? "guest_checkout"}
          getHref={(typeId) => `/customer/book/airbnb?type=${typeId}`}
          showDetails={false}
        />
      </section>
    </div>
  );
}
