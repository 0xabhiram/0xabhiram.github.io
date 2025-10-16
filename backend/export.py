# PDF export functionality

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_LEFT
from io import BytesIO


def generate_pdf(frames):
    """Generate PDF with all frames in table format"""
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, 
                          rightMargin=30, leftMargin=30,
                          topMargin=30, bottomMargin=30)
    
    elements = []
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=16,
        textColor=colors.HexColor('#2c3e50'),
        spaceAfter=30,
        alignment=TA_LEFT
    )
    
    header_style = ParagraphStyle(
        'CustomHeader',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.white,
        alignment=TA_LEFT
    )
    
    cell_style = ParagraphStyle(
        'CustomCell',
        parent=styles['Normal'],
        fontSize=9,
        alignment=TA_LEFT
    )
    
    # Title
    title = Paragraph("Frame Details Document", title_style)
    elements.append(title)
    elements.append(Spacer(1, 0.2*inch))
    
    for idx, frame in enumerate(frames):
        # Frame title
        frame_title = Paragraph(f"<b>Frame {frame.frame_number}</b>", title_style)
        elements.append(frame_title)
        elements.append(Spacer(1, 0.1*inch))
        
        # Create table data
        data = [
            ['Field', 'Value'],
            ['Frame Number', Paragraph(str(frame.frame_number), cell_style)],
            ['Frame Tone', Paragraph(str(frame.frame_tone), cell_style)],
            ['Content — Dialogues / Narration', Paragraph(str(frame.content), cell_style)],
            ['Frame Type', Paragraph(str(frame.frame_type), cell_style)],
            ['Voice Over Required?', Paragraph('Yes' if frame.voice_over_required else 'No', cell_style)],
            ['Editing Required?', Paragraph('Yes' if frame.editing_required else 'No', cell_style)],
            ['Facilitator Costume / Props', Paragraph(str(frame.facilitator_costume_props), cell_style)],
            ['Scene Description', Paragraph(str(frame.scene_description), cell_style)],
            ['Camera / Cinematographer Notes', Paragraph(str(frame.camera_notes), cell_style)],
            ['Editing Notes', Paragraph(str(frame.editing_notes), cell_style)],
            ['Suggestions for Frame Improvement', Paragraph(str(frame.suggestions), cell_style)],
        ]
        
        # Create table
        table = Table(data, colWidths=[2.5*inch, 4.5*inch])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (1, 0), colors.HexColor('#3498db')),
            ('TEXTCOLOR', (0, 0), (1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('FONTNAME', (0, 0), (1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (1, 0), 12),
            ('BACKGROUND', (0, 1), (0, -1), colors.HexColor('#ecf0f1')),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#bdc3c7')),
            ('FONTNAME', (0, 1), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 1), (-1, -1), 9),
            ('PADDING', (0, 0), (-1, -1), 8),
        ]))
        
        elements.append(table)
        
        # Add page break between frames (except for the last one)
        if idx < len(frames) - 1:
            elements.append(PageBreak())
    
    doc.build(elements)
    buffer.seek(0)
    return buffer

