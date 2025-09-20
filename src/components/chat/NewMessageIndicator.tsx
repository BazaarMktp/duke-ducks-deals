import React from 'react';

const NewMessageIndicator: React.FC = () => {
  return (
    <div className="flex items-center justify-center my-4">
      <div className="flex-1 h-px bg-primary/30"></div>
      <div className="px-3 py-1 bg-primary rounded-full mx-4 animate-pulse">
        <span className="text-xs font-semibold text-primary-foreground">
          New messages
        </span>
      </div>
      <div className="flex-1 h-px bg-primary/30"></div>
    </div>
  );
};

export default NewMessageIndicator;