import React from 'react';
import { AttendanceRecord } from '../types';
import { Clock } from 'lucide-react';

interface AttendanceTableProps {
  records: AttendanceRecord[];
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({ records }) => {
  const getStatusBadge = (status: string) => {
    const styles = {
      PRESENT_VERIFIED: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
      PROXY_ATTEMPT: 'bg-red-500/15 text-red-400 border-red-500/20',
      ABSENT_UNVERIFIED: 'bg-white/5 text-white/40 border-white/10',
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles] || styles.ABSENT_UNVERIFIED}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-white/5">
            <th className="pb-4 font-semibold text-white/40 text-sm">Student ID</th>
            <th className="pb-4 font-semibold text-white/40 text-sm">Timestamp</th>
            <th className="pb-4 font-semibold text-white/40 text-sm">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {records.length === 0 ? (
            <tr>
              <td colSpan={3} className="py-8 text-center text-white/30">No logs found</td>
            </tr>
          ) : (
            records.map((log) => (
              <tr key={log.id} className="hover:bg-white/[0.03] transition-colors">
                <td className="py-4 text-sm font-medium text-white">{log.roll_number}</td>
                <td className="py-4 text-sm text-white/40 flex items-center gap-1.5">
                  <Clock size={14} />
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="py-4">{getStatusBadge(log.status)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
