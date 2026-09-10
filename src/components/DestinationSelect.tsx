import type { Dictionary } from '@/lib/i18n/types';
import {
  TOUR_IDS,
  ZONE_KIND_ORDER,
  destinationKindOf,
  tourDestValue,
  zonesOfKind,
} from '@/lib/prices';
import { DestinationIcon } from './DestinationIcon';

const KIND_EMOJI: Record<'airport' | 'city' | 'castle' | 'tours', string> = {
  airport: '✈',
  city: '🏙',
  castle: '🏰',
  tours: '🗺',
};

/**
 * From/to picker with a type icon and optgroups (airport, city, castle, tours).
 *
 * Native `<option>` cannot render SVG, so the icon sits beside the closed
 * select and the groups use a small emoji in the dropdown list.
 */
export function DestinationSelect({
  label,
  name,
  value,
  onChange,
  dict,
  includeTours = false,
  selectClassName = 'field',
}: {
  label: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  dict: Dictionary;
  includeTours?: boolean;
  selectClassName?: string;
}) {
  const kind = destinationKindOf(value);

  return (
    <label className="field-label min-w-0">
      {label}
      <span className="relative block min-w-0 w-full">
        <span className="pointer-events-none absolute top-1/2 left-3 z-[1] -translate-y-1/2 text-brand">
          <DestinationIcon kind={kind} className="h-[18px] w-[18px]" />
        </span>
        <select
          name={name}
          className={`${selectClassName} min-w-0 w-full max-w-full !pl-10`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          {ZONE_KIND_ORDER.map((group) => (
            <optgroup
              key={group}
              label={`${KIND_EMOJI[group]} ${dict.destinationKinds[group]}`}
            >
              {zonesOfKind(group).map((id) => (
                <option key={id} value={id}>
                  {dict.zones[id]}
                </option>
              ))}
            </optgroup>
          ))}
          {includeTours ? (
            <optgroup label={`${KIND_EMOJI.tours} ${dict.destinationKinds.tours}`}>
              {TOUR_IDS.map((id) => (
                <option key={id} value={tourDestValue(id)}>
                  {dict.tours[id].name}
                </option>
              ))}
            </optgroup>
          ) : null}
        </select>
      </span>
    </label>
  );
}
