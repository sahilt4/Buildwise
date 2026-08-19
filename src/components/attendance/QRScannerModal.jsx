import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { QrCode, CheckCircle2, Camera, Sparkles, Building2 } from 'lucide-react';

export const QRScannerModal = ({ isOpen, onClose }) => {
  const { sites, scanQRAttendance } = useApp();
  const [selectedSite, setSelectedSite] = useState(sites[0]?.name || 'Sunrise Residency');
  const [isScanning, setIsScanning] = useState(false);
  const [scannedSuccess, setScannedSuccess] = useState(false);
  const [scanTime, setScanTime] = useState('');

  const handleSimulateScan = () => {
    setIsScanning(true);
    setScannedSuccess(false);

    setTimeout(() => {
      setIsScanning(false);
      setScannedSuccess(true);
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      setScanTime(time);
      scanQRAttendance(selectedSite);
    }, 1400);
  };

  const handleClose = () => {
    setScannedSuccess(false);
    setIsScanning(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Scan Site QR Code"
      subtitle="Position the camera over your construction site entrance QR code"
      footer={
        scannedSuccess ? (
          <Button variant="primary" icon={CheckCircle2} onClick={handleClose}>
            Done
          </Button>
        ) : (
          <>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              icon={Camera}
              disabled={isScanning}
              onClick={handleSimulateScan}
            >
              {isScanning ? 'Verifying Code...' : 'Simulate Camera Scan'}
            </Button>
          </>
        )
      }
    >
      <div style={{ textAlign: 'center' }}>
        {/* Site Location Selector */}
        <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Building2 size={16} style={{ color: 'var(--amber-600)' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy-900)' }}>Current Site:</span>
          <select
            className="form-select"
            style={{ width: 'auto', padding: '0.35rem 0.65rem', fontSize: '0.82rem' }}
            value={selectedSite}
            onChange={(e) => setSelectedSite(e.target.value)}
            disabled={isScanning || scannedSuccess}
          >
            {sites.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
          </select>
        </div>

        {/* Viewfinder Graphic */}
        <div className="qr-viewfinder-container">
          <div className="qr-box">
            {/* Corner styling */}
            <div style={{ position: 'absolute', top: -2, left: -2, width: 16, height: 16, borderTop: '3px solid var(--amber-500)', borderLeft: '3px solid var(--amber-500)' }} />
            <div style={{ position: 'absolute', top: -2, right: -2, width: 16, height: 16, borderTop: '3px solid var(--amber-500)', borderRight: '3px solid var(--amber-500)' }} />
            <div style={{ position: 'absolute', bottom: -2, left: -2, width: 16, height: 16, borderBottom: '3px solid var(--amber-500)', borderLeft: '3px solid var(--amber-500)' }} />
            <div style={{ position: 'absolute', bottom: -2, right: -2, width: 16, height: 16, borderBottom: '3px solid var(--amber-500)', borderRight: '3px solid var(--amber-500)' }} />

            {/* QR Pattern Icon */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'rgba(255, 255, 255, 0.25)' }}>
              <QrCode size={90} />
            </div>

            {/* Animated Scanning Laser */}
            {isScanning && <div className="qr-laser" />}
          </div>

          {/* Success Overlay */}
          {scannedSuccess && (
            <div
              className="animate-modal-in"
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(16, 185, 129, 0.95)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                padding: '1.5rem'
              }}
            >
              <CheckCircle2 size={54} style={{ marginBottom: '0.75rem' }} />
              <h3 style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: 800 }}>Attendance Marked!</h3>
              <div style={{ fontSize: '0.9rem', marginTop: '0.25rem', fontWeight: 600 }}>
                {selectedSite}
              </div>
              <div style={{ fontSize: '0.8rem', background: 'rgba(0,0,0,0.2)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)', marginTop: '0.5rem' }}>
                Timestamp: {scanTime}
              </div>
            </div>
          )}
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
          {scannedSuccess
            ? '✓ Verified with GPS geolocation check & biometric token.'
            : 'Point your camera at the physical QR code placard placed at the site entrance.'}
        </p>
      </div>
    </Modal>
  );
};
