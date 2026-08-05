from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT

OUT = Path('outputs/lernzettel-sicherung.pdf')
OUT.parent.mkdir(parents=True, exist_ok=True)
W, H = A4

NAVY = colors.HexColor('#07192c')
PANEL = colors.HexColor('#0d2b49')
BLUE = colors.HexColor('#2ac7ff')
GOLD = colors.HexColor('#ffc857')
ORANGE = colors.HexColor('#ff8c42')
RED = colors.HexColor('#ff4d5e')
WHITE = colors.HexColor('#f4fbff')
MUTED = colors.HexColor('#b5c8d8')
LIGHT = colors.HexColor('#eef6fb')
DARK = colors.HexColor('#173046')

c = canvas.Canvas(str(OUT), pagesize=A4)
c.setTitle('Lernzettel - Warum fliegt die Sicherung raus?')


def text(value, x, y, w, h, size=10, color=DARK, bold=False, align=TA_LEFT):
    style = ParagraphStyle(
        'text',
        fontName='Helvetica-Bold' if bold else 'Helvetica',
        fontSize=size,
        leading=size * 1.25,
        textColor=color,
        alignment=align,
    )
    paragraph = Paragraph(value, style)
    paragraph.wrapOn(c, w, h)
    paragraph.drawOn(c, x, y + h - paragraph.height)


def box(x, y, w, h, fill, stroke=None, radius=8):
    c.setFillColor(fill)
    c.setStrokeColor(stroke or fill)
    c.setLineWidth(1)
    c.roundRect(x, y, w, h, radius, fill=1, stroke=1)


# Page 1
c.setFillColor(NAVY)
c.rect(0, 0, W, H, fill=1, stroke=0)
c.setFillColor(BLUE)
c.rect(0, H - 8 * mm, W, 8 * mm, fill=1, stroke=0)
text('ELEKTROTECHNIK KLAR', 18 * mm, H - 23 * mm, 170 * mm, 8 * mm, 9, BLUE, True)
text('Warum fliegt die Sicherung raus?', 18 * mm, H - 42 * mm, 175 * mm, 17 * mm, 22, WHITE, True)
text('Leitungsschutzschalter: Überlast und Kurzschluss einfach erklärt', 18 * mm, H - 54 * mm, 175 * mm, 10 * mm, 10, MUTED)

box(18 * mm, H - 79 * mm, 174 * mm, 18 * mm, PANEL, BLUE)
text('<b>Kernaussage:</b> Der LSS schützt vor allem die Leitung vor zu hohem Strom und zu starker Erwärmung.', 24 * mm, H - 75 * mm, 162 * mm, 10 * mm, 10, WHITE)

col_y = H - 171 * mm
box(18 * mm, col_y, 83 * mm, 82 * mm, colors.HexColor('#17283a'), ORANGE)
box(109 * mm, col_y, 83 * mm, 82 * mm, colors.HexColor('#17283a'), RED)
text('ÜBERLAST', 23 * mm, col_y + 67 * mm, 73 * mm, 8 * mm, 15, ORANGE, True, TA_CENTER)
text('KURZSCHLUSS', 114 * mm, col_y + 67 * mm, 73 * mm, 8 * mm, 15, RED, True, TA_CENTER)
text('<b>Was passiert?</b><br/>Zu viele oder zu leistungsstarke Geräte laufen gleichzeitig. Der Strom ist länger zu hoch.', 24 * mm, col_y + 42 * mm, 71 * mm, 22 * mm, 9, WHITE)
text('<b>Was passiert?</b><br/>Zwei Leiter treffen mit sehr kleinem Widerstand aufeinander. Der Strom steigt schlagartig.', 115 * mm, col_y + 42 * mm, 71 * mm, 22 * mm, 9, WHITE)
text('<b>Auslöser:</b><br/>Bimetall erwärmt sich, verbiegt sich und löst zeitverzögert aus.', 24 * mm, col_y + 16 * mm, 71 * mm, 20 * mm, 9, WHITE)
text('<b>Auslöser:</b><br/>Elektromagnet zieht den Anker an und trennt den Stromkreis sehr schnell.', 115 * mm, col_y + 16 * mm, 71 * mm, 20 * mm, 9, WHITE)

box(18 * mm, 25 * mm, 174 * mm, 28 * mm, colors.HexColor('#102b43'), GOLD)
text('MERKSATZ', 24 * mm, 44 * mm, 162 * mm, 6 * mm, 10, GOLD, True, TA_CENTER)
text('<b>Überlast = thermisch und langsamer.</b><br/><b>Kurzschluss = magnetisch und sehr schnell.</b>', 24 * mm, 29 * mm, 162 * mm, 14 * mm, 12, WHITE, True, TA_CENTER)
c.showPage()

# Page 2
c.setFillColor(LIGHT)
c.rect(0, 0, W, H, fill=1, stroke=0)
c.setFillColor(NAVY)
c.rect(0, H - 30 * mm, W, 30 * mm, fill=1, stroke=0)
text('Richtig reagieren und Schutzgeräte unterscheiden', 18 * mm, H - 25 * mm, 174 * mm, 15 * mm, 18, WHITE, True)
text('Wenn der Leitungsschutzschalter ausgelöst hat', 18 * mm, H - 48 * mm, 174 * mm, 10 * mm, 14, DARK, True)

steps = [
    ('1', 'Geräte ausschalten oder Stecker ziehen.', 'Zuerst die angeschlossenen Verbraucher reduzieren.'),
    ('2', 'Schalter einmal wieder einschalten.', 'Nicht mehrfach hintereinander zurücksetzen.'),
    ('3', 'Löst er erneut aus: stoppen.', 'Ursache fachgerecht prüfen lassen.'),
    ('4', 'Nie an spannungsführenden Teilen arbeiten.', 'Verteilung nicht öffnen und Schutzgeräte nicht überbrücken.'),
]
y = H - 75 * mm
for number, title, description in steps:
    c.setFillColor(BLUE if number in ('1', '2') else RED)
    c.circle(27 * mm, y + 5 * mm, 6 * mm, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont('Helvetica-Bold', 11)
    c.drawCentredString(27 * mm, y + 1.5 * mm, number)
    box(40 * mm, y - 3 * mm, 152 * mm, 20 * mm, colors.white, colors.HexColor('#cbdbe6'))
    text(title, 45 * mm, y + 7 * mm, 142 * mm, 7 * mm, 10, DARK, True)
    text(description, 45 * mm, y - 1 * mm, 142 * mm, 8 * mm, 8, colors.HexColor('#50697b'))
    y -= 27 * mm

text('LSS ist nicht FI/RCD', 18 * mm, 86 * mm, 174 * mm, 10 * mm, 14, DARK, True)
box(18 * mm, 39 * mm, 83 * mm, 41 * mm, colors.white, BLUE)
box(109 * mm, 39 * mm, 83 * mm, 41 * mm, colors.white, GOLD)
text('LSS', 23 * mm, 66 * mm, 73 * mm, 7 * mm, 15, BLUE, True, TA_CENTER)
text('FI / RCD', 114 * mm, 66 * mm, 73 * mm, 7 * mm, 15, GOLD, True, TA_CENTER)
text('Schützt Leitungen vor Überlast und Kurzschluss.', 24 * mm, 45 * mm, 71 * mm, 17 * mm, 9, DARK, False, TA_CENTER)
text('Hat eine andere Schutzaufgabe: erkennt Fehlerströme.', 115 * mm, 45 * mm, 71 * mm, 17 * mm, 9, DARK, False, TA_CENTER)
text('Fachliche Grundlage', 18 * mm, 27 * mm, 60 * mm, 6 * mm, 8, DARK, True)
text('Siemens SENTRON MCB und Technology Primer; ABB Miniature Circuit Breakers & Supplementary Protectors. Stand: 04.08.2026.', 18 * mm, 13 * mm, 174 * mm, 13 * mm, 7, colors.HexColor('#50697b'))

c.save()
print(OUT)
