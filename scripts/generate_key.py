import os
import sys
import json
import time
import itertools
from google import genai
from google.genai import types
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def get_api_key_cycle():
    keys_file = os.path.join(os.path.dirname(__file__), 'api_keys.txt')
    with open(keys_file, 'r') as f:
        keys = [line.strip() for line in f if line.strip()]
    return itertools.cycle(keys)

def make_answer_key_pdf(json_data, output_pdf_path):
    doc = SimpleDocTemplate(output_pdf_path, pagesize=A4, rightMargin=30, leftMargin=30, topMargin=30, bottomMargin=30)
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(name="TitleStyle", parent=styles['Heading1'], fontSize=16, spaceAfter=10)
    cell_style = ParagraphStyle(name="CellStyle", parent=styles['Normal'], fontSize=9, leading=11)
    
    elements = [
        Paragraph("<b>Answer Key & Marking Scheme</b>", title_style),
        Spacer(1, 15)
    ]
    
    table_data = [["Q No.", "Correct Answer", "Marking Points", "Total Marks"]]
    for item in json_data:
        q = Paragraph(str(item.get("question", "")), cell_style)
        ans = Paragraph(str(item.get("correct_answer", "")), cell_style)
        points = item.get("marking_points", [])
        pts_str = "<br/>".join([f"• {p}" for p in points]) if isinstance(points, list) else str(points)
        pts = Paragraph(pts_str, cell_style)
        marks = Paragraph(str(item.get("total_marks", "")), cell_style)
        table_data.append([q, ans, pts, marks])
        
    t = Table(table_data, colWidths=[40, 100, 350, 40])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.lightgrey),
        ('ALIGN', (0,0), (0,-1), 'CENTER'),
        ('ALIGN', (3,0), (3,-1), 'CENTER'),
        ('ALIGN', (1,0), (2,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 9),
        ('BOTTOMPADDING', (0,0), (-1,0), 6),
        ('INNERGRID', (0,0), (-1,-1), 0.25, colors.black),
        ('BOX', (0,0), (-1,-1), 0.25, colors.black),
    ]))
    elements.append(t)
    doc.build(elements)

def generate_key(qp_path, out_json_path, out_pdf_path):
    api_key_cycle = get_api_key_cycle()
    
    for attempt in range(8):
        api_key = next(api_key_cycle)
        try:
            client = genai.Client(api_key=api_key)
            qp_file = client.files.upload(file=qp_path)
            
            prompt = """
You are an expert teacher. Please read this question paper and generate a comprehensive marking scheme / answer key.
For each question, provide the correct answer and the key points required for full marks.

Return ONLY a JSON array with this exact structure:
[
  {
    "question": "1",
    "correct_answer": "Final correct answer or proof conclusion",
    "marking_points": ["Point 1 for 1 mark", "Point 2 for 1 mark"],
    "total_marks": 2
  }
]
No other text. Just the JSON array.
"""
            for model_name in ['gemini-flash-lite-latest', 'gemini-3.5-flash-lite', 'gemini-3.8-flash']:
                try:
                    response = client.models.generate_content(
                        model=model_name,
                        contents=[qp_file, prompt],
                        config=types.GenerateContentConfig(response_mime_type="application/json")
                    )
                    data = json.loads(response.text)
                    with open(out_json_path, 'w') as f:
                        json.dump(data, f, indent=2)
                        
                    make_answer_key_pdf(data, out_pdf_path)
                    print(json.dumps({"success": True, "count": len(data), "model": model_name}))
                    return
                except Exception as model_err:
                    sys.stderr.write(f"Model {model_name} failed: {model_err}\n")
                    time.sleep(2)
        except Exception as e:
            sys.stderr.write(f"Attempt {attempt+1} failed with key {api_key[-4:]}: {e}\n")
            time.sleep(3)
            
    print(json.dumps({"success": False, "error": "Failed after 8 attempts"}))
    sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python generate_key.py <qp_pdf> <out_json> <out_pdf>")
        sys.exit(1)
    generate_key(sys.argv[1], sys.argv[2], sys.argv[3])
