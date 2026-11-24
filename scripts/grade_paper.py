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

def make_result_sheet(grades, output_pdf_path, student_name="Student", total_score=""):
    doc = SimpleDocTemplate(output_pdf_path, pagesize=A4, rightMargin=30, leftMargin=30, topMargin=30, bottomMargin=30)
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(name="TitleStyle", parent=styles['Heading1'], fontSize=16, spaceAfter=8)
    info_style = ParagraphStyle(name="InfoStyle", parent=styles['Normal'], fontSize=10, spaceAfter=2)
    cell_style = ParagraphStyle(name="CellStyle", parent=styles['Normal'], fontSize=9, leading=11)
    
    elements = [
        Paragraph("<b>Matrix Academy - Result Sheet</b>", title_style),
        Paragraph(f"<b>Student:</b> {student_name}", info_style),
        Paragraph(f"<b>Total Score:</b> <font color='#16a34a'><b>{total_score}</b></font>", info_style),
        Spacer(1, 15)
    ]
    
    table_data = [["Question", "Score", "Evaluation & Reason"]]
    for item in grades:
        q = Paragraph(str(item.get("Question", "")), cell_style)
        s = Paragraph(str(item.get("Score", "")), cell_style)
        r = Paragraph(str(item.get("Reason", "")), cell_style)
        table_data.append([q, s, r])
        
    t = Table(table_data, colWidths=[60, 50, 420])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.lightgrey),
        ('ALIGN', (0,0), (1,-1), 'CENTER'),
        ('ALIGN', (2,0), (2,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 9),
        ('BOTTOMPADDING', (0,0), (-1,0), 6),
        ('INNERGRID', (0,0), (-1,-1), 0.25, colors.black),
        ('BOX', (0,0), (-1,-1), 0.25, colors.black),
    ]))
    elements.append(t)
    doc.build(elements)

def grade_submission(pdf_path, key_path, out_dir, url_prefix):
    with open(key_path, 'r') as f:
        answer_key_json = f.read()
        
    api_key_cycle = get_api_key_cycle()
    
    for attempt in range(8):
        api_key = next(api_key_cycle)
        try:
            client = genai.Client(api_key=api_key)
            student_file = client.files.upload(file=pdf_path)
            
            prompt = f"""
You are an expert teacher grading a student's answer sheet. Take your time, analyze thoroughly.

Here is the correct Answer Key and Marking Scheme:
{answer_key_json}

First, carefully examine Page 1 header for:
1. Student Name (e.g. "Shivansh Singh"). If unreadable, say "Student".
2. Student WhatsApp Phone Number (10 digits). If found, format with country code like "+91 98XXXXXXXX". If not found, output "".

Then, evaluate the student's handwritten work step-by-step against the marking scheme.

Return ONLY a JSON object with this exact structure:
{{
  "student_name": "Extracted Name",
  "phone_number": "+91 98XXXXXXXX",
  "grades": [
    {{
      "Question": "Q1",
      "Score": "1/2",
      "Reason": "Awarded 1 mark for formula. Deducted 1 mark because calculation was wrong."
    }}
  ]
}}
No other text. Just the JSON object.
"""
            response = None
            for model_name in ['gemini-flash-lite-latest', 'gemini-3.5-flash-lite', 'gemini-3.8-flash']:
                try:
                    response = client.models.generate_content(
                        model=model_name,
                        contents=[student_file, prompt],
                        config=types.GenerateContentConfig(response_mime_type="application/json")
                    )
                    break
                except Exception as m_err:
                    sys.stderr.write(f"Model {model_name} failed: {m_err}\n")
                    time.sleep(2)
            if not response:
                raise Exception("All models failed for this key")
            
            result = json.loads(response.text)
            raw_name = result.get("student_name", "Student").strip()
            clean_name = raw_name.replace("/", "_").replace("\\", "_").replace(" ", "_")
            if not clean_name:
                clean_name = "Student"
                
            phone = result.get("phone_number", "").strip()
            grades = result.get("grades", [])
            
            # Compute total score
            earned_total = 0.0
            possible_total = 0.0
            for g in grades:
                score_str = str(g.get("Score", ""))
                if "/" in score_str:
                    try:
                        e, p = score_str.split("/")
                        earned_total += float(e.strip())
                        possible_total += float(p.strip())
                    except ValueError:
                        pass
                        
            earned_str = f"{int(earned_total)}" if earned_total.is_integer() else f"{earned_total}"
            possible_str = f"{int(possible_total)}" if possible_total.is_integer() else f"{possible_total}"
            total_score_str = f"{earned_str}/{possible_str}" if possible_total > 0 else "N/A"
            
            # Generate PDF
            out_filename = f"{clean_name}_Result_Sheet.pdf"
            out_pdf_path = os.path.join(out_dir, out_filename)
            make_result_sheet(grades, out_pdf_path, student_name=raw_name, total_score=total_score_str)
            
            pdf_url = f"{url_prefix.rstrip('/')}/{out_filename}"
            
            output_payload = {
                "success": True,
                "name": raw_name,
                "phone": phone or "+91 9811000000",
                "score": total_score_str,
                "totalMarks": possible_total if possible_total > 0 else 30,
                "pdfUrl": pdf_url,
                "whatsappStatus": "ready"
            }
            print(json.dumps(output_payload))
            return
        except Exception as e:
            sys.stderr.write(f"Grading attempt {attempt+1} failed with key {api_key[-4:]}: {e}\n")
            
    print(json.dumps({"success": False, "error": "Grading failed after 8 attempts"}))
    sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 5:
        print("Usage: python grade_paper.py <student_pdf> <key_json> <out_dir> <url_prefix>")
        sys.exit(1)
    grade_submission(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4])
