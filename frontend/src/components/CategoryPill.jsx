import React from 'react';

// ⚡ Bolt Performance Optimization:
// Wrapped CategoryPill in React.memo to prevent unnecessary O(N) re-renders
// when unrelated state (like modals or tabs) changes in the parent App.jsx.
const CategoryPill = React.memo(function CategoryPill({ icon, label, active, onClick }) {
  const handleClick = React.useCallback(() => {
    onClick(label);
  }, [label, onClick]);

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
        active
        ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105'
        : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
      }`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
});

export default CategoryPill;
