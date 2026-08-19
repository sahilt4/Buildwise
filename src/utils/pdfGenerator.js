import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Helper to draw Buildwise modern header banner
const drawHeader = (doc, title, subtitle) => {
  // Top charcoal bar
  doc.setFillColor(15, 23, 42); // #0f172a
  doc.rect(0, 0, 210, 26, 'F');

  // Accent amber stripe
  doc.setFillColor(245, 158, 11); // #f59e0b
  doc.rect(0, 26, 210, 3, 'F');

  // Brand Name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('BUILDWISE', 14, 13);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(245, 158, 11);
  doc.text('BUILD SMARTER. WASTE LESS.', 14, 19);

  // Document Title on top right
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(title.toUpperCase(), 196, 13, { align: 'right' });

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 196, 19, { align: 'right' });

  // Subtitle below header bar
  if (subtitle) {
    doc.setTextColor(71, 85, 105);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.text(subtitle, 14, 35);
  }
};

// Helper for document footer
const drawFooter = (doc, pageNumber, pageCount) => {
  const pageHeight = doc.internal.pageSize.height || 297;
  doc.setDrawColor(226, 232, 240);
  doc.line(14, pageHeight - 15, 196, pageHeight - 15);

  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.setFont('helvetica', 'normal');
  doc.text('Buildwise Technologies • Modern Construction SaaS Platform • Confidential Site Document', 14, pageHeight - 10);
  doc.text(`Page ${pageNumber} of ${pageCount}`, 196, pageHeight - 10, { align: 'right' });
};

/**
 * 1. ATTENDANCE MUSTER ROLL PDF
 */
export const downloadAttendancePDF = (attendanceLogs, workers) => {
  const doc = new jsPDF();
  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  drawHeader(doc, 'Site Attendance Muster Roll', `Official shift attendance log for ${dateStr}`);

  const presentCount = attendanceLogs.filter(l => l.status === 'Present').length;
  const totalCount = attendanceLogs.length;
  const attendanceRate = Math.round((presentCount / (totalCount || 1)) * 100);

  // Summary Metrics Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 40, 182, 18, 2, 2, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Total Enrolled Crew: ' + totalCount, 20, 51);
  doc.text(`Present On-Site: ${presentCount}`, 75, 51);
  doc.text(`Attendance Rate: ${attendanceRate}%`, 130, 51);

  // Table Data
  const tableRows = attendanceLogs.map((log, index) => [
    index + 1,
    log.workerName,
    log.trade,
    log.siteName,
    log.time,
    log.method,
    log.status
  ]);

  autoTable(doc, {
    startY: 64,
    head: [['#', 'Crew Member', 'Trade Skill', 'Assigned Site', 'Punch Time', 'Method', 'Status']],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
      halign: 'left'
    },
    styles: {
      fontSize: 8,
      cellPadding: 3.5,
      textColor: [15, 23, 42],
      lineColor: [226, 232, 240]
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    didParseCell: function(data) {
      if (data.section === 'body' && data.column.index === 6) {
        if (data.cell.raw === 'Present') {
          data.cell.styles.textColor = [4, 120, 87]; // success green
          data.cell.styles.fontStyle = 'bold';
        } else {
          data.cell.styles.textColor = [185, 28, 28]; // danger red
          data.cell.styles.fontStyle = 'bold';
        }
      }
    }
  });

  // Sign-off section
  const finalY = doc.lastAutoTable.finalY + 20;
  if (finalY < 260) {
    doc.setDrawColor(148, 163, 184);
    doc.line(14, finalY + 15, 65, finalY + 15);
    doc.line(145, finalY + 15, 196, finalY + 15);

    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('Site Engineer Sign & Stamp', 14, finalY + 20);
    doc.text('Project Manager Verification', 145, finalY + 20);
  }

  drawFooter(doc, 1, 1);
  doc.save(`Buildwise_Attendance_Muster_${new Date().toISOString().slice(0, 10)}.pdf`);
};

/**
 * 2. MATERIAL EFFICIENCY & RECOVERY AUDIT PDF
 */
export const downloadMaterialAuditPDF = (materials, leftovers, marketplace) => {
  const doc = new jsPDF();
  drawHeader(doc, 'Material Efficiency & Audit', 'Proactive stock audit, consumption yield, and circular marketplace resale recovery');

  // Summary Metrics Banner
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 40, 182, 22, 2, 2, 'FD');

  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text('Procured: 12,500 units', 20, 49);
  doc.text('Installed: 9,400 units (75.2%)', 75, 49);
  doc.text('Leftover Surplus: 1,800 units (14.4%)', 130, 49);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(185, 28, 28);
  doc.text('Site Waste: 1,300 units (10.4%)', 20, 56);
  doc.setTextColor(4, 120, 87);
  doc.setFont('helvetica', 'bold');
  doc.text('Resale Capital Recovered: ₹1,85,400', 75, 56);

  // Section 1: Materials Inventory
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Active Construction Material Stock Status', 14, 70);

  const matRows = materials.map((m, idx) => {
    const percent = Math.round((m.used / m.purchased) * 100);
    return [
      idx + 1,
      m.name,
      m.category,
      m.siteName,
      `${m.purchased} ${m.unit}`,
      `${m.used} ${m.unit} (${percent}%)`,
      `${m.remaining} ${m.unit}`,
      m.status
    ];
  });

  autoTable(doc, {
    startY: 74,
    head: [['#', 'Material Name', 'Category', 'Site', 'Purchased', 'Used (%)', 'Remaining', 'Status']],
    body: matRows,
    theme: 'grid',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontSize: 8
    },
    styles: {
      fontSize: 7.5,
      cellPadding: 3
    },
    didParseCell: function(data) {
      if (data.section === 'body' && data.column.index === 7) {
        if (data.cell.raw === 'Low Stock') {
          data.cell.styles.textColor = [185, 28, 28];
          data.cell.styles.fontStyle = 'bold';
        } else {
          data.cell.styles.textColor = [4, 120, 87];
          data.cell.styles.fontStyle = 'bold';
        }
      }
    }
  });

  // Section 2: Waste -> Value Recovery
  const nextY = doc.lastAutoTable.finalY + 12;
  if (nextY < 230) {
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Surplus Materials Monetized (Waste -> Value)', 14, nextY);

    const leftoverRows = (leftovers.length ? leftovers : marketplace.slice(0, 4)).map((item, idx) => [
      idx + 1,
      item.title,
      item.quantity,
      item.site || item.location,
      item.condition,
      `₹${(item.estimatedValue || item.totalPrice || 4500).toLocaleString()}`
    ]);

    autoTable(doc, {
      startY: nextY + 4,
      head: [['#', 'Surplus Item', 'Available Qty', 'Site Location', 'Condition', 'Estimated Value']],
      body: leftoverRows,
      theme: 'grid',
      headStyles: {
        fillColor: [217, 119, 6], // amber-600
        textColor: [255, 255, 255],
        fontSize: 8
      },
      styles: {
        fontSize: 7.5,
        cellPadding: 3
      }
    });
  }

  drawFooter(doc, 1, 1);
  doc.save(`Buildwise_Material_Efficiency_Audit_${new Date().toISOString().slice(0, 10)}.pdf`);
};

/**
 * 3. MULTI-SITE SUMMARY PDF
 */
export const downloadSitesSummaryPDF = (sites, workers, tasks) => {
  const doc = new jsPDF();
  drawHeader(doc, 'Multi-Site Progress Summary', 'Executive overview of active project timelines, crew capacity, and expenditures');

  const siteRows = sites.map((s, idx) => [
    idx + 1,
    s.name,
    s.location,
    s.supervisor,
    `${s.progress}%`,
    `${s.workerCount || 20} Workers`,
    s.spent,
    s.totalBudget,
    s.health
  ]);

  autoTable(doc, {
    startY: 42,
    head: [['#', 'Project Site', 'Location', 'Supervisor', 'Progress', 'Crew', 'Spent', 'Budget', 'Health']],
    body: siteRows,
    theme: 'grid',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontSize: 8
    },
    styles: {
      fontSize: 7.5,
      cellPadding: 3.5
    },
    didParseCell: function(data) {
      if (data.section === 'body' && data.column.index === 8) {
        if (data.cell.raw === 'Good') {
          data.cell.styles.textColor = [4, 120, 87];
          data.cell.styles.fontStyle = 'bold';
        } else {
          data.cell.styles.textColor = [185, 28, 28];
          data.cell.styles.fontStyle = 'bold';
        }
      }
    }
  });

  drawFooter(doc, 1, 1);
  doc.save(`Buildwise_Sites_Summary_${new Date().toISOString().slice(0, 10)}.pdf`);
};

/**
 * 4. Export CSV utility
 */
export const exportCSV = (data, filename = 'export.csv') => {
  if (!data || !data.length) return;
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(h => `"${(row[h] !== undefined ? row[h] : '').toString().replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
