# Data Schema Documentation

This document explains the structure and purpose of each JSON data file.

## 📋 Overview

All data files are located in `src/data/` and follow strict TypeScript interfaces defined in `src/lib/types.ts`.

---

## 1. center-info.json

**Purpose:** Store basic information about the coaching center.

**Structure:**
```json
{
  "name": "Matrix Coaching Center",
  "tagline": "Excellence in Education Since 2015",
  "description": "Long description...",
  "established": 2015,
  "totalStudents": 1000,
  "contact": {
    "phone": "+91-9876543210",
    "email": "info@matrixcoaching.com",
    "whatsapp": "+91-9876543210"
  },
  "address": {
    "street": "123, Nehru Place",
    "area": "South Delhi",
    "city": "New Delhi",
    "state": "Delhi",
    "pincode": "110019",
    "landmark": "Near Metro Station",
    "googleMapsUrl": "https://maps.google.com/?q=28.5494,77.2501"
  },
  "socialMedia": {
    "facebook": "https://facebook.com/matrixcoaching",
    "instagram": "https://instagram.com/matrixcoaching",
    "youtube": "https://youtube.com/@matrixcoaching"
  },
  "operatingHours": {
    "weekdays": "8:00 AM - 8:00 PM",
    "weekends": "9:00 AM - 6:00 PM"
  },
  "keyFeatures": [
    {
      "title": "Expert Faculty",
      "description": "Highly qualified teachers...",
      "icon": "users"  // Lucide icon name
    }
  ]
}
```

**Fields Explained:**

| Field | Type | Purpose | Example |
|-------|------|---------|---------|
| `name` | string | Center name | "Matrix Coaching" |
| `tagline` | string | Catchy slogan | "Excellence in Education" |
| `contact.phone` | string | Phone number | "+91-9876543210" |
| `contact.whatsapp` | string | WhatsApp number | Same as phone usually |
| `address.googleMapsUrl` | string | Google Maps link | For "View on Map" button |
| `keyFeatures[].icon` | string | Icon name from Lucide | "users", "trophy", "book" |

**Usage in Code:**
```typescript
import { getCenterInfo } from '@/lib/data-fetchers';

const info = await getCenterInfo();
console.log(info.name); // "Matrix Coaching Center"
```

---

## 2. schedules.json

**Purpose:** Store class schedules, batches, teachers, and fees.

**Structure:**
```json
{
  "classes": [
    {
      "id": "class-10",
      "name": "Class 10th",
      "board": "CBSE/ICSE",
      "subjects": ["Mathematics", "Science", "English"],
      "batches": [
        {
          "id": "c10-batch-1",
          "name": "Morning Batch",
          "schedule": {
            "days": ["Monday", "Wednesday", "Friday"],
            "time": "8:00 AM - 10:00 AM"
          },
          "teacher": {
            "name": "Mr. Rajesh Kumar",
            "qualification": "M.Sc. Mathematics",
            "experience": "12 years"
          },
          "capacity": 20,
          "enrolled": 18,
          "fees": {
            "monthly": 3500,
            "quarterly": 10000,
            "halfYearly": 18000,
            "annual": 35000
          }
        }
      ]
    }
  ]
}
```

**Key Concepts:**

1. **Class** - Grade level (e.g., Class 10th)
2. **Batch** - Specific group within a class (e.g., Morning Batch)
3. **Schedule** - Days and timing
4. **Teacher** - Assigned faculty
5. **Fees** - Multiple payment options

**Fields Explained:**

| Field | Type | Purpose | Notes |
|-------|------|---------|-------|
| `classes[].id` | string | Unique identifier | Use kebab-case: "class-10" |
| `classes[].name` | string | Display name | "Class 10th" |
| `batches[].capacity` | number | Max students | Total seats |
| `batches[].enrolled` | number | Current students | Should be ≤ capacity |
| `fees.monthly` | number | Monthly fee | In rupees |

**Usage Example:**
```typescript
// Get all classes
const data = await getAllSchedules();
data.classes.forEach(cls => {
  console.log(`${cls.name} has ${cls.batches.length} batches`);
});

// Get specific class
const class10 = await getScheduleByClass('class-10');
console.log(class10?.batches[0].teacher.name);
```

**Adding a New Batch:**

```json
{
  "id": "c10-batch-3",
  "name": "Weekend Batch",
  "schedule": {
    "days": ["Saturday", "Sunday"],
    "time": "10:00 AM - 1:00 PM"
  },
  "teacher": {
    "name": "Dr. New Teacher",
    "qualification": "Ph.D. Physics",
    "experience": "15 years"
  },
  "capacity": 25,
  "enrolled": 0,
  "fees": {
    "monthly": 4000,
    "quarterly": 11500,
    "halfYearly": 21000,
    "annual": 38000
  }
}
```

---

## 3. results.json

**Purpose:** Store academic results, toppers, and achievements.

**Structure:**
```json
{
  "academicYears": [
    {
      "year": "2023-2024",
      "board": "CBSE",
      "highlights": {
        "totalStudents": 180,
        "above90Percent": 142,
        "above95Percent": 68,
        "perfectScores": 12,
        "averagePercentage": 91.4
      },
      "toppers": [
        {
          "rollNumber": "MTX2024001",
          "name": "Aarav Sharma",
          "class": "12th",
          "stream": "Science (PCM)",
          "percentage": 98.6,
          "subjects": {
            "Mathematics": 100,
            "Physics": 98,
            "Chemistry": 97
          },
          "achievements": [
            "JEE Main AIR 245",
            "School Topper"
          ],
          "testimonial": "Optional quote from student"
        }
      ],
      "subjectWiseExcellence": [
        {
          "subject": "Mathematics",
          "averageScore": 92.5,
          "studentsAbove95": 89,
          "perfectScores": 28
        }
      ],
      "competitiveExams": [
        {
          "exam": "JEE Main",
          "qualified": 45,
          "topRank": 245
        }
      ]
    }
  ],
  "hallOfFame": [
    {
      "category": "University Admissions",
      "achievements": [
        "15+ students in IITs",
        "28+ students in NITs"
      ]
    }
  ]
}
```

**Important Fields:**

| Field | Type | Purpose | Notes |
|-------|------|---------|-------|
| `rollNumber` | string | **Student identifier** | CRITICAL for Phase 2 lookup |
| `subjects` | object | Subject → Marks mapping | Key = subject name |
| `percentage` | number | Overall percentage | Decimal format: 98.6 |
| `achievements` | array | Notable accomplishments | Awards, ranks, etc. |

**Roll Number Format:**

Pattern: `MTX` + `YEAR` + `NUMBER`

Examples:
- `MTX2024001` - First student of 2024
- `MTX2023045` - 45th student of 2023

**Why Roll Numbers Matter:**

In Phase 2, students will use roll numbers to look up their marks:
```
Enter Roll Number: MTX2024001
→ Shows all exam results for that student
```

**Adding New Year Results:**

```json
{
  "year": "2024-2025",
  "board": "CBSE",
  "highlights": {
    "totalStudents": 200,
    "above90Percent": 160,
    "above95Percent": 75,
    "perfectScores": 15,
    "averagePercentage": 92.1
  },
  "toppers": [
    // Add new toppers here
  ]
}
```

---

## 4. testimonials.json

**Purpose:** Store student and parent reviews.

**Structure:**
```json
{
  "testimonials": [
    {
      "id": 1,
      "name": "Mrs. Sharma",
      "relation": "Parent of Class 12th Student",
      "rating": 5,
      "comment": "Excellent coaching center...",
      "year": 2024
    }
  ]
}
```

**Fields:**

| Field | Type | Purpose | Example |
|-------|------|---------|---------|
| `id` | number | Unique identifier | 1, 2, 3... |
| `name` | string | Reviewer name | Can be anonymous |
| `relation` | string | Connection to center | "Parent of...", "Student..." |
| `rating` | number | Star rating | 1-5 |
| `comment` | string | Review text | Keep under 200 chars |
| `year` | number | Review year | 2024 |

**Usage:**
```typescript
// Get recent testimonials for homepage
const recent = await getRecentTestimonials(6);
recent.forEach(t => {
  console.log(`${t.name}: ${t.rating} stars`);
});
```

---

## 🔄 Phase 2 Database Migration

When migrating to a database, these JSON structures become table schemas:

### Supabase Tables

**center_info table:**
```sql
CREATE TABLE center_info (
  id UUID PRIMARY KEY,
  name VARCHAR(200),
  tagline TEXT,
  contact JSONB,
  address JSONB,
  updated_at TIMESTAMP
);
```

**schedules table:**
```sql
CREATE TABLE schedules (
  id UUID PRIMARY KEY,
  class_id VARCHAR(50),
  class_name VARCHAR(100),
  batches JSONB,  -- Store as JSON array
  updated_at TIMESTAMP
);
```

**student_results table:**
```sql
CREATE TABLE student_results (
  id UUID PRIMARY KEY,
  roll_number VARCHAR(20) UNIQUE,  -- For lookup!
  student_name VARCHAR(100),
  class VARCHAR(20),
  exam_name VARCHAR(100),
  subjects JSONB,
  percentage DECIMAL(5,2),
  created_at TIMESTAMP
);

CREATE INDEX idx_roll_number ON student_results(roll_number);
```

### Data Migration Script

```typescript
// scripts/migrate-to-db.ts
import { createClient } from '@supabase/supabase-js';
import centerInfo from '../src/data/center-info.json';
import results from '../src/data/results.json';

const supabase = createClient(url, key);

async function migrate() {
  // Migrate center info
  await supabase.from('center_info').insert(centerInfo);
  
  // Migrate results
  for (const year of results.academicYears) {
    for (const topper of year.toppers) {
      await supabase.from('student_results').insert({
        roll_number: topper.rollNumber,
        student_name: topper.name,
        class: topper.class,
        subjects: topper.subjects,
        percentage: topper.percentage,
      });
    }
  }
}
```

---

## 📝 Editing Guidelines

### For Non-Developers

**Safe Edits:**
- ✅ Change phone numbers
- ✅ Update fees
- ✅ Add new batches (copy existing structure)
- ✅ Update student names/marks
- ✅ Change operating hours

**Dangerous Edits:**
- ❌ Don't change field names (`"name":` → `"title":` will break)
- ❌ Don't remove required fields
- ❌ Don't break JSON syntax (missing commas, brackets)

**Testing After Edit:**
```bash
# Check JSON is valid
cat src/data/schedules.json | python -m json.tool

# If error, fix the JSON syntax
# If success, rebuild site
npm run build
```

### JSON Syntax Rules

**Commas:**
```json
// ✅ Correct
{
  "name": "Value",
  "age": 25
}

// ❌ Wrong (trailing comma)
{
  "name": "Value",
  "age": 25,
}
```

**Quotes:**
```json
// ✅ Correct
"name": "John"

// ❌ Wrong (single quotes)
'name': 'John'
```

**Numbers:**
```json
// ✅ Correct
"age": 25,
"percentage": 98.6

// ❌ Wrong (quotes around numbers)
"age": "25"
```

---

## 🔍 Validation

### Automated Validation (Future)

Create `scripts/validate-data.ts`:

```typescript
import Ajv from 'ajv';
import centerInfo from '../src/data/center-info.json';

const schema = {
  type: 'object',
  required: ['name', 'contact', 'address'],
  properties: {
    name: { type: 'string', minLength: 1 },
    contact: {
      type: 'object',
      required: ['phone', 'email'],
    },
  },
};

const ajv = new Ajv();
const valid = ajv.validate(schema, centerInfo);

if (!valid) {
  console.error('Validation errors:', ajv.errors);
  process.exit(1);
}
```

Run before deployment:
```bash
npm run validate-data
```

---

## 💡 Best Practices

1. **Use Consistent IDs:**
   - Format: `class-10`, `c10-batch-1`
   - Lowercase with hyphens

2. **Keep Roll Numbers Unique:**
   - Never reuse roll numbers across years
   - Format: `MTXYEARXXX`

3. **Update Regularly:**
   - Results: After each exam
   - Schedules: Start of semester
   - Testimonials: Monthly

4. **Backup Before Editing:**
   ```bash
   cp src/data/schedules.json src/data/schedules.backup.json
   ```

5. **Version Control:**
   - Commit after each change
   - Use descriptive messages:
     ```bash
     git commit -m "Update Class 10 fees for Q2 2024"
     ```

---

## 🆘 Common Issues

**Issue:** Build fails after JSON edit

**Solution:** Validate JSON syntax
```bash
cat src/data/file.json | python -m json.tool
```

**Issue:** TypeScript errors

**Solution:** Check field names match `types.ts` interfaces

**Issue:** Data not showing on site

**Solution:** Clear cache and rebuild
```bash
rm -rf .next/
npm run build
```

---

## 📚 Resources

- [JSON.org](https://www.json.org/) - JSON syntax reference
- [JSONLint](https://jsonlint.com/) - Online JSON validator
- [JSON Formatter](https://jsonformatter.org/) - Format and validate

---

**Questions about data structure? Check `src/lib/types.ts` for complete interfaces!**
