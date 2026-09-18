from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image, KeepTogether
from reportlab.graphics.shapes import Drawing, Rect, String, Line
from PIL import Image as PILImage, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
PDF_DIR = ROOT / 'output' / 'pdf'
IMG_DIR = ROOT / 'output' / 'images'
PDF_DIR.mkdir(parents=True, exist_ok=True)
IMG_DIR.mkdir(parents=True, exist_ok=True)

NAVY = HexColor('#18355f')
BLUE = HexColor('#2f5b9d')
AMBER = HexColor('#e7a928')
GREEN = HexColor('#16876b')
RED = HexColor('#c84a47')
INK = HexColor('#182230')
MUTED = HexColor('#667085')
LIGHT = HexColor('#f4f7fb')
BORDER = HexColor('#d8e0eb')

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='DocTitle', parent=styles['Title'], fontName='Helvetica-Bold', fontSize=23, leading=28, textColor=INK, spaceAfter=8))
styles.add(ParagraphStyle(name='SubTitle', parent=styles['BodyText'], fontName='Helvetica', fontSize=10.5, leading=15, textColor=MUTED, spaceAfter=14))
styles.add(ParagraphStyle(name='H1x', parent=styles['Heading1'], fontName='Helvetica-Bold', fontSize=15, leading=19, textColor=NAVY, spaceBefore=4, spaceAfter=8))
styles.add(ParagraphStyle(name='H2x', parent=styles['Heading2'], fontName='Helvetica-Bold', fontSize=11.5, leading=14, textColor=INK, spaceBefore=8, spaceAfter=4))
styles.add(ParagraphStyle(name='Bodyx', parent=styles['BodyText'], fontName='Helvetica', fontSize=9.2, leading=13.2, textColor=INK, spaceAfter=5))
styles.add(ParagraphStyle(name='Small', parent=styles['BodyText'], fontName='Helvetica', fontSize=7.6, leading=10, textColor=INK))
styles.add(ParagraphStyle(name='TableHeader', parent=styles['BodyText'], fontName='Helvetica-Bold', fontSize=7.6, leading=10, textColor=colors.white))
styles.add(ParagraphStyle(name='Foot', parent=styles['BodyText'], fontName='Helvetica', fontSize=7.5, leading=9, textColor=MUTED, alignment=TA_CENTER))

def para(text, style='Bodyx'):
    return Paragraph(text, styles[style])

def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(BORDER)
    canvas.line(36, 28, A4[0] - 36, 28)
    canvas.setFont('Helvetica', 7.5)
    canvas.setFillColor(MUTED)
    canvas.drawString(36, 16, 'Buildwise - Construction Management and Leftover Material Marketplace')
    canvas.drawRightString(A4[0] - 36, 16, f'Page {doc.page}')
    canvas.restoreState()

def module_table(rows):
    data = [[para('Module', 'TableHeader'), para('Purpose', 'TableHeader'), para('Inputs', 'TableHeader'), para('Outputs', 'TableHeader'), para('Owner', 'TableHeader')]]
    for r in rows:
        data.append([para(x, 'Small') for x in r])
    table = Table(data, colWidths=[1.12*inch, 1.58*inch, 1.46*inch, 1.67*inch, .72*inch], repeatRows=1, hAlign='LEFT')
    table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), NAVY), ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'), ('GRID', (0,0), (-1,-1), .35, BORDER),
        ('BACKGROUND', (0,1), (-1,-1), colors.white), ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, LIGHT]),
        ('TOPPADDING', (0,0), (-1,-1), 6), ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 5), ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    return table

def architecture_drawing():
    d = Drawing(680, 430)
    def box(x,y,w,h,title,items,fill):
        d.add(Rect(x,y,w,h,rx=8,ry=8,fillColor=fill,strokeColor=BORDER,strokeWidth=1))
        d.add(Rect(x,y+h-31,w,31,rx=8,ry=8,fillColor=NAVY,strokeColor=NAVY))
        d.add(String(x+12,y+h-20,title,fontName='Helvetica-Bold',fontSize=11,fillColor=colors.white))
        yy = y+h-48
        for item in items:
            d.add(String(x+13,yy,'• '+item,fontName='Helvetica',fontSize=8.6,fillColor=INK))
            yy -= 18
    box(25,292,630,112,'1  Presentation Layer  -  React views and reusable UI components',
        ['Dashboard, Sites, Materials, Marketplace, Workers, Attendance, Tasks, Reports',
         'Role-aware Worker Portal, Landing Page, Notifications and Settings',
         'Shared UI: navigation, modals, cards, charts, badges, toasts'], colors.white)
    box(25,160,630,98,'2  Application State and Business Logic  -  AppContext',
        ['React Context holds sites, materials, leftovers, listings, workers, tasks, activity and attendance',
         'Actions: record usage, detect surplus, publish listings, scan attendance, assign tasks, show feedback',
         'Role and active-view state route the experience for builder, engineer and worker'], HexColor('#eef4ff'))
    box(25,38,298,88,'3  Client-side Services',
        ['pdfGenerator.js: jsPDF + AutoTable reports', 'CSV export and canvas-confetti feedback'], HexColor('#fff8e8'))
    box(357,38,298,88,'4  Browser Persistence',
        ['localStorage keys: bw_sites, bw_materials, bw_workers', 'bw_tasks, bw_attendance, bw_marketplace and more'], HexColor('#eef9f4'))
    for x in [340]:
        d.add(Line(x,292,x,258,strokeColor=BLUE,strokeWidth=2))
        d.add(Line(x,160,x,126,strokeColor=BLUE,strokeWidth=2))
    d.add(Line(174,160,174,126,strokeColor=BLUE,strokeWidth=2))
    d.add(Line(506,160,506,126,strokeColor=BLUE,strokeWidth=2))
    d.add(String(25,12,'Current prototype boundary: entirely client side. A future cloud API and database can replace the local persistence layer.',fontName='Helvetica-Oblique',fontSize=8,fillColor=MUTED))
    return d

def build_architecture_png():
    path = IMG_DIR / 'buildwise_system_architecture.png'
    image = PILImage.new('RGB', (1360, 860), '#ffffff')
    draw = ImageDraw.Draw(image)
    font_bold = ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf', 23)
    font = ImageFont.truetype('C:/Windows/Fonts/arial.ttf', 18)
    font_small = ImageFont.truetype('C:/Windows/Fonts/arial.ttf', 15)
    def box(x, y, w, h, title, lines, fill):
        draw.rounded_rectangle((x,y,x+w,y+h), radius=14, fill=fill, outline='#d8e0eb', width=2)
        draw.rounded_rectangle((x,y,x+w,y+62), radius=14, fill='#18355f', outline='#18355f')
        draw.text((x+22,y+18), title, font=font_bold, fill='white')
        yy=y+82
        for line in lines:
            draw.text((x+25,yy), '• '+line, font=font, fill='#182230')
            yy += 30
    box(50,50,1260,218,'1  Presentation Layer  -  React views and reusable UI components',
        ['Dashboard, Sites, Materials, Marketplace, Workers, Attendance, Tasks and Reports', 'Role-aware Worker Portal, Landing Page, Notifications and Settings', 'Shared UI: navigation, modals, cards, charts, badges and toasts'], '#ffffff')
    box(50,320,1260,195,'2  Application State and Business Logic  -  AppContext',
        ['Central state: sites, materials, leftovers, listings, workers, tasks, activities and attendance', 'Actions: record usage, detect surplus, publish listings, scan attendance and assign tasks', 'Role and active-view state route experiences for builder, engineer and worker'], '#eef4ff')
    box(50,565,600,170,'3  Client-side Services', ['pdfGenerator.js: jsPDF + AutoTable reports', 'CSV export and canvas-confetti feedback'], '#fff8e8')
    box(710,565,600,170,'4  Browser Persistence', ['localStorage: bw_sites, bw_materials and bw_workers', 'bw_tasks, bw_attendance, bw_marketplace and other collections'], '#eef9f4')
    for x in (680,):
        draw.line((x,268,x,320), fill='#2f5b9d', width=4)
        draw.line((x,515,x,565), fill='#2f5b9d', width=4)
    draw.text((50,800),'Current prototype boundary: entirely client side. A future cloud API and database can replace local persistence.', font=font_small, fill='#667085')
    image.save(path)
    return path

def build_documentation(architecture_png):
    out = PDF_DIR / 'Buildwise_Architecture_Modules_and_Technology.pdf'
    doc = SimpleDocTemplate(str(out), pagesize=A4, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=38)
    story = []
    story += [para('Buildwise System Architecture', 'DocTitle'), para('Implemented client-side architecture and planned cloud-backend roadmap.', 'SubTitle'), Image(str(architecture_png), width=7.25*inch, height=4.08*inch), Spacer(1,8), para('The illustrated architecture shows the implemented React/Vite frontend, AppContext business layer, client-side services and browser localStorage, together with the planned cloud-backend extension.', 'Bodyx'), PageBreak()]
    modules = [
        ('Dashboard', 'Executive overview of project health.', 'Sites, workers, materials, activity.', 'KPIs, charts, alerts, activity feed.', 'Team'),
        ('Sites', 'Maintain multi-site project records.', 'Site name, location, budget, progress.', 'Site cards and progress indicators.', 'Team'),
        ('Materials', 'Track inventory, thresholds and usage.', 'Purchase quantity, usage, required level.', 'Remaining stock, alerts, surplus candidates.', 'Team'),
        ('Waste to Value', 'Identify recoverable leftover material.', 'Material balance and condition.', 'Leftover records and estimated recovery value.', 'Team'),
        ('Marketplace', 'List and request surplus material.', 'Listing data, category and city filters.', 'B2B listings, buyer request feedback.', 'Team'),
        ('Workers', 'Manage construction crew profiles.', 'Worker name, trade, site and status.', 'Worker directory and assignment context.', 'Team'),
        ('Attendance', 'Register workforce presence.', 'Punch action or simulated QR site scan.', 'Attendance log and muster information.', 'Team'),
        ('Tasks', 'Assign and track site activities.', 'Task, assignee, progress, prerequisite.', 'Status, progress and dependency validation.', 'Team'),
        ('Reports', 'Create client-side operational exports.', 'Materials, sites, workers, tasks.', 'PDF audit/summary and CSV data export.', 'Team'),
        ('Notifications', 'Surface key operational events.', 'Context action outcomes.', 'Toast feedback and activity records.', 'Team'),
        ('Role Portal', 'Tailor interfaces by user role.', 'Selected builder, engineer or worker role.', 'Focused navigation and worker mobile portal.', 'Team'),
        ('Persistence', 'Retain prototype data after refresh.', 'Application state collections.', 'Serialized localStorage records.', 'Team'),
    ]
    story += [para('Module List and Description Sheet', 'DocTitle'), para('The following modules map directly to the source structure in src/components, src/context and src/utils. “Team” is used as owner because individual member allocations were not supplied.', 'SubTitle'), module_table(modules[:6]), Spacer(1,14), module_table(modules[6:]), PageBreak()]
    stack = [
        ['Layer', 'Technology', 'Reason for selection'],
        ['UI framework', 'React 19 + React DOM', 'Component composition supports the project’s many views and reusable cards, modals, navigation and status elements. Hooks and Context provide responsive state updates without a separate state library.'],
        ['Build tooling', 'Vite 8', 'Fast local development, hot module replacement and a straightforward production build suit a front-end academic prototype.'],
        ['State and storage', 'React Context + localStorage', 'Centralizes domain collections and actions in AppContext while allowing data to survive refreshes on the same browser. It avoids backend infrastructure during the prototype stage.'],
        ['Reporting', 'jsPDF + jspdf-autotable', 'Produces downloadable, structured PDF reports entirely in the browser, including material audits and multi-site summaries.'],
        ['Interface assets', 'Lucide React', 'A consistent icon set improves scanability across operational screens without custom icon maintenance.'],
        ['User feedback', 'canvas-confetti', 'Provides a lightweight positive response for high-value events such as publishing recovered surplus or completing work.'],
        ['Styling', 'CSS design tokens and component styles', 'Keeps the navy, amber and neutral visual system consistent across desktop and mobile layouts without adding a UI framework dependency.'],
    ]
    formatted = [[para(c, 'TableHeader') for c in stack[0]]] + [[para(c, 'Small') for c in row] for row in stack[1:]]
    tech_table = Table(formatted, colWidths=[1.08*inch, 1.48*inch, 4.38*inch], repeatRows=1)
    tech_table.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),NAVY),('TEXTCOLOR',(0,0),(-1,0),colors.white),('GRID',(0,0),(-1,-1),.35,BORDER),('ROWBACKGROUNDS',(0,1),(-1,-1),[colors.white,LIGHT]),('VALIGN',(0,0),(-1,-1),'MIDDLE'),('TOPPADDING',(0,0),(-1,-1),7),('BOTTOMPADDING',(0,0),(-1,-1),7),('LEFTPADDING',(0,0),(-1,-1),6),('RIGHTPADDING',(0,0),(-1,-1),6)]))
    story += [para('Technology Stack Justification', 'DocTitle'), para('The selected stack supports a deployable browser prototype while preserving a clean upgrade path to authenticated cloud services and a database.', 'SubTitle'), tech_table, Spacer(1,14), para('Prototype constraints', 'H2x'), para('The current version deliberately uses browser localStorage, simulated role selection and simulated QR scanning. These choices allow all key workflows to be demonstrated without server credentials, camera permissions or device-to-device synchronization. A production release would add secure authentication, API services, cloud data storage and verified QR/camera integration.', 'Bodyx')]
    doc.build(story, onFirstPage=footer, onLaterPages=footer)
    return out

def ui_box(d,x,y,w,h,title,value,accent=BLUE,detail=''):
    d.add(Rect(x,y,w,h,rx=6,ry=6,fillColor=colors.white,strokeColor=BORDER))
    d.add(String(x+12,y+h-22,title,fontName='Helvetica-Bold',fontSize=8,fillColor=MUTED))
    d.add(String(x+12,y+h-48,value,fontName='Helvetica-Bold',fontSize=17,fillColor=accent))
    if detail: d.add(String(x+12,y+12,detail,fontName='Helvetica',fontSize=7,fillColor=MUTED))

def prototype_screen(kind):
    d = Drawing(720, 432)
    d.add(Rect(0,0,720,432,fillColor=HexColor('#f5f7fa'),strokeColor=BORDER))
    d.add(Rect(0,0,154,432,fillColor=NAVY,strokeColor=NAVY))
    d.add(String(20,397,'BUILDWISE',fontName='Helvetica-Bold',fontSize=16,fillColor=colors.white))
    d.add(String(20,380,'Build Smarter. Waste Less.',fontName='Helvetica',fontSize=7.5,fillColor=HexColor('#f8d57a')))
    items = ['Dashboard','Sites','Materials','Marketplace','Workers','Attendance','Tasks','Reports']
    for i,item in enumerate(items):
        yy = 340 - i*30
        if (kind=='dashboard' and item=='Dashboard') or (kind=='materials' and item=='Materials') or (kind=='marketplace' and item=='Marketplace'):
            d.add(Rect(12,yy-8,130,24,rx=5,ry=5,fillColor=HexColor('#345584'),strokeColor=HexColor('#345584')))
        d.add(String(27,yy,item,fontName='Helvetica-Bold' if item in ['Dashboard','Materials','Marketplace'] else 'Helvetica',fontSize=8.7,fillColor=colors.white))
    d.add(Rect(154,386,566,46,fillColor=colors.white,strokeColor=BORDER))
    d.add(String(178,404,'Buildwise Operations Workspace',fontName='Helvetica-Bold',fontSize=10,fillColor=INK))
    d.add(String(645,404,'Rajesh Sharma',fontName='Helvetica',fontSize=8,fillColor=MUTED))
    if kind == 'dashboard':
        d.add(String(178,360,'Good morning, Rajesh',fontName='Helvetica-Bold',fontSize=17,fillColor=INK))
        d.add(String(178,345,'Here is the current health of your construction portfolio.',fontName='Helvetica',fontSize=8.5,fillColor=MUTED))
        ui_box(d,178,254,120,75,'ACTIVE SITES','3',BLUE,'All sites operational')
        ui_box(d,312,254,120,75,'ON-SITE WORKERS','42 / 48',GREEN,'87.5% attendance')
        ui_box(d,446,254,120,75,'LOW-STOCK ITEMS','4',AMBER,'Action recommended')
        ui_box(d,580,254,120,75,'RECOVERED VALUE','Rs 1.85L',GREEN,'Marketplace recovery')
        d.add(Rect(178,105,318,132,rx=6,ry=6,fillColor=colors.white,strokeColor=BORDER))
        d.add(String(194,214,'Project completion overview',fontName='Helvetica-Bold',fontSize=10,fillColor=INK))
        for i,(name,pct,c) in enumerate([('Sunrise Residency',68,GREEN),('Green Valley Hub',42,BLUE),('Metro Line Depot',85,RED)]):
            yy=182-i*32; d.add(String(194,yy,name,fontName='Helvetica',fontSize=8,fillColor=INK)); d.add(Rect(194,yy-12,230,8,fillColor=HexColor('#e8edf4'),strokeColor=None)); d.add(Rect(194,yy-12,2.3*pct,8,fillColor=c,strokeColor=None)); d.add(String(438,yy-1,f'{pct}%',fontName='Helvetica-Bold',fontSize=8,fillColor=c))
        d.add(Rect(514,105,186,132,rx=6,ry=6,fillColor=colors.white,strokeColor=BORDER))
        d.add(String(530,214,'Live activity',fontName='Helvetica-Bold',fontSize=10,fillColor=INK))
        for i,t in enumerate(['Usage logged for cement','New task assigned','QR attendance verified','Tiles listed for resale']): d.add(String(530,187-i*22,'• '+t,fontName='Helvetica',fontSize=7.7,fillColor=INK))
    elif kind == 'materials':
        d.add(String(178,360,'Material Inventory',fontName='Helvetica-Bold',fontSize=17,fillColor=INK))
        d.add(String(178,345,'Track stock, usage and waste-to-value opportunities across active sites.',fontName='Helvetica',fontSize=8.5,fillColor=MUTED))
        d.add(Rect(570,341,130,26,rx=5,ry=5,fillColor=AMBER,strokeColor=AMBER)); d.add(String(587,351,'+ Add Material',fontName='Helvetica-Bold',fontSize=8.5,fillColor=INK))
        headers=['Material','Site','Purchased','Used','Remaining','Status']
        x=[178,317,402,470,526,610]
        d.add(Rect(178,304,522,24,fillColor=NAVY,strokeColor=NAVY))
        for i,h in enumerate(headers): d.add(String(x[i]+7,313,h,fontName='Helvetica-Bold',fontSize=7.5,fillColor=colors.white))
        rows=[('Ultratech Cement (PPC)','Sunrise Residency','500 Bags','420','80','LOW STOCK'),('TMT 550D Steel Rebars','Sunrise Residency','20 Tons','14.5','5.5','IN STOCK'),('Vitrified Floor Tiles','Sunrise Residency','1200 Boxes','1120','80','LOW STOCK'),('PVC Plumbing Pipe','Green Valley Hub','650 m','510','140','SURPLUS')]
        for r,row in enumerate(rows):
            yy=278-r*38; d.add(Rect(178,yy-8,522,32,fillColor=colors.white if r%2==0 else LIGHT,strokeColor=BORDER,strokeWidth=.35))
            for i,txt in enumerate(row): d.add(String(x[i]+7,yy+4,txt,fontName='Helvetica-Bold' if i==0 else 'Helvetica',fontSize=7.2,fillColor=RED if txt=='LOW STOCK' else (GREEN if txt in ['IN STOCK','SURPLUS'] else INK)))
        d.add(Rect(178,85,522,44,rx=6,ry=6,fillColor=HexColor('#fff7e7'),strokeColor=HexColor('#eed39b'))); d.add(String(193,109,'Waste-to-Value insight',fontName='Helvetica-Bold',fontSize=9,fillColor=INK)); d.add(String(193,95,'PVC Plumbing Pipe exceeds required quantity and is eligible for surplus recovery.',fontName='Helvetica',fontSize=7.7,fillColor=MUTED))
    else:
        d.add(String(178,360,'Leftover Material Marketplace',fontName='Helvetica-Bold',fontSize=17,fillColor=INK))
        d.add(String(178,345,'Source lower-cost surplus from verified builders and turn unused stock into value.',fontName='Helvetica',fontSize=8.5,fillColor=MUTED))
        d.add(Rect(560,341,140,26,rx=5,ry=5,fillColor=AMBER,strokeColor=AMBER)); d.add(String(575,351,'+ Post Listing',fontName='Helvetica-Bold',fontSize=8.5,fillColor=INK))
        cards=[('TMT Rebar Offcuts','1.2 Tons','Rs 62,000','Mumbai'),('Vitrified Ceramic Tiles','250 Pieces','Rs 4,500','Nashik'),('Teakwood Door Frames','8 Units','Rs 16,000','Pune')]
        for i,(title,qty,price,city) in enumerate(cards):
            xx=178+i*176; d.add(Rect(xx,137,160,170,rx=7,ry=7,fillColor=colors.white,strokeColor=BORDER)); d.add(Rect(xx,238,160,69,rx=7,ry=7,fillColor=HexColor('#e9eff7'),strokeColor=HexColor('#e9eff7'))); d.add(String(xx+12,218,title,fontName='Helvetica-Bold',fontSize=8.5,fillColor=INK)); d.add(String(xx+12,199,qty,fontName='Helvetica',fontSize=8,fillColor=MUTED)); d.add(String(xx+12,176,price,fontName='Helvetica-Bold',fontSize=12,fillColor=GREEN)); d.add(String(xx+12,159,city+'  • Verified seller',fontName='Helvetica',fontSize=7,fillColor=MUTED)); d.add(Rect(xx+12,145,93,18,rx=4,ry=4,fillColor=NAVY,strokeColor=NAVY)); d.add(String(xx+23,151,'Request material',fontName='Helvetica-Bold',fontSize=7.3,fillColor=colors.white))
        d.add(String(178,108,'Filter by category, city and condition to find useful material near your active site.',fontName='Helvetica',fontSize=8,fillColor=MUTED))
    return d

def build_screenshots_pdf():
    out = PDF_DIR / 'Buildwise_Prototype_Screenshots.pdf'
    doc = SimpleDocTemplate(str(out), pagesize=landscape(A4), rightMargin=34, leftMargin=34, topMargin=30, bottomMargin=34)
    story = [para('Buildwise Prototype Screens', 'DocTitle'), para('Annotated representative screens for the working React/Vite prototype. The submission demonstrates the primary builder workflows implemented in the repository.', 'SubTitle')]
    captions = [
        ('Operations Dashboard', 'Portfolio KPIs, completion progress and live activity give a builder a single operational overview.'),
        ('Material Inventory', 'Inventory records show usage and low-stock status; the highlighted waste-to-value insight connects surplus detection to recovery.'),
        ('Marketplace', 'Verified surplus listings can be filtered and requested, completing the material recovery workflow.'),
    ]
    for i,(kind,(heading,caption)) in enumerate(zip(['dashboard','materials','marketplace'],captions)):
        story += [para(heading, 'H1x'), para(caption, 'Bodyx'), Image(prototype_screen(kind), width=9.35*inch, height=5.61*inch)]
        if i < 2: story.append(PageBreak())
    doc.build(story)
    return out

def requirements_table(rows, widths):
    data = [[para(cell, 'TableHeader') for cell in rows[0]]]
    data += [[para(cell, 'Small') for cell in row] for row in rows[1:]]
    table = Table(data, colWidths=widths, repeatRows=1, hAlign='LEFT')
    table.setStyle(TableStyle([
        ('BACKGROUND',(0,0),(-1,0),NAVY), ('TEXTCOLOR',(0,0),(-1,0),colors.white),
        ('GRID',(0,0),(-1,-1),.35,BORDER), ('ROWBACKGROUNDS',(0,1),(-1,-1),[colors.white,LIGHT]),
        ('VALIGN',(0,0),(-1,-1),'MIDDLE'), ('TOPPADDING',(0,0),(-1,-1),5),
        ('BOTTOMPADDING',(0,0),(-1,-1),5), ('LEFTPADDING',(0,0),(-1,-1),5),
        ('RIGHTPADDING',(0,0),(-1,-1),5),
    ]))
    return table

def build_requirements_sdg_pdf():
    out = PDF_DIR / 'Buildwise_Requirements_and_SDG_Mapping.pdf'
    doc = SimpleDocTemplate(str(out), pagesize=A4, rightMargin=34, leftMargin=34, topMargin=34, bottomMargin=38)
    story = [para('Buildwise Requirements and SDG Mapping', 'DocTitle'), para('Functional and non-functional requirements, prototype hardware/software requirements, and Sustainable Development Goal justification.', 'SubTitle')]
    functional = [
        ['ID', 'Functional requirement', 'Priority'],
        ['FR-01', 'Switch between Builder, Engineer and Worker perspectives.', 'High'],
        ['FR-02', 'Display dashboard KPIs for sites, attendance, inventory and tasks.', 'High'],
        ['FR-03', 'Manage multi-site progress, budgets, expenditure and health status.', 'High'],
        ['FR-04', 'Add construction projects with supervisor and budget metadata.', 'Medium'],
        ['FR-05', 'Track categorized material stock, usage and calculated balance.', 'High'],
        ['FR-06', 'Record material consumption and prevent usage above available stock.', 'High'],
        ['FR-07', 'Flag inventory as low stock when the threshold is reached.', 'High'],
        ['FR-08', 'Publish eligible leftover material to the B2B marketplace.', 'High'],
        ['FR-09', 'Display listings with category, pricing, condition and location.', 'High'],
        ['FR-10', 'Post a custom marketplace listing with category, condition, price and image.', 'Medium'],
        ['FR-11', 'Send a simulated buyer inquiry to a marketplace seller.', 'Medium'],
        ['FR-12', 'Maintain a trade crew directory with skills, wage and attendance data.', 'High'],
        ['FR-13', 'Provide one-click mobile attendance punch in and punch out.', 'High'],
        ['FR-14', 'Simulate site QR attendance verification with an animated scanner.', 'High'],
        ['FR-15', 'Maintain attendance entries with worker, trade, site, time and method.', 'High'],
        ['FR-16', 'Render a simplified mobile worker portal for personal attendance and tasks.', 'High'],
        ['FR-17', 'Manage daily work on a four-stage Kanban task board.', 'High'],
        ['FR-18', 'Download vector PDF reports for material efficiency and site operations.', 'High'],
        ['FR-19', 'Export attendance and inventory records as CSV.', 'High'],
        ['FR-20', 'Show a chronological notification stream and priority stock warnings.', 'Medium'],
        ['FR-21', 'Update profile preferences, measurement units and demo-data reset.', 'Medium'],
    ]
    story += [para('Functional Requirements', 'H1x'), para('Buildwise shall provide the following construction-operations and circular-marketplace capabilities.', 'Bodyx'), requirements_table(functional, [.55*inch, 5.75*inch, .65*inch]), PageBreak()]
    nonfunctional = [
        ['Category', 'Non-functional requirement'],
        ['Performance', 'The prototype should load quickly on standard broadband and keep normal state updates responsive for interactive use.'],
        ['Usability', 'Navigation, safety-amber, slate-navy and emerald status colours must retain high contrast and clearly communicate construction operations status.'],
        ['Reliability', 'Each state mutation must serialize to browser localStorage so that seeded and user-entered prototype data persists across refreshes.'],
        ['Maintainability', 'The code must remain organized into reusable React components, context actions, utilities and design-token based CSS, and support static linting.'],
        ['Responsiveness', 'The layout must adapt to desktop, tablet and mobile viewports, including mobile navigation and the worker portal.'],
        ['Compatibility', 'The client-side application should work on current evergreen browsers such as Chrome, Edge, Firefox and Safari.'],
        ['Data persistence', 'Prototype data must remain within normal browser localStorage capacity; it is stored only on the current browser/device.'],
        ['Security', 'React JSX escaping protects rendered user text from common XSS injection. Secure authentication and server authorization remain outside prototype scope.'],
    ]
    hw_sw = [
        ['Type', 'Requirement / interface'],
        ['Hardware', 'A standard desktop/laptop or mobile device with a display and mouse, keyboard or touch input is required. The QR scanner is simulated; physical camera access is not required in this version.'],
        ['Software runtime', 'A modern evergreen browser is required to run the React single-page application and maintain localStorage records.'],
        ['Development tools', 'Node.js 20+, npm, Vite 8, React 19 and Oxlint support local development, production build and source validation.'],
        ['Client libraries', 'jsPDF and jspdf-autotable create reports; Lucide React supplies UI icons; canvas-confetti provides non-critical success feedback.'],
        ['Communication boundary', 'No backend API, WebSocket or centralized database is required for the prototype. Future releases can introduce secure cloud services and verified QR/camera integration.'],
    ]
    story += [para('Non-Functional Requirements', 'H1x'), requirements_table(nonfunctional, [1.25*inch, 5.7*inch]), Spacer(1,12), para('Hardware and Software Requirements', 'H1x'), requirements_table(hw_sw, [1.28*inch, 5.67*inch]), PageBreak()]
    sdgs = [
        ['SDG', 'Target', 'Buildwise feature evidence', 'Justification'],
        ['SDG 9\nIndustry Innovation and Infrastructure', '9.4', 'Digital multi-site monitoring, material optimization, task coordination and operational reporting.', 'Buildwise modernizes everyday construction operations with a low-infrastructure web workflow. Material visibility and reporting help teams use resources more efficiently while improving site decision-making.'],
        ['SDG 12\nResponsible Consumption and Production', '12.5', 'Material balance tracking, surplus detection, leftover records and B2B marketplace publishing.', 'The waste-to-value flow keeps reusable construction material visible and available for resale instead of treating it as scrap. This supports prevention, reuse and reduction of construction waste.'],
    ]
    story += [para('SDG Mapping Justification', 'DocTitle'), para('The Buildwise prototype explicitly addresses the two Sustainable Development Goals below. The mapping is tied to implemented features, rather than treating SDGs as a general aspiration.', 'SubTitle'), requirements_table(sdgs, [1.28*inch, .55*inch, 2.12*inch, 3.0*inch]), Spacer(1,16), para('Scope note', 'H2x'), para('This academic prototype contributes through better information, decision support and circular-material workflows. It does not claim to measure project-level carbon reduction, lifecycle impacts or verified waste diversion; those outcomes would require a production data model and field validation.', 'Bodyx')]
    doc.build(story, onFirstPage=footer, onLaterPages=footer)
    return out

if __name__ == '__main__':
    arch = build_architecture_png()
    docs = build_documentation(IMG_DIR / 'buildwise_architecture_reference.jpg')
    screens = build_screenshots_pdf()
    requirements = build_requirements_sdg_pdf()
    print(docs)
    print(screens)
    print(arch)
    print(requirements)
