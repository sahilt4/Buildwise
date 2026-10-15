import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { AttendancePunchCard } from './AttendancePunchCard';
import { QRScannerModal } from './QRScannerModal';
import { downloadAttendancePDF, exportCSV } from '../../utils/pdfGenerator';
import {
  ClipboardCheck,
  QrCode,
  Users,
  CheckCircle,
  Clock,
  Download,
  FileText,
  Calendar
} from 'lucide-react';

export const AttendanceView = () => {
  const { attendanceLogs, workers, addToast, userRole } = useApp();
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);

  const isWorker = userRole === 'worker';
  const presentWorkers = workers.filter(w => w.isCheckedIn).length;
  const totalWorkers = workers.length;

  const handleDownloadPDF = () => {
    try {
      downloadAttendancePDF(attendanceLogs, workers);
      addToast('✓ Official Attendance Muster Roll PDF downloaded', 'success');
    } catch (err) {
      console.error(err);
      addToast('Error generating PDF report', 'danger');
    }
  };

  const handleExportMusterCSV = () => {
    try {
      exportCSV(attendanceLogs, `Buildwise_Attendance_Muster_${new Date().toISOString().slice(0, 10)}.csv`);
      addToast('✓ Attendance Muster Roll exported as CSV', 'success');
    } catch (err) {
      console.error(err);
      addToast('Error exporting CSV', 'danger');
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-text">
          <h1>Digital Attendance Muster & Workforce Report</h1>
          <p>
            {isWorker
              ? 'Personal shift punch card and entrance QR verification.'
              : 'Official daily muster roll, verified worker check-ins, time logs, and payroll records (Audited Report View).'
            }
          </p>
        </div>

        <div className="page-actions">
          <Button
            variant="secondary"
            icon={Download}
            onClick={handleExportMusterCSV}
          >
            Export CSV
          </Button>

          <Button
            variant="secondary"
            icon={FileText}
            onClick={handleDownloadPDF}
          >
            Download PDF Muster Roll
          </Button>

          {isWorker && (
            <Button
              variant="primary"
              icon={QrCode}
              onClick={() => setIsQRScannerOpen(true)}
            >
              Scan Site QR
            </Button>
          )}
        </div>
      </div>

      {/* Central Big Punch Card ONLY rendered for Field Workers */}
      {isWorker && (
        <AttendancePunchCard onOpenQRScanner={() => setIsQRScannerOpen(true)} />
      )}

      {/* Daily Muster Register Log */}
      <div className="bw-card" style={{ marginTop: '2rem' }}>
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <ClipboardCheck size={18} style={{ color: 'var(--amber-600)' }} />
              Today's Site Attendance Register
            </h3>
            <p className="card-subtitle">
              Verified live check-ins across all active sites ({presentWorkers} of {totalWorkers} Present)
            </p>
          </div>

          <Badge variant="success">
            {Math.round((presentWorkers / (totalWorkers || 1)) * 100)}% On-Site
          </Badge>
        </div>

        <div className="bw-table-container" style={{ border: 'none', boxShadow: 'none' }}>
          <table className="bw-table">
            <thead>
              <tr>
                <th className="bw-th">Crew Member</th>
                <th className="bw-th">Trade Skill</th>
                <th className="bw-th">Site Assigned</th>
                <th className="bw-th">Check-In Time</th>
                <th className="bw-th">Verification Method</th>
                <th className="bw-th" style={{ textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceLogs.map((log) => (
                <tr key={log.id}>
                  <td className="bw-td">
                    <strong style={{ color: 'var(--navy-900)' }}>{log.workerName}</strong>
                  </td>
                  <td className="bw-td">
                    <span className="badge badge-neutral">{log.trade}</span>
                  </td>
                  <td className="bw-td">{log.siteName}</td>
                  <td className="bw-td">
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{log.time}</span>
                  </td>
                  <td className="bw-td">
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {log.method}
                    </span>
                  </td>
                  <td className="bw-td" style={{ textAlign: 'right' }}>
                    <Badge variant={log.status === 'Present' ? 'success' : 'danger'}>
                      {log.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Scanner Modal */}
      <QRScannerModal
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
      />
    </div>
  );
};
