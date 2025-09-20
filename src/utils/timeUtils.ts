import { formatDistanceToNow, format, isToday, isYesterday, differenceInMinutes, differenceInHours, differenceInDays } from 'date-fns';

export const formatInstagramTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  
  const minutesAgo = differenceInMinutes(now, date);
  const hoursAgo = differenceInHours(now, date);
  const daysAgo = differenceInDays(now, date);
  
  if (minutesAgo < 1) {
    return 'now';
  } else if (minutesAgo < 60) {
    return `${minutesAgo}m`;
  } else if (hoursAgo < 24) {
    return `${hoursAgo}h`;
  } else if (daysAgo < 7) {
    return `${daysAgo}d`;
  } else {
    return format(date, 'MMM d');
  }
};

export const formatMessageTime = (dateString: string): string => {
  const date = new Date(dateString);
  
  if (isToday(date)) {
    return format(date, 'h:mm a');
  } else if (isYesterday(date)) {
    return `Yesterday ${format(date, 'h:mm a')}`;
  } else {
    return format(date, 'MMM d, h:mm a');
  }
};

export const formatMessageDate = (dateString: string): string => {
  const date = new Date(dateString);
  
  if (isToday(date)) {
    return 'Today';
  } else if (isYesterday(date)) {
    return 'Yesterday';
  } else {
    return format(date, 'MMMM d, yyyy');
  }
};

export const shouldShowDateSeparator = (currentMessageDate: string, previousMessageDate?: string): boolean => {
  if (!previousMessageDate) return true;
  
  const current = new Date(currentMessageDate);
  const previous = new Date(previousMessageDate);
  
  return format(current, 'yyyy-MM-dd') !== format(previous, 'yyyy-MM-dd');
};