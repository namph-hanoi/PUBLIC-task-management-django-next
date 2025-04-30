import React from 'react';
import { DayPicker } from 'react-day-picker';
import { Popover } from '@/components/ui/popover';
import { format } from 'date-fns';

interface DatePickerPopoverProps {
  label: string;
  value?: string;
  onChange: (date: Date) => void;
  minDate?: Date;
  disabled?: boolean; // Add this line
}

export const DatePickerPopover: React.FC<DatePickerPopoverProps> = ({
  label,
  value,
  onChange,
  minDate,
  disabled = false, // Default to false
}) => {
  const [open, setOpen] = React.useState(false);
  const dateObj = value ? new Date(value) : undefined;
  return (
    <label>
      <span className="block text-sm font-medium">{label}</span>
      <button
        type="button"
        className="border rounded px-2 py-1 w-full text-left bg-white"
        onClick={() => {
          if (!disabled) setOpen(prevState => !prevState);
        }}
        disabled={disabled} // Disable the button
      >
        {dateObj ? format(dateObj, 'yyyy-MM-dd') : <span className="text-gray-400">Select date</span>}
      </button>
      <Popover open={open} onOpenChange={setOpen}>
        {open && !disabled && ( // Prevent popover if disabled
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
    </label>
  );
};