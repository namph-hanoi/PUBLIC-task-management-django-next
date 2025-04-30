import React, { useRef } from 'react';
import { DayPicker } from 'react-day-picker';
import { Popover } from '@/components/ui/popover';
import { format } from 'date-fns';

interface DatePickerPopoverProps {
  label: string;
  value?: string;
  onChange: (date: Date) => void;
  minDate?: Date;
  disabled?: boolean;
}

export const DatePickerPopover: React.FC<DatePickerPopoverProps> = ({
  label,
  value,
  onChange,
  minDate,
  disabled = false,
}) => {
  const [open, setOpen] = React.useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const dateObj = value ? new Date(value) : undefined;

  // Handler to close popover on blur
  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    // Only close if focus moves outside the wrapper
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setOpen(false);
    }
  };

  return (
    <div
      
      tabIndex={-1}
      
      className="relative"
    >
      <label className="block text-sm font-medium">{label}</label>
      <div ref={wrapperRef} onBlur={handleBlur}>
        <Popover open={open} onOpenChange={setOpen}>
          <button
            type="button"
            className="border rounded px-2 py-1 w-full text-left bg-white"
            onClick={() => {
              if (!disabled) setOpen(prevState => !prevState);
            }}
            disabled={disabled}
          >
            {dateObj ? format(dateObj, 'yyyy-MM-dd') : <span className="text-gray-400">Select date</span>}
          </button>
          {open && !disabled && (
            <div className="absolute z-50 mt-2 p-2 bg-white rounded shadow">
              <DayPicker
                mode="single"
                selected={dateObj}
                onSelect={date => {
                  if (date) {
                    onChange(date);
                    setOpen(false);
                  }
                }}
                disabled={minDate ? [{ before: minDate }] : undefined}
              />
            </div>
          )}
        </Popover>
      </div>
    </div>
  );
};