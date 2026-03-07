# Backend Integration Guide

## Overview
Your GPA Calculator & Tracker frontend is now fully connected to the backend server and ready to fetch real data.

## How It Works

### 1. Data Upload Flow
```
User uploads CSV files + SIGP
    ↓
UploadPanel component collects files
    ↓
Dashboard.handleUpload() receives FormData
    ↓
api.postGrades() sends POST to http://localhost:8000/grades
    ↓
Backend processes and returns JSON
    ↓
dataMappers.mapResultsToAggregates() transforms data
    ↓
Dashboard displays results in cards, tables, and charts
```

### 2. Backend Endpoint
- **URL**: `http://localhost:8000/grades`
- **Method**: POST
- **Content-Type**: multipart/form-data

### 3. Request Format
The frontend sends:
```javascript
FormData {
  csvMarksFile: File (scores.csv),
  csvCreditsFile: File (credits.csv),
  sigp: string (optional)
}
```

### 4. Expected Response Format
```json
{
  "success": true,
  "results": [
    {
      "name": "Student Name",
      "courseCredits": { "Course 1": 3, "Course 2": 4 },
      "courseGrades": { "Course 1": "A", "Course 2": "B+" },
      "courseZScores": { "Course 1": 0.5 },
      "avgZScore": 0.3,
      "summary": {
        "sgpa": "8.5",
        "total_credits": 12,
        "sigp_added": 3
      },
      "individual_grades": []
    }
  ],
  "sgpa": [...]
}
```

### 5. Data Aggregation
The frontend automatically:
- Extracts all unique courses from all students
- Calculates average grade points per course
- Computes total GPA points and semester GPA
- Generates grade distribution for charts
- Creates class weight distribution for donut chart

## Features

✅ **Real-time Backend Connection**
- POSTs CSV files and SIGP to your backend
- Displays loading states during processing
- Shows error messages if backend is unavailable

✅ **Comprehensive Error Handling**
- Network errors (backend not running)
- Server errors (4xx, 5xx responses)
- Invalid response format validation
- User-friendly error messages

✅ **Visual Feedback**
- Loading spinner during data processing
- Success message with student count
- Error alerts with helpful troubleshooting tips

✅ **Console Logging**
- Request/response logging for debugging
- Data transformation logs
- Error stack traces

## Testing

### Start Your Backend Server
```bash
# Make sure your backend is running on port 8000
python backend.py  # or your backend start command
```

### Upload Test Files
1. Click "Choose File" for scores.csv
2. Click "Choose File" for credits.csv
3. (Optional) Enter SIGP value
4. Click "Calculate Grades"

### Expected Behavior
1. Loading spinner appears
2. Backend processes request
3. Success message shows: "✓ Successfully loaded data for X student(s)"
4. Dashboard displays:
   - GPA Overview card
   - Semester Overview card
   - Classes table with all courses
   - Class weight distribution (donut chart)
   - Grade overview (bar chart)

## Troubleshooting

### "Cannot connect to backend server"
- Ensure backend is running on http://localhost:8000
- Check CORS settings on backend
- Verify firewall/network settings

### "Server error (500)"
- Check backend logs for errors
- Verify CSV file format matches backend expectations
- Ensure all required fields are present

### "Invalid response format"
- Verify backend returns `success: true`
- Ensure `results` array exists in response
- Check response structure matches expected format

## CORS Configuration
If you encounter CORS errors, ensure your backend includes:

```python
# Python/Flask example
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
```

```javascript
// Node.js/Express example
const cors = require('cors');
app.use(cors());
```

## Sample Data Files
Test CSV files are included in the project root:
- `sample-scores.csv`
- `sample-credits.csv`

You can use these to test the backend integration.
