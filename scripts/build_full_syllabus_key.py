import os
import sys
import json
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

FULL_ANSWER_KEY = [
  # Section A (Q1 to Q20 - 1 Mark each)
  {
    "question": "1",
    "correct_answer": "(B) 1",
    "marking_points": [
      "sin²θ + 1/(1 + tan²θ) = sin²θ + 1/sec²θ = sin²θ + cos²θ = 1."
    ],
    "total_marks": 1
  },
  {
    "question": "2",
    "correct_answer": "(D) 8.75 cm²",
    "marking_points": [
      "Area of sector = (1/2) × length of arc × radius = (1/2) × 3.5 × 5 = 8.75 cm²."
    ],
    "total_marks": 1
  },
  {
    "question": "3",
    "correct_answer": "(B) 6",
    "marking_points": [
      "Since terms are in AP: 2(x + 10) = 2x + (3x + 2) => 2x + 20 = 5x + 2 => 3x = 18 => x = 6."
    ],
    "total_marks": 1
  },
  {
    "question": "4",
    "correct_answer": "(D) a × b",
    "marking_points": [
      "For any two positive integers a and b, HCF(a, b) × LCM(a, b) = a × b."
    ],
    "total_marks": 1
  },
  {
    "question": "5",
    "correct_answer": "(B) 30°",
    "marking_points": [
      "√3 sin θ = cos θ => tan θ = 1/√3 => θ = 30°."
    ],
    "total_marks": 1
  },
  {
    "question": "6",
    "correct_answer": "(D) 8 cm",
    "marking_points": [
      "By Thales Theorem in ∆DEW (AB || EW): AD/DE = DB/DW => 4/12 = DB/24 => DB = 8 cm."
    ],
    "total_marks": 1
  },
  {
    "question": "7",
    "correct_answer": "(A) (3, –10)",
    "marking_points": [
      "Let A = (x, y). Centre (2, -3) is midpoint of AB: (x + 1)/2 = 2 => x = 3; (y + 4)/2 = -3 => y = -10."
    ],
    "total_marks": 1
  },
  {
    "question": "8",
    "correct_answer": "(D) 4/3",
    "marking_points": [
      "Substitute x = -3: (k - 1)(-3)² + k(-3) + 1 = 0 => 9k - 9 - 3k + 1 = 0 => 6k = 8 => k = 4/3."
    ],
    "total_marks": 1
  },
  {
    "question": "9",
    "correct_answer": "(A) 32.5°",
    "marking_points": [
      "In quad OAPB, ∠APB = 180° - 115° = 65°. OP bisects ∠APB => ∠APO = 65°/2 = 32.5°."
    ],
    "total_marks": 1
  },
  {
    "question": "10",
    "correct_answer": "(D) –3, 5",
    "marking_points": [
      "For equal roots D = 0 => (t + 1)² - 4(t + 4)(1) = 0 => t² - 2t - 15 = 0 => (t - 5)(t + 3) = 0 => t = 5, -3."
    ],
    "total_marks": 1
  },
  {
    "question": "11",
    "correct_answer": "(C) 7/8",
    "marking_points": [
      "Total outcomes = 8. Outcomes with at most 2 heads = 8 - (3 heads) = 8 - 1 = 7. P = 7/8."
    ],
    "total_marks": 1
  },
  {
    "question": "12",
    "correct_answer": "(C) -1, 7",
    "marking_points": [
      "Distance formula: (a - 3)² + (-1 - 2)² = 5² => (a - 3)² = 16 => a - 3 = ±4 => a = 7, -1."
    ],
    "total_marks": 1
  },
  {
    "question": "13",
    "correct_answer": "(B) (1/3)πr³",
    "marking_points": [
      "Max height of cone = r, base radius = r. Volume = (1/3)πr²h = (1/3)πr³."
    ],
    "total_marks": 1
  },
  {
    "question": "14",
    "correct_answer": "(C) 1",
    "marking_points": [
      "For p(x) = x² + x - 1, α + β = -1 and αβ = -1. 1/α + 1/β = (α + β)/(αβ) = -1 / -1 = 1."
    ],
    "total_marks": 1
  },
  {
    "question": "15",
    "correct_answer": "(C) 36 cm²",
    "marking_points": [
      "TSA of sphere = 4πr² = 48 cm². TSA of one hemisphere = 3πr² = (3/4) × 48 = 36 cm²."
    ],
    "total_marks": 1
  },
  {
    "question": "16",
    "correct_answer": "(B) 4: 3",
    "marking_points": [
      "Empirical formula: 3 Median = Mode + 2 Mean. Given Mean:Median = 9:8 => 3(8k) = Mode + 2(9k) => Mode = 6k. Median:Mode = 8:6 = 4:3."
    ],
    "total_marks": 1
  },
  {
    "question": "17",
    "correct_answer": "(C) 2/225 [or (B) 4/225 per paper printing]",
    "marking_points": [
      "Total 3-digit numbers = 900. Consecutive descending digits: 987, 876, 765, 654, 543, 432, 321, 210 (8 cases). P = 8/900 = 2/225."
    ],
    "total_marks": 1
  },
  {
    "question": "18",
    "correct_answer": "(A) 60°",
    "marking_points": [
      "In ∆PAB, PA = PB => ∠PAB = ∠PBA = (180° - 30°)/2 = 75°. AC || PB => ∠BAC = ∠PBA = 75° and alternate interior angles give ∠ABC = 60°."
    ],
    "total_marks": 1
  },
  {
    "question": "19",
    "correct_answer": "(C) Assertion (A) is true but reason (R) is false.",
    "marking_points": [
      "Algebraic sum of deviations from mean is zero (True). Mode CAN be determined graphically using histogram, so Reason is False."
    ],
    "total_marks": 1
  },
  {
    "question": "20",
    "correct_answer": "(A) Both assertion (A) and reason (R) are true and reason (R) is correct explanation of assertion (A)",
    "marking_points": [
      "Condition for inconsistency: a1/a2 = b1/b2 ≠ c1/c2. Here 2/4 = 3/k ≠ 5/7 => k = 6. Both true and R explains A."
    ],
    "total_marks": 1
  },

  # Section B (Q21 to Q25 - 2 Marks each)
  {
    "question": "21",
    "correct_answer": "No natural number n exists for which 4ⁿ ends with digit 0.",
    "marking_points": [
      "Prime factorization of 4ⁿ = (2²)ⁿ = 2²ⁿ. [1 Mark]",
      "For a number to end with digit zero, its prime factorization must contain both 2 and 5. Since 5 is absent, 4ⁿ can never end with digit 0. [1 Mark]"
    ],
    "total_marks": 2
  },
  {
    "question": "22",
    "correct_answer": "Ratio = 1:1, Coordinates of point of division = (-3/2, 0)",
    "marking_points": [
      "Point on x-axis has y = 0. Section formula: y = (k(5) + 1(-5))/(k + 1) = 0 => 5k - 5 = 0 => k = 1 (Ratio 1:1). [1 Mark]",
      "x-coordinate = (1(-4) + 1(1))/(1 + 1) = -3/2. Point is (-3/2, 0). [1 Mark]",
      "(OR Alternative: AP:PB = 3:4 => P divides AB in 3:4, coordinates P = (-5/7, -20/7))"
    ],
    "total_marks": 2
  },
  {
    "question": "23",
    "correct_answer": "Radius of circle = 2 cm",
    "marking_points": [
      "Using tangent properties: Area(∆ABC) = (1/2) × r × (AB + BC + CA). [1 Mark]",
      "Or using in-radius formula for right triangle: r = (a + b - c)/2 = (6 + 8 - 10)/2 = 4/2 = 2 cm. [1 Mark]"
    ],
    "total_marks": 2
  },
  {
    "question": "24",
    "correct_answer": "Proof shown: (sin A + cos A)(tan A + cot A) = sec A + cosec A",
    "marking_points": [
      "Convert tan A + cot A to sin A/cos A + cos A/sin A = (sin²A + cos²A)/(sin A cos A) = 1/(sin A cos A). [1 Mark]",
      "(sin A + cos A)/(sin A cos A) = 1/cos A + 1/sin A = sec A + cosec A = RHS. [1 Mark]"
    ],
    "total_marks": 2
  },
  {
    "question": "25",
    "correct_answer": "Perimeter of sector = 2r + l = 2(10.5) + 22 = 43 cm",
    "marking_points": [
      "Length of arc l = (θ/360°) × 2πr = (120°/360°) × 2 × (22/7) × 10.5 = (1/3) × 66 = 22 cm. [1 Mark]",
      "Perimeter = length of arc + 2r = 22 + 2(10.5) = 22 + 21 = 43 cm. [1 Mark]"
    ],
    "total_marks": 2
  },

  # Section C (Q26 to Q31 - 3 Marks each)
  {
    "question": "26",
    "correct_answer": "Proof: √2 + √3 is irrational.",
    "marking_points": [
      "Let √2 + √3 = x be a rational number. [0.5 Mark]",
      "Squaring both sides: x² = (√2 + √3)² = 2 + 3 + 2√6 = 5 + 2√6. [1 Mark]",
      "Rearranging: √6 = (x² - 5)/2. [0.5 Mark]",
      "Since x is rational, (x² - 5)/2 is rational, which means √6 is rational. But √6 is given to be irrational, which contradicts our assumption. Hence √2 + √3 is irrational. [1 Mark]"
    ],
    "total_marks": 3
  },
  {
    "question": "27",
    "correct_answer": "Zeroes are α = 0, β = 3. Relationships verified.",
    "marking_points": [
      "Factoring: x² - 3x = x(x - 3) = 0 => zeroes are α = 0 and β = 3. [1 Mark]",
      "Verification of Sum: α + β = 0 + 3 = 3 = -(-3)/1 = -b/a. [1 Mark]",
      "Verification of Product: αβ = 0 × 3 = 0 = 0/1 = c/a. [1 Mark]"
    ],
    "total_marks": 3
  },
  {
    "question": "28",
    "correct_answer": "Proof: (sin θ - cos θ + 1) / (sin θ + cos θ - 1) = 1 / (sec θ - tan θ)",
    "marking_points": [
      "Dividing numerator and denominator by cos θ: (tan θ - 1 + sec θ) / (tan θ + 1 - sec θ). [1 Mark]",
      "Substituting 1 = sec²θ - tan²θ in numerator: [(sec θ + tan θ) - (sec²θ - tan²θ)] / (tan θ - sec θ + 1). [1 Mark]",
      "Factoring (sec θ + tan θ)[1 - (sec θ - tan θ)] / (tan θ - sec θ + 1) = sec θ + tan θ = (sec²θ - tan²θ)/(sec θ - tan θ) = 1/(sec θ - tan θ). [1 Mark]"
    ],
    "total_marks": 3
  },
  {
    "question": "29",
    "correct_answer": "Area of shaded region = 66.5 cm²",
    "marking_points": [
      "Radius of big circle R = 7 cm. Radius of smaller circle r = 7/2 = 3.5 cm. Area of small circle = πr² = (22/7) × (7/2)² = 38.5 cm². [1 Mark]",
      "Area of semicircle ACB = (1/2)πR² = (1/2)(22/7)(49) = 77 cm². Area of ∆ABC = (1/2) × AB × OC = (1/2) × 14 × 7 = 49 cm². [1 Mark]",
      "Area of shaded segments = 77 - 49 = 28 cm². Total shaded area = 38.5 + 28 = 66.5 cm². [1 Mark]"
    ],
    "total_marks": 3
  },
  {
    "question": "30",
    "correct_answer": "Proof: AB/PQ = AD/PM",
    "marking_points": [
      "Given ∆ABC ~ ∆PQR => AB/PQ = BC/QR and ∠B = ∠Q. [1 Mark]",
      "Since AD and PM are medians, BC = 2BD and QR = 2QM => BD/QM = BC/QR = AB/PQ. [1 Mark]",
      "In ∆ABD and ∆PQM: AB/PQ = BD/QM and ∠B = ∠Q => ∆ABD ~ ∆PQM (SAS). Hence AB/PQ = AD/PM. [1 Mark]"
    ],
    "total_marks": 3
  },
  {
    "question": "31",
    "correct_answer": "Numbers are (18, 12) or (18, -12) [OR: Smaller tap = 25 hrs, Larger tap = 15 hrs]",
    "marking_points": [
      "Let numbers be x and y (x > 0). x² - y² = 180 and y² = 8x => x² - 8x - 180 = 0. [1 Mark]",
      "(x - 18)(x + 10) = 0 => x = 18 (x = -10 rejected as y² cannot be negative). [1 Mark]",
      "y² = 8(18) = 144 => y = ±12. Numbers are 18 and 12, or 18 and -12. [1 Mark]",
      "(OR Scheme: 1/x + 1/(x-10) = 8/75 => 8x² - 230x + 750 = 0 => x = 25 hrs (smaller), x-10 = 15 hrs (larger) [3 Marks])"
    ],
    "total_marks": 3
  },

  # Section D (Q32 to Q35 - 5 Marks each)
  {
    "question": "32",
    "correct_answer": "The number is 42 or 24",
    "marking_points": [
      "Let the tens digit be x and units digit be y. Original number = 10x + y, reversed = 10y + x. [1 Mark]",
      "(10x + y) + (10y + x) = 66 => 11x + 11y = 66 => x + y = 6 (Eq 1). [1.5 Marks]",
      "Digits differ by 2: |x - y| = 2 => x - y = 2 or y - x = 2 (Eq 2). [1 Mark]",
      "Case 1: x + y = 6, x - y = 2 => x = 4, y = 2 => Number = 42. [0.75 Mark]",
      "Case 2: x + y = 6, y - x = 2 => x = 2, y = 4 => Number = 24. [0.75 Mark]"
    ],
    "total_marks": 5
  },
  {
    "question": "33",
    "correct_answer": "Speed of jet plane = 240 m/s (or 864 km/h)",
    "marking_points": [
      "Correct figure representation showing constant height h = 3600√3 m, angles 60° and 30°. [1 Mark]",
      "In first right triangle: tan 60° = 3600√3 / x1 => √3 = 3600√3 / x1 => x1 = 3600 m. [1.5 Marks]",
      "In second right triangle: tan 30° = 3600√3 / x2 => 1/√3 = 3600√3 / x2 => x2 = 3600 × 3 = 10800 m. [1.5 Marks]",
      "Distance covered in 30 s = x2 - x1 = 10800 - 3600 = 7200 m. Speed = 7200 / 30 = 240 m/s. [1 Mark]"
    ],
    "total_marks": 5
  },
  {
    "question": "34",
    "correct_answer": "f1 = 28, f2 = 24 [OR: Mode = 30.63, Mean = 29.2]",
    "marking_points": [
      "Total frequency: 17 + f1 + 32 + f2 + 19 = 120 => f1 + f2 = 52 (Eq 1). [1.5 Marks]",
      "Midpoints: 10, 30, 50, 70, 90. Σfi·xi = 170 + 30f1 + 1600 + 70f2 + 1710 = 3480 + 30f1 + 70f2. [1.5 Marks]",
      "Mean = (3480 + 30f1 + 70f2)/120 = 50 => 30f1 + 70f2 = 2520 => 3f1 + 7f2 = 252 (Eq 2). [1 Mark]",
      "Solving Eq 1 & 2: 3(52 - f2) + 7f2 = 252 => 4f2 = 96 => f2 = 24, and f1 = 28. [1 Mark]",
      "(OR Scheme: Modal class 30-35, Mode = l + [(f1-f0)/(2f1-f0-f2)]h = 30 + (1/8)(5) = 30.63. Mean = 29.2 [5 Marks])"
    ],
    "total_marks": 5
  },
  {
    "question": "35",
    "correct_answer": "AB = 15 cm, AC = 13 cm",
    "marking_points": [
      "Tangents from external points: BD = BF = 8 cm, CD = CE = 6 cm. Let AF = AE = x. [1 Mark]",
      "Sides: a = 14, b = x + 6, c = x + 8. Semi-perimeter s = x + 14. [1 Mark]",
      "Area(∆ABC) = √[s(s-a)(s-b)(s-c)] = √[(x + 14)(x)(8)(6)] = √[48x(x + 14)]. [1 Mark]",
      "Also Area(∆ABC) = r × s = 4(x + 14). [1 Mark]",
      "Equating: 48x(x + 14) = 16(x + 14)² => 48x = 16x + 224 => 32x = 224 => x = 7. Thus AB = 7 + 8 = 15 cm, AC = 7 + 6 = 13 cm. [1 Mark]"
    ],
    "total_marks": 5
  },

  # Section E (Case Studies Q36 to Q38 - 4 Marks each)
  {
    "question": "36",
    "correct_answer": "(i) Rs. 3750, (ii) Rs. 3200, (iii) 384 [OR: (iv) -26]",
    "marking_points": [
      "(i) AP: a = 150, d = 50, n = 10. Actual amount S10 = (10/2)[2(150) + 9(50)] = 5[300 + 450] = Rs. 3750. [1 Mark]",
      "(ii) Money saved = Actual - Claimed = 3750 - 550 = Rs. 3200. [1 Mark]",
      "(iii) an = 4n - 10 => a1 = -6, a16 = 54. S16 = (16/2)[-6 + 54] = 8 × 48 = 384. [2 Marks]",
      "(OR (iv) AP: 10, 7, 4, ..., -62 => -62 = 10 + (n-1)(-3) => n = 25. Middle term is 13th term: a13 = 10 + 12(-3) = -26. [2 Marks])"
    ],
    "total_marks": 4
  },
  {
    "question": "37",
    "correct_answer": "(i) 144 cm², (ii) 2.1 cm, (iii) TSA Hemi = 41.58 cm² & TSA Cube = 864 cm² [OR: (iv) 877.86 cm²]",
    "marking_points": [
      "(i) Base area of cube = edge² = 12 × 12 = 144 cm². [1 Mark]",
      "(ii) Radius of hemisphere = diameter / 2 = 4.2 / 2 = 2.1 cm. [1 Mark]",
      "(iii) TSA of hemisphere = 3πr² = 3 × (22/7) × (2.1)² = 41.58 cm². TSA of cube = 6a² = 6 × 144 = 864 cm². [2 Marks]",
      "(OR (iv) TSA of decorative block = TSA of cube - πr² + 2πr² = 6a² + πr² = 864 + (22/7)(2.1)² = 864 + 13.86 = 877.86 cm². [2 Marks])"
    ],
    "total_marks": 4
  },
  {
    "question": "38",
    "correct_answer": "(i) 100 m, (ii) 40 m, (iii) 60 m [OR: (iv) 16 m]",
    "marking_points": [
      "(i) Height/Shadow ratio = 20/10 = 2. Height of tower = 2 × 50 = 100 m. [1 Mark]",
      "(ii) Height of Ajay's house = 2 × 20 = 40 m. [1 Mark]",
      "(iii) Sun ratio = 20/12 = 5/3. Tower shadow = 100 / (5/3) = 60 m. [2 Marks]",
      "(OR (iv) Ajay's shadow / 40 = 40 / 100 => Ajay's shadow = 16 m. [2 Marks])"
    ],
    "total_marks": 4
  }
]

def make_answer_key_pdf(json_data, output_pdf_path):
    doc = SimpleDocTemplate(
        output_pdf_path, 
        pagesize=A4, 
        rightMargin=25, 
        leftMargin=25, 
        topMargin=25, 
        bottomMargin=25
    )
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        name="TitleStyle", 
        parent=styles['Heading1'], 
        fontSize=14, 
        leading=16,
        textColor=colors.HexColor("#0f172a"),
        spaceAfter=4
    )
    subtitle_style = ParagraphStyle(
        name="SubStyle", 
        parent=styles['Normal'], 
        fontSize=9, 
        leading=12,
        textColor=colors.HexColor("#475569"), 
        spaceAfter=10
    )
    cell_style = ParagraphStyle(
        name="CellStyle", 
        parent=styles['Normal'], 
        fontSize=8, 
        leading=10
    )
    header_style = ParagraphStyle(
        name="HeaderStyle", 
        parent=styles['Normal'], 
        fontSize=8.5, 
        leading=11, 
        fontName="Helvetica-Bold",
        textColor=colors.HexColor("#0f172a")
    )
    
    elements = [
        Paragraph("<b>MATRIX ACADEMY — CLASS X MATHEMATICS FULL SYLLABUS TEST 3</b>", title_style),
        Paragraph("Official Marking Scheme & Answer Key (NCERT Level • 80 Marks • 38 Questions)", subtitle_style),
        Spacer(1, 4)
    ]
    
    table_data = [[
        Paragraph("<b>Q No.</b>", header_style),
        Paragraph("<b>Correct Answer</b>", header_style),
        Paragraph("<b>Step-by-Step Marking Points</b>", header_style),
        Paragraph("<b>Marks</b>", header_style)
    ]]
    
    for item in json_data:
        q = Paragraph(f"<b>Q{str(item.get('question', ''))}</b>", cell_style)
        ans = Paragraph(str(item.get("correct_answer", "")), cell_style)
        points = item.get("marking_points", [])
        if isinstance(points, list):
            pts_str = "<br/>".join([f"• {p}" for p in points])
        else:
            pts_str = str(points)
        pts = Paragraph(pts_str, cell_style)
        marks = Paragraph(f"<b>{str(item.get('total_marks', ''))}M</b>", cell_style)
        table_data.append([q, ans, pts, marks])
        
    t = Table(table_data, colWidths=[40, 125, 345, 35])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#e2e8f0")),
        ('ALIGN', (0,0), (0,-1), 'CENTER'),
        ('ALIGN', (3,0), (3,-1), 'CENTER'),
        ('ALIGN', (1,0), (2,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,0), 4),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,1), (-1,-1), 3),
        ('INNERGRID', (0,0), (-1,-1), 0.25, colors.HexColor("#cbd5e1")),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#64748b")),
    ]))
    elements.append(t)
    doc.build(elements)
    print(f"Built PDF: {output_pdf_path} ({len(json_data)} questions)")

if __name__ == "__main__":
    out_json = "/Users/dhruvrawat/Desktop/My Work/AI-Grader/test_data/full_syllabus_test_3/answer_key.json"
    out_pdf = "/Users/dhruvrawat/Desktop/My Work/AI-Grader/test_data/full_syllabus_test_3/answer_key.pdf"
    
    with open(out_json, "w") as f:
        json.dump(FULL_ANSWER_KEY, f, indent=2)
    print(f"Saved JSON: {out_json}")
    
    make_answer_key_pdf(FULL_ANSWER_KEY, out_pdf)
