import React from 'react';
import { formatMessageDate } from '@/utils/timeUtils';

interface DateSeparatorProps {
  date: string;
}

const DateSeparator: React.FC<DateSeparatorProps> = ({ date }) => {
  return (
    <div className="flex items-center justify-center my-4">
      <div className="flex-1 h-px bg-border"></div>
      <div className="px-4 py-1 bg-muted rounded-full mx-4">
        <span className="text-xs font-medium text-muted-foreground">
          {formatMessageDate(date)}
        </span>
      </div>
      <div className="flex-1 h-px bg-border"></div>
    </div>
  );
};

export default DateSeparator;