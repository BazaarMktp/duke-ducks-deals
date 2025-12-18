import React from 'react';
import { formatMessageDate } from '@/utils/timeUtils';

interface DateSeparatorProps {
  date: string;
}

const DateSeparator: React.FC<DateSeparatorProps> = ({ date }) => {
  return (
    <div className="flex items-center justify-center my-6">
      <div className="px-3 py-1 bg-muted/80 rounded-full">
        <span className="text-[11px] font-medium text-muted-foreground">
          {formatMessageDate(date)}
        </span>
      </div>
    </div>
  );
};

export default DateSeparator;
