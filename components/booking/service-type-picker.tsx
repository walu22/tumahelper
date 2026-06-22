"use client";

import { CleaningTypeTabs } from "@/components/booking/cleaning-type-tabs";
import { NannyTypeTabs } from "@/components/booking/nanny-type-tabs";
import { AirbnbTypeTabs } from "@/components/booking/airbnb-type-tabs";
import { CookingTypeTabs } from "@/components/booking/cooking-type-tabs";
import { HousekeepingTypeTabs } from "@/components/booking/housekeeping-type-tabs";
import { LaundryTypeTabs } from "@/components/booking/laundry-type-tabs";
import { GardenTypeTabs } from "@/components/booking/garden-type-tabs";
import { HandymanTypeTabs } from "@/components/booking/handyman-type-tabs";
import {
  defaultServiceDetails,
  getAirbnbCleaningTypes,
  getCookingTypes,
  getGardenTypes,
  getHandymanTypes,
  getHousekeepingTypes,
  getLaundryTypes,
  getResidentialCleaningTypes,
  type ServiceCategoryKey,
} from "@/lib/services/catalog";
import { buildBookUrl } from "@/lib/services/utils";

interface ServiceTypePickerProps {
  onSelect?: (categoryKey: ServiceCategoryKey, serviceTypeId: string) => void;
}

function bookHref(category: ServiceCategoryKey, typeId: string): string {
  return buildBookUrl({
    ...defaultServiceDetails(category),
    serviceType: typeId,
  });
}

export function ServiceTypePicker({ onSelect }: ServiceTypePickerProps) {
  const cleaningTypes = getResidentialCleaningTypes();
  const airbnbTypes = getAirbnbCleaningTypes();
  const housekeepingTypes = getHousekeepingTypes();
  const cookingTypes = getCookingTypes();
  const laundryTypes = getLaundryTypes();
  const gardenTypes = getGardenTypes();
  const handymanTypes = getHandymanTypes();

  const linkOrSelect = (category: ServiceCategoryKey) =>
    onSelect
      ? {
          onChange: (typeId: string) => onSelect(category, typeId),
        }
      : {
          getHref: (typeId: string) => bookHref(category, typeId),
        };

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
          showDetails={false}
          {...linkOrSelect("cleaning")}
        />
      </section>

      <section>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">
          Nannies & childcare
        </p>
        <NannyTypeTabs value="day_nanny" showDetails={false} {...linkOrSelect("nanny")} />
      </section>

      <section>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">
          Housekeeping
        </p>
        <HousekeepingTypeTabs
          value={housekeepingTypes[0]?.id ?? "half_day"}
          showDetails={false}
          {...linkOrSelect("housekeeping")}
        />
      </section>

      <section>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">
          Cooking & meals
        </p>
        <CookingTypeTabs
          value={cookingTypes[0]?.id ?? "lunch"}
          showDetails={false}
          {...linkOrSelect("cooking")}
        />
      </section>

      <section>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">
          Short-stay cleaning
        </p>
        <AirbnbTypeTabs
          value={airbnbTypes[0]?.id ?? "guest_checkout"}
          showDetails={false}
          {...(onSelect
            ? { onChange: (typeId: string) => onSelect("cleaning", typeId) }
            : { getHref: (typeId: string) => `/customer/book/airbnb?type=${typeId}` })}
        />
      </section>

      <section>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">
          Laundry & ironing
        </p>
        <LaundryTypeTabs
          value={laundryTypes[0]?.id ?? "wash_fold"}
          showDetails={false}
          {...linkOrSelect("laundry")}
        />
      </section>

      <section>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">
          Garden & yard work
        </p>
        <GardenTypeTabs
          value={gardenTypes[0]?.id ?? "lawn_cutting"}
          showDetails={false}
          {...linkOrSelect("garden")}
        />
      </section>

      <section>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">
          Handyman & home repairs
        </p>
        <HandymanTypeTabs
          value={handymanTypes[0]?.id ?? "general_handyman"}
          showDetails={false}
          {...linkOrSelect("handyman")}
        />
      </section>
    </div>
  );
}
