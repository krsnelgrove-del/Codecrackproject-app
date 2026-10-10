import React from 'react';

interface DecryptionEfficiencyProps {
  title?: string;
  data?: {
    rate?: number;
    [key: string]: any;
  };
}

export default function DecryptionEfficiencyCard({ title, data }: DecryptionEfficiencyProps) {
  return (
    <div className="p-4 text-white">
      <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
        {title}
      </h3>
      <div className="text-2xl font-bold mt-2">
        {data?.rate}
      </div>
    </div>
  );
}