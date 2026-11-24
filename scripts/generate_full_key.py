import os
import sys
import json
import re
import time
import itertools
import pymupdf
from google import genai
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
    title_style = ParagraphStyle(name="TitleStyle", parent=styles['Heading1'], fontSize=16, spaceAfter=8)
    subtitle_style = ParagraphStyle(name="SubStyle", parent=styles['Normal'], fontSize=10, textColor=colors.HexColor("#475569"), spaceAfter=12)
    cell_style = ParagraphStyle(name="CellStyle", parent=styles['Normal'], fontSize=8.5, leading=11)
    
    elements = [
        Paragraph("<b>Matrix Academy - Class X Mathematics Full Syllabus</b>", title_style),
        Paragraph("Official Marking Scheme & Answer Key (NCERT Level • 80 Marks)", subtitle_style),
        Spacer(1, 10)
    ]
    
    table_data = [["Q No.", "Correct Answer", "Step-by-Step Marking Points", "Marks"]]
    for item in json_data:
        q = Paragraph(f"<b>{str(item.get('question', ''))}</b>", cell_style)
        ans = Paragraph(str(item.get("correct_answer", "")), cell_style)
        points = item.get("marking_points", [])
        if isinstance(points, list):
            pts_str = "<br/>".join([f"• {p}" for p in points])
        else:
            pts_str = str(points)
        pts = Paragraph(pts_str, cell_style)
        marks = Paragraph(f"<b>{str(item.get('total_marks', ''))}M</b>", cell_style)
        table_data.append([q, ans, pts, marks])
        
    t = Table(table_data, colWidths=[45, 110, 335, 45])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f1f5f9")),
        ('ALIGN', (0,0), (0,-1), 'CENTER'),
        ('ALIGN', (3,0), (3,-1), 'CENTER'),
        ('ALIGN', (1,0), (2,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 8.5),
        ('BOTTOMPADDING', (0,0), (-1,0), 6),
        ('INNERGRID', (0,0), (-1,-1), 0.25, colors.HexColor("#cbd5e1")),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#94a3b8")),
    ]))
    elements.append(t)
    doc.build(elements)

def clean_json_text(text):
    text = text.strip()
    match = re.search(r'\[.*\]', text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(0))
        except Exception:
            pass
    try:
        return json.loads(text)
    except Exception:
        return []

def solve_section(client, text_chunk, section_name, prompt_instruction):
    prompt = f"""You are an expert CBSE Class 10 Mathematics teacher.
Here are the questions for {section_name} of the test paper:

{text_chunk}

{prompt_instruction}

Output format requirement:
Output a raw JSON array only. Do not wrap in markdown or backticks.
[
  {{
    "question": "1",
    "correct_answer": "...",
    "marking_points": ["..."],
    "total_marks": 1
  }}
]
"""
    for model_name in ['gemini-flash-lite-latest', 'gemini-3.5-flash-lite']:
        try:
            r = client.models.generate_content(model=model_name, contents=prompt)
            data = clean_json_text(r.text)
            if data and len(data) > 0:
                return data
        except Exception as e:
            sys.stderr.write(f"Model {model_name} failed for {section_name}: {e}\n")
            time.sleep(2)
    return []

def generate_full_paper_key(qp_path, out_json_path, out_pdf_path):
    print("Reading Question Paper text with PyMuPDF...")
    doc = pymupdf.open(qp_path)
    
    # Page mapping:
    # Page 1: Q1 to Q8
    # Page 2: Q9 to Q18
    # Page 3: Q19 to Q25
    # Page 4: Q26 to Q31
    # Page 5: Q32 to Q35
    # Page 6: Q36 to Q38
    pages_text = [p.get_text() for p in doc]
    
    sections = [
        {
            "name": "Section A - Part 1 (Q1 to Q10)",
            "text": pages_text[0] + "\n" + pages_text[1][:pages_text[1].find("11.") if "11." in pages_text[1] else len(pages_text[1])//2],
            "instruction": "Solve Questions 1 to 10 (1 mark each). Give question number, correct option & answer, 1-line reason, total_marks: 1."
        },
        {
            "name": "Section A - Part 2 (Q11 to Q20)",
            "text": pages_text[1][pages_text[1].find("11.") if "11." in pages_text[1] else len(pages_text[1])//2:] + "\n" + pages_text[2][:pages_text[2].find("SECTION B") if "SECTION B" in pages_text[2] else len(pages_text[2])//2],
            "instruction": "Solve Questions 11 to 20 (1 mark each, including Assertion-Reason). Give question number, correct option & answer, 1-line reason, total_marks: 1."
        },
        {
            "name": "Section B (Q21 to Q25)",
            "text": pages_text[2][pages_text[2].find("SECTION B") if "SECTION B" in pages_text[2] else 0:],
            "instruction": "Solve Questions 21 to 25 (2 marks each). Give step-by-step points for awarding marks, total_marks: 2."
        },
        {
            "name": "Section C (Q26 to Q31)",
            "text": pages_text[3],
            "instruction": "Solve Questions 26 to 31 (3 marks each). Give step-by-step points for awarding marks, total_marks: 3."
        },
        {
            "name": "Section D (Q32 to Q35)",
            "text": pages_text[4],
            "instruction": "Solve Questions 32 to 35 (5 marks each). Give step-by-step points for awarding marks, total_marks: 5."
        },
        {
            "name": "Section E (Q36 to Q38 - Case Studies)",
            "text": pages_text[5] if len(pages_text) > 5 else pages_text[-1],
            "instruction": "Solve Questions 36 to 38 (Case Study questions with subparts). Give step-by-step points for each subpart, total_marks: 4."
        }
    ]
    
    api_key_cycle = get_api_key_cycle()
    all_questions = []
    
    for sec in sections:
        print(f"Solving {sec['name']}...")
        solved = False
        for attempt in range(4):
            key = next(api_key_cycle)
            client = genai.Client(api_key=key)
            data = solve_section(client, sec["text"], sec["name"], sec["instruction"])
            if data:
                print(f"  -> Generated {len(data)} questions for {sec['name']}")
                all_questions.extend(data)
                solved = True
                break
            else:
                print(f"  -> Retry {attempt+1} with next key...")
                time.sleep(3)
        if not solved:
            print(f"Warning: Could not solve {sec['name']}")
            
    print(f"Total questions generated across all sections: {len(all_questions)}")
    
    # Save combined JSON
    with open(out_json_path, 'w') as f:
        json.dump(all_questions, f, indent=2)
    print(f"Saved Answer Key JSON to {out_json_path}")
    
    # Generate PDF
    make_answer_key_pdf(all_questions, out_pdf_path)
    print(f"Saved Answer Key PDF to {out_pdf_path}")
    print(json.dumps({"success": True, "count": len(all_questions)}))

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python generate_full_key.py <qp_pdf> <out_json> <out_pdf>")
        sys.exit(1)
    generate_full_paper_key(sys.argv[1], sys.argv[2], sys.argv[3])
