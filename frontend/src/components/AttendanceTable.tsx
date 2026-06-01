import React from 'react';
import { AttendanceRecord } from '../types';
import { Clock } from 'lucide-react';

interface AttendanceTableProps {
  records: AttendanceRecord[];
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({ records }) => {
  const getStatusBadge = (status: string) => {
    const styles = {
      PRESENT_VERIFIED: 'bg-green-100 text-green-700 border-green-200',
      PROXY_ATTEMPT: 'bg-red-100 text-red-700 border-red-200',
      ABSENT_UNVERIFIED: 'bg-gray-100 text-gray-700 border-gray-200',
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
          <tr className="border-b border-gray-100">
            <th className="pb-4 font-semibold text-gray-600 text-sm">Student ID</th>
            <th className="pb-4 font-semibold text-gray-600 text-sm">Timestamp</th>
            <th className="pb-4 font-semibold text-gray-600 text-sm">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {records.length === 0 ? (
            <tr>
              <td colSpan={3} className="py-8 text-center text-gray-400">No logs found</td>
            </tr>
          ) : (
            records.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 text-sm font-medium text-gray-900">{log.roll_number}</td>
                <td className="py-4 text-sm text-gray-500 flex items-center gap-1.5">
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
