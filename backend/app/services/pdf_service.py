import os
import io
import datetime
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

_PDF_CACHE = {}

class PDFService:
    @staticmethod
    def generate_meeting_pdf(meeting_dict: dict) -> io.BytesIO:
        meeting_id = meeting_dict.get('id', '')
        if meeting_id in _PDF_CACHE:
            buffer = io.BytesIO(_PDF_CACHE[meeting_id])
            buffer.seek(0)
            return buffer

        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=36,
            leftMargin=36,
            topMargin=36,
            bottomMargin=36
        )

        styles = getSampleStyleSheet()
        
        # Custom Styles
        title_style = ParagraphStyle(
            'MeetingTitle',
            parent=styles['Heading1'],
            fontName='Helvetica-Bold',
            fontSize=22,
            leading=26,
            textColor=colors.HexColor('#1E1B4B')
        )
        
        meta_style = ParagraphStyle(
            'MeetingMeta',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=10,
            leading=14,
            textColor=colors.HexColor('#475569')
        )
        
        heading_style = ParagraphStyle(
            'SectionHeading',
            parent=styles['Heading2'],
            fontName='Helvetica-Bold',
            fontSize=14,
            leading=18,
            textColor=colors.HexColor('#4338CA'),
            spaceBefore=12,
            spaceAfter=6
        )

        body_style = ParagraphStyle(
            'Body',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=10,
            leading=14,
            textColor=colors.HexColor('#1E293B')
        )

        story = []

        # Title
        story.append(Paragraph(f"🧠 MeetingMind AI Report: {meeting_dict.get('meeting_title', 'Meeting')}", title_style))
        story.append(Spacer(1, 6))

        # Metadata
        meta_text = (
            f"<b>Meeting ID:</b> {meeting_dict.get('id', '')} | "
            f"<b>Department:</b> {meeting_dict.get('department', 'Engineering')} | "
            f"<b>Duration:</b> {meeting_dict.get('audio_duration', '30:00')}<br/>"
            f"<b>Sentiment:</b> {meeting_dict.get('sentiment', 'Neutral')} | "
            f"<b>LLM Provider:</b> {meeting_dict.get('provider_used', 'OpenRouter')} | "
            f"<b>Date:</b> {meeting_dict.get('created_at', '')[:10]}"
        )
        story.append(Paragraph(meta_text, meta_style))
        story.append(Spacer(1, 10))
        story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#6366F1'), spaceBefore=4, spaceAfter=12))

        # Executive Summary
        story.append(Paragraph("Executive Summary", heading_style))
        story.append(Paragraph(meeting_dict.get('summary', 'No summary available.'), body_style))
        story.append(Spacer(1, 10))

        # Key Decisions
        story.append(Paragraph("Key Decisions", heading_style))
        decisions = meeting_dict.get('decisions', [])
        if decisions:
            for d in decisions:
                d_text = d if isinstance(d, str) else d.get('title', '')
                story.append(Paragraph(f"• {d_text}", body_style))
        else:
            story.append(Paragraph("No key decisions recorded.", body_style))
        story.append(Spacer(1, 10))

        # Action Items Table
        story.append(Paragraph("Action Items & Deliverables", heading_style))
        action_items = meeting_dict.get('action_items', [])
        if action_items:
            table_data = [["Status", "Task", "Owner", "Priority", "Deadline"]]
            for act in action_items:
                table_data.append([
                    act.get('status', 'Pending'),
                    act.get('task', ''),
                    act.get('owner', 'Unassigned'),
                    act.get('priority', 'Medium'),
                    act.get('deadline', 'Not Mentioned')
                ])

            t = Table(table_data, colWidths=[60, 240, 90, 60, 80])
            t.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#EEF2FF')),
                ('TEXTCOLOR', (0,0), (-1,0), colors.HexColor('#312E81')),
                ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
                ('FONTSIZE', (0,0), (-1,0), 9),
                ('BOTTOMPADDING', (0,0), (-1,0), 6),
                ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
                ('FONTNAME', (0,1), (-1,-1), 'Helvetica'),
                ('FONTSIZE', (0,1), (-1,-1), 8.5),
            ]))
            story.append(t)
        else:
            story.append(Paragraph("No action items assigned.", body_style))

        story.append(Spacer(1, 12))

        # Risks
        story.append(Paragraph("Risks & Blockers", heading_style))
        risks = meeting_dict.get('risks', [])
        if risks:
            for r in risks:
                r_title = r.get('title', r) if isinstance(r, dict) else r
                r_desc = r.get('description', '') if isinstance(r, dict) else ''
                story.append(Paragraph(f"⚠️ <b>{r_title}:</b> {r_desc}", body_style))
        else:
            story.append(Paragraph("No high risks flagged.", body_style))

        story.append(Spacer(1, 20))
        story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#94A3B8'), spaceBefore=10, spaceAfter=10))
        story.append(Paragraph("Generated by MeetingMind AI — Modern AI Meeting Intelligence Platform", meta_style))

        doc.build(story)
        pdf_bytes = buffer.getvalue()
        if meeting_id:
            _PDF_CACHE[meeting_id] = pdf_bytes

        buffer.seek(0)
        return buffer
