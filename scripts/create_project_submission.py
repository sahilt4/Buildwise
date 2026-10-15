"""Create the four submission PDFs from the implemented Buildwise source."""
from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image
from create_submission_pdfs import architecture_drawing, prototype_screen

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output" / "pdf"
OUT.mkdir(parents=True, exist_ok=True)

NAVY, BLUE, GREEN, AMBER, RED = (HexColor(x) for x in ("#18355f", "#2f5b9d", "#16876b", "#e7a928", "#c84a47"))
INK, MUTED, LIGHT, BORDER = (HexColor(x) for x in ("#182230", "#667085", "#f4f7fb", "#d8e0eb"))
S = getSampleStyleSheet()
S.add(ParagraphStyle(name="TitleX", parent=S["Title"], fontName="Helvetica-Bold", fontSize=22, leading=27, textColor=INK, spaceAfter=8))
S.add(ParagraphStyle(name="SubX", parent=S["BodyText"], fontSize=10, leading=14, textColor=MUTED, spaceAfter=12))
S.add(ParagraphStyle(name="H1X", parent=S["Heading1"], fontName="Helvetica-Bold", fontSize=14, leading=18, textColor=NAVY, spaceBefore=6, spaceAfter=7))
S.add(ParagraphStyle(name="H2X", parent=S["Heading2"], fontName="Helvetica-Bold", fontSize=11, leading=14, textColor=INK, spaceBefore=6, spaceAfter=4))
S.add(ParagraphStyle(name="BodyX", parent=S["BodyText"], fontSize=9, leading=13, textColor=INK, spaceAfter=5))
S.add(ParagraphStyle(name="CellX", parent=S["BodyText"], fontSize=7.25, leading=9.2, textColor=INK))
S.add(ParagraphStyle(name="HeadX", parent=S["BodyText"], fontName="Helvetica-Bold", fontSize=7.2, leading=9, textColor=colors.white))

def p(text, style="BodyX"):
    return Paragraph(str(text), S[style])

def footer(canvas, doc):
    canvas.saveState(); w, _ = doc.pagesize
    canvas.setStrokeColor(BORDER); canvas.line(34, 27, w - 34, 27)
    canvas.setFont("Helvetica", 7.2); canvas.setFillColor(MUTED)
    canvas.drawString(34, 15, "Buildwise - Construction Operations and Leftover Material Marketplace")
    canvas.drawRightString(w - 34, 15, f"Page {doc.page}")
    canvas.restoreState()

def table(rows, widths, header=True, font=7.25):
    data = []
    for ri, row in enumerate(rows):
        data.append([p(c, "HeadX" if header and ri == 0 else "CellX") for c in row])
    t = Table(data, colWidths=widths, repeatRows=1 if header else 0, hAlign="LEFT")
    cmds = [("GRID", (0,0), (-1,-1), .35, BORDER), ("VALIGN", (0,0), (-1,-1), "TOP"),
            ("TOPPADDING", (0,0), (-1,-1), 5), ("BOTTOMPADDING", (0,0), (-1,-1), 5),
            ("LEFTPADDING", (0,0), (-1,-1), 5), ("RIGHTPADDING", (0,0), (-1,-1), 5)]
    if header:
        cmds += [("BACKGROUND", (0,0), (-1,0), NAVY), ("TEXTCOLOR", (0,0), (-1,0), colors.white),
                 ("ROWBACKGROUNDS", (0,1), (-1,-1), [colors.white, LIGHT])]
    else: cmds += [("ROWBACKGROUNDS", (0,0), (-1,-1), [colors.white, LIGHT])]
    t.setStyle(TableStyle(cmds)); return t

def doc(path, pagesize=A4):
    return SimpleDocTemplate(str(path), pagesize=pagesize, leftMargin=34, rightMargin=34, topMargin=34, bottomMargin=38)

def design_report():
    out = OUT / "Buildwise_Design_and_Implementation_Report.pdf"; d = doc(out); st = []
    st += [p("Buildwise Design and Implementation Report", "TitleX"), p("Code-based submission documentation. Evidence reviewed: React/Vite source, central AppContext actions, mock data, production build and Oxlint output.", "SubX"),
           p("1. System Structure", "H1X"), p("Buildwise is a client-side construction-operations prototype. React components render operational views; AppContext holds domain data and mutation actions; browser localStorage retains prototype data after refresh. jsPDF utilities generate reports and CSV exports.", "BodyX"), Image(architecture_drawing(), width=7.1*inch, height=4.49*inch),
           p("Implemented boundary", "H2X"), p("The repository does not contain a server, authentication provider, database, real QR-camera integration, GPS verifier or payment workflow. These are explicitly prototype limitations, not deployed services.", "BodyX"), PageBreak(),
           p("2. Design Changes Implemented", "H1X"),
           table([["Change", "Implementation evidence", "User outcome"],
                  ["Circular material flow", "recordUsage calculates stock balance, flags eligible surplus, creates a leftover record, and listLeftoverOnMarketplace publishes a listing.", "Unused material can be recovered rather than treated only as waste."],
                  ["Role-aware experience", "App router renders a streamlined WorkerPortalView for the worker role and operations views for builder/engineer roles.", "The daily worker workflow is reduced to attendance and tasks."],
                  ["Dependency-aware tasks", "Task status advancement checks prerequisiteId before allowing a blocked task to start.", "Sequenced work is visibly locked until its dependency is complete."],
                  ["Persistent prototype state", "Each domain collection is initialized from and synchronized to localStorage using bw_* keys.", "Demo changes persist on the same browser/device after refresh."],
                  ["Operational exports", "pdfGenerator.js uses jsPDF and AutoTable for materials, site and attendance PDFs; CSV export is available from the relevant views.", "Teams can download readable operational snapshots."],
                  ["Responsive navigation", "Desktop sidebar, top navigation and MobileBottomNav are componentized; CSS uses shared design tokens.", "The prototype remains usable across desktop and mobile layouts."]], [1.28*inch, 3.15*inch, 2.15*inch]), PageBreak(),
           p("3. Module-wise Implementation Details", "H1X"),
           table([["Module", "Implemented behavior", "Key source areas"],
                  ["Dashboard", "Shows multi-site KPIs, project health, attendance and activity summaries.", "components/dashboard; mockData"],
                  ["Sites", "Creates and displays site records with budget, progress, workers, health and alert metadata.", "components/sites; AppContext.addSite"],
                  ["Materials", "Filters stock by category/site, records consumption, exposes low-stock state and supports undo of the most recent usage action.", "components/materials; AppContext.recordUsage"],
                  ["Leftovers and Marketplace", "Maintains recoverable leftover records; posts direct surplus listings and records a simulated buyer request.", "components/materials/LeftoverSection; components/marketplace"],
                  ["Workers and Attendance", "Maintains worker profiles, one-click check-in/out, attendance logs and a simulated QR verification flow.", "components/workers; components/attendance"],
                  ["Tasks", "Creates tasks, displays cards/table views, advances status and prevents starting an incomplete prerequisite.", "components/tasks; AppContext.updateTaskStatus"],
                  ["Reports and Settings", "Generates client-side PDF/CSV reports and exposes user preference / demo-state controls.", "components/reports; utils/pdfGenerator; components/settings"],
                  ["Shared services", "AppContext centralizes state, localStorage persistence, activity logging, toasts and success feedback.", "context/AppContext.jsx; common and layout components"]], [1.27*inch, 3.72*inch, 1.58*inch]), PageBreak(),
           p("4. Visual Evidence of Current Functionality", "H1X"), p("The following screen renderings use the current component layout and seeded values in the repository. They document the interface states exercised by the related test cases.", "SubX")]
    for i, (name, cap) in enumerate([("Operations Dashboard", "Multi-site status, workforce, stock alerts and recovery value are presented together."), ("Material Inventory", "Stock monitoring and the waste-to-value workflow are surfaced in the inventory view."), ("Marketplace", "Surplus listings expose quantity, condition, city, seller verification and buyer request action.")]):
        st += [p(name, "H2X"), p(cap, "BodyX"), Image(prototype_screen(["dashboard", "materials", "marketplace"][i]), width=7.05*inch, height=4.23*inch)]
        if i < 2: st.append(PageBreak())
    d.build(st, onFirstPage=footer, onLaterPages=footer); return out

def test_sheet():
    out = OUT / "Buildwise_Test_Case_Sheet.pdf"; d = doc(out, landscape(A4)); st = [p("Buildwise Test Case Sheet", "TitleX"), p("Results combine source-level scenario inspection with a successful Vite production build. Status applies to the documented prototype scope; browser/device integrations marked simulated are not treated as production integrations.", "SubX")]
    rows = [["Test ID", "Module", "Input / action", "Expected output", "Actual output observed from code/build", "Status"]]
    rows += [
        ["TC-01", "Build", "npm run build", "Production bundle compiles without fatal error.", "Vite transformed 2,049 modules and completed the production build successfully.", "Pass"],
        ["TC-02", "Materials", "Record 20 Bags against Cement: purchased 500, used 420, remaining 80.", "Usage becomes 440; remaining becomes 60; low-stock condition is retained; activity/toast emitted.", "recordUsage calculates newUsed and newRemaining, maps the material state, logs activity and adds feedback.", "Pass"],
        ["TC-03", "Waste-to-Value", "Record use on an eligible material where remaining exceeds required quantity and condition is not Scrap.", "Material is flagged Surplus Candidate and a leftover record is created once.", "recordUsage calculates surplusQty/value and adds a leftover unless one already exists for the material.", "Pass"],
        ["TC-04", "Marketplace", "List a leftover from the leftover section.", "Listing is added, leftover is removed, activity and success feedback appear.", "listLeftoverOnMarketplace prepends the marketplace record, filters the leftover, logs activity and triggers feedback.", "Pass"],
        ["TC-05", "Marketplace", "Filter current listings by Tiles and Nashik.", "Only matching category/city listings render.", "MarketplaceView applies category, city/location and global-search predicates before rendering cards.", "Pass"],
        ["TC-06", "Attendance", "Toggle attendance for an active worker.", "Check-in/out status changes; check-in generates timestamped attendance log.", "toggleWorkerAttendance updates worker state and prepends a Present log on check-in.", "Pass"],
        ["TC-07", "QR Attendance", "Choose site and click Simulate Camera Scan.", "After simulated verification, Amit Patil is marked present and a QR log entry is recorded.", "QRScannerModal calls scanQRAttendance after 1.4 seconds; context updates worker/log and toast.", "Pass"],
        ["TC-08", "Tasks", "Attempt To Do -> In Progress for a task whose prerequisite is not Completed.", "Action is blocked and warning explains required prerequisite.", "TaskCard disables the control and updateTaskStatus also guards the transition in context.", "Pass"],
        ["TC-09", "Tasks", "Advance a completed-prerequisite task through Review -> Completed.", "Status updates to Completed and progress is set to 100.", "updateTaskStatus maps the task to Completed with progress 100 and emits success feedback.", "Pass"],
        ["TC-10", "Persistence", "Change any state collection, then refresh same browser/device.", "Changed collections reload from browser localStorage.", "AppContext initializes and syncs sites, materials, leftovers, marketplace, workers, tasks, activities and attendance with bw_* keys.", "Pass"],
        ["TC-11", "Reports", "Request Materials/Sites/Attendance report or CSV export.", "Client-side report/download helper is invoked and UI shows confirmation feedback.", "Relevant views call jsPDF/CSV utilities inside try/catch and display a toast after success.", "Pass"],
        ["TC-12", "Static quality", "npm run lint", "No parser/build-stopping errors; warnings are logged for remediation.", "Oxlint completed with warnings only, primarily unused imports/parameters plus React advisories; build remained successful.", "Pass (with warnings)"]]
    st.append(table(rows, [.63*inch, .88*inch, 2.0*inch, 2.05*inch, 3.05*inch, .85*inch]))
    d.build(st, onFirstPage=footer, onLaterPages=footer); return out

def issue_log():
    out = OUT / "Buildwise_Issue_Bug_Log.pdf"; d = doc(out, landscape(A4)); st = [p("Buildwise Issue / Bug Log", "TitleX"), p("Findings identified during code and quality-output review. The log separates confirmed prototype gaps from maintainability warnings so that the scope remains transparent.", "SubX")]
    rows = [["Issue ID", "Description", "Severity", "Root cause", "Fix / recommendation", "Status"],
            ["ISS-01", "QR flow presents GPS geolocation and biometric-token verification text, but no GPS, camera, QR decoding or biometric API is implemented.", "High", "QRScannerModal is a timed simulation that directly calls scanQRAttendance.", "Replace simulation with camera/QR decoder, server-side signed site token, permission flow and verifiable audit record.", "Open - prototype limitation"],
            ["ISS-02", "Business data is stored only in browser localStorage, so users/devices do not share a single source of truth and storage can be cleared locally.", "High", "No backend, authentication or database exists in repository.", "Add authenticated API, database, role authorization, backups and migration from bw_* local keys.", "Open - prototype limitation"],
            ["ISS-03", "Source linting emits many unused-import/unused-parameter warnings and React advisories.", "Medium", "UI components retain unused icon imports and stale parameters; AppContext includes hook advisories.", "Remove unused identifiers; review effect/state patterns and stabilize impure ID/time creation in event handlers.", "Open"],
            ["ISS-04", "The application is a single large client bundle; Vite reports a minified chunk above 500 kB.", "Medium", "All views and several heavy libraries are statically imported into the main application.", "Use React.lazy/dynamic imports for route views and selectively split reporting dependencies.", "Open"],
            ["ISS-05", "Marketplace request only creates local activity/toast feedback; it does not reserve stock, notify a real seller or create a transaction.", "Medium", "requestMarketplaceItem has no server, persistence model for requests or contact workflow.", "Persist requests server-side; add seller notification, quantity validation, order state and audit trail.", "Open - prototype limitation"],
            ["ISS-06", "Material-consumption notes are collected in the modal but are not passed to or retained by recordUsage.", "Low", "handleSubmit calls recordUsage(materialId, usedAmount) without notes; context action accepts only quantity.", "Extend recordUsage and activity/audit data model to store the optional notes field.", "Open"],
            ["ISS-07", "Usage protection is enforced in the HTML input max value, but recordUsage itself does not reject an oversized programmatic call.", "Medium", "Context clamps remaining to zero while retaining newUsed above purchased amount.", "Validate quantity in the context action and reject/return an error when quantity exceeds remaining stock.", "Open"],
            ["ISS-08", "No automated unit or end-to-end test command is configured.", "Low", "package.json includes build and lint scripts only.", "Add Vitest tests for context actions and Playwright/Cypress flows for critical UI paths.", "Open"]]
    st += [table(rows, [.7*inch, 2.1*inch, .75*inch, 2.0*inch, 2.45*inch, 1.1*inch]), Spacer(1, 12), p("Build verification", "H2X"), p("The current production build succeeds. The open items above are the prioritized remediation backlog; none prevented the current prototype from building.", "BodyX")]
    d.build(st, onFirstPage=footer, onLaterPages=footer); return out

def screenshots():
    out = OUT / "Buildwise_Updated_Screenshots.pdf"; d = doc(out, landscape(A4)); st = [p("Buildwise Updated Screenshots", "TitleX"), p("Current UI evidence using the repository's implemented view composition and seeded data. These pages correspond to dashboard, inventory, circular-marketplace and task/attendance functionality documented in the test sheet.", "SubX")]
    screens = [("dashboard", "Dashboard - multi-site operations overview", "Project portfolio KPIs, workforce/attendance, low-stock warning and recovery value."), ("materials", "Material Inventory - stock and recovery workflow", "Tracks consumption, low-stock condition and waste-to-value candidates."), ("marketplace", "Marketplace - verified surplus listings", "Shows surplus cards with condition, location, price and material-request action.")]
    for i, (key, title, caption) in enumerate(screens):
        st += [p(title, "H1X"), p(caption, "BodyX"), Image(prototype_screen(key), width=9.0*inch, height=5.4*inch)]
        if i < len(screens)-1: st.append(PageBreak())
    d.build(st, onFirstPage=footer, onLaterPages=footer); return out

if __name__ == "__main__":
    for create in (design_report, test_sheet, issue_log, screenshots): print(create())
