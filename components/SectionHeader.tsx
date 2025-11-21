import React from 'react';

interface SectionHeaderProps {
  title: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => {
  return (
    <h2 className="font-orbitron text-2xl font-bold text-cyan-400 glowing-text-cyan mb-4">
      {title}
    </h2>
  );
};