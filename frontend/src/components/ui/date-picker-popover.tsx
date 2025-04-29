import React from 'react';
import { DayPicker } from 'react-day-picker';
import { Popover } from '@/components/ui/popover';
import { format } from 'date-fns';

interface DatePickerPopoverProps {
  label: string;
  value?: string;
  onChange: (date: Date) => void;
  minDate?: Date; // Add this prop
}

export const DatePickerPopover: React.FC<DatePickerPopoverProps> = ({ label, value, onChange, minDate }) => {
  const [open, setOpen] = React.useState(false);
  const dateObj = value ? new Date(value) : undefined;
  return (
    <label>
      <span className="block text-sm font-medium">{label}</span>
      <div
        className="border rounded px-2 py-1 w-full text-left bg-white"
        onClick={() => {
          setOpen(prevState => !prevState);
        }}
      >
        {dateObj ? format(dateObj, 'yyyy-MM-dd') : <span className="text-gray-400">Select date</span>}
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        {open && (
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