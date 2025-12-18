import React from 'react';

const NewMessageIndicator: React.FC = () => {
  return (
    <div className="flex items-center justify-center my-4 gap-3">
      <div className="flex-1 h-px bg-primary/40"></div>
      <div className="px-3 py-1 bg-primary/10 border border-primary/30 rounded-full">
        <span className="text-[11px] font-semibold text-primary">
          New messages
        </span>
      </div>
      <div className="flex-1 h-px bg-primary/40"></div>
    </div>
  );
};

export default NewMessageIndicator;
