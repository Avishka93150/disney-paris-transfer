'use client';

import { Fragment, useEffect, useId, useRef, useState } from 'react';
import { destinationLabel } from '@/lib/i18n';
import type { Dictionary } from '@/lib/i18n/types';
import {
  TOUR_IDS,
  ZONE_KIND_ORDER,
  destinationKindOf,
  tourDestValue,
  zonesOfKind,
} from '@/lib/prices';
import { DestinationIcon } from './DestinationIcon';

/**
 * From/to picker with a type icon and grouped options.
 *
 * Native `<select>` sizes itself to the longest option, which pushed
 * "Disneyland Paris" out of the calculator card. This listbox keeps a
 * truncated trigger at 100% width.
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
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const labelId = useId();
  const kind = destinationKindOf(value);

  useEffect(() => {
    if (!open) return;
    function onPointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  function choose(next: string) {
    onChange(next);
    setOpen(false);
  }

  return (
    <div className="field-label min-w-0">
      <span id={labelId}>{label}</span>
      <div className="relative min-w-0 w-full" ref={rootRef}>
        {name ? <input type="hidden" name={name} value={value} /> : null}
        <button
          type="button"
          aria-labelledby={labelId}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={listId}
          onClick={() => setOpen((current) => !current)}
          className={`${selectClassName} flex min-w-0 cursor-pointer appearance-none items-center gap-2 text-left`}
        >
          <span className="shrink-0 text-brand">
            <DestinationIcon kind={kind} className="h-[18px] w-[18px]" />
          </span>
          <span className="min-w-0 flex-1 truncate">{destinationLabel(dict, value)}</span>
          <svg
            viewBox="0 0 12 12"
            aria-hidden
            className={`h-2.5 w-2.5 shrink-0 text-ink-mute transition-transform ${open ? 'rotate-180' : ''}`}
          >
            <path
              d="M2.5 4.5 6 8l3.5-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {open ? (
          <ul
            id={listId}
            role="listbox"
            aria-labelledby={labelId}
            className="absolute top-[calc(100%+4px)] right-0 left-0 z-[70] max-h-64 overflow-y-auto rounded-[10px] border border-line bg-surface py-1 shadow-popover"
          >
            {ZONE_KIND_ORDER.map((group) => (
              <Fragment key={group}>
                <li role="presentation" className="px-3 pt-2 pb-1 text-[11px] font-extrabold tracking-[0.04em] text-ink-mute uppercase">
                  {dict.destinationKinds[group]}
                </li>
                {zonesOfKind(group).map((id) => (
                  <li key={id} role="none">
                    <OptionRow
                      selected={value === id}
                      onChoose={() => choose(id)}
                      label={dict.zones[id]}
                    />
                  </li>
                ))}
              </Fragment>
            ))}
            {includeTours ? (
              <Fragment>
                <li role="presentation" className="px-3 pt-2 pb-1 text-[11px] font-extrabold tracking-[0.04em] text-ink-mute uppercase">
                  {dict.destinationKinds.tours}
                </li>
                {TOUR_IDS.map((id) => {
                  const dest = tourDestValue(id);
                  return (
                    <li key={id} role="none">
                      <OptionRow
                        selected={value === dest}
                        onChoose={() => choose(dest)}
                        label={dict.tours[id].name}
                      />
                    </li>
                  );
                })}
              </Fragment>
            ) : null}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

function OptionRow({
  selected,
  onChoose,
  label,
}: {
  selected: boolean;
  onChoose: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      onClick={onChoose}
      className={`block w-full cursor-pointer border-0 px-3 py-1.5 text-left font-sans text-sm ${
        selected ? 'bg-sand font-extrabold text-brand' : 'bg-transparent font-semibold text-ink hover:bg-sand'
      }`}
    >
      {label}
    </button>
  );
}
