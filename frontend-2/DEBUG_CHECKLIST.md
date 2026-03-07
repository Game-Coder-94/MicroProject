# Backend Integration Debug Checklist

## Quick Test Steps

1. **Start Backend Server**
   ```bash
   # Your backend should be running on:
   http://localhost:8000
   ```

2. **Open Browser Console** (F12)
   - You'll see detailed logs of the entire process

3. **Upload Files & Submit**
   - Select scores.csv
   - Select credits.csv
   - (Optional) Enter SIGP value
   - Click "Calculate Grades"

4. **Check Console Logs**
   You should see:
   ```
   ✓ Uploading files: { scoresFile: 'scores.csv', creditsFile: 'credits.csv', sigp: '...' }
   ✓ Sending POST request to http://localhost:8000/grades
   ✓ Received response from backend: { success: true, results: [...] }
   ✓ Successfully processed data for X student(s)
   ✓ Mapping results to aggregates. Input: [...]
   ✓ Found X unique courses: [...]
   ✓ Aggregated data: { courses: [...], classByWeight: [...], ... }
   ```

## Expected Data Flow

### Frontend → Backend
```
POST http://localhost:8000/grades

FormData:
├── csvMarksFile: File
├── csvCreditsFile: File
└── sigp: "0.5" (optional)
```

### Backend → Frontend
```json
{
  "success": true,
  "results": [
    {
      "name": "Student 1",
      "courseCredits": {
        "Math 101": 3,
        "Physics 201": 4
      },
      "courseGrades": {
        "Math 101": "A",
        "Physics 201": "B+"
      },
      "courseZScores": {
        "Math 101": 0.5
      },
      "avgZScore": 0.3,
      "summary": {
        "sgpa": "8.5",
        "total_credits": 7,
        "sigp_added": 0.5
      },
      "individual_grades": []
    }
  ]
}
```

### Frontend Processes & Displays
```
Dashboard Components:
├── GPAOverview → Shows semesterGPA, totalCredits, totalGpaPoints
├── SemesterOverview → Shows totalClasses, totalCredits, avgGpaPoints
├── ClassesTable → Lists all courses with credits, avg grade, grade points
├── ClassByWeightChart → Donut chart of credit distribution
└── GradeOverviewChart → Bar chart of grade distribution (A+, A, B+, etc.)
```

## Common Issues & Solutions

### ❌ "Cannot connect to backend server"
**Solution:**
- Check if backend is running: `curl http://localhost:8000/grades`
- Verify backend port is 8000
- Check for firewall blocking localhost

### ❌ CORS Error
**Solution:** Add CORS headers to backend:
```python
# Flask
from flask_cors import CORS
CORS(app)
```

### ❌ "Invalid response format"
**Solution:** Ensure backend returns:
- `success: true` (boolean)
- `results: [...]` (array)
- Each result has: `courseGrades`, `courseCredits`, `summary`

### ❌ Empty Dashboard After Upload
**Check:**
1. Console logs for errors
2. Backend returned valid `results` array
3. Each student has at least one course grade
4. Response structure matches expected format

## Response Validation Rules

The frontend validates:
1. ✓ `response.ok` is true (status 200-299)
2. ✓ `data.success === true`
3. ✓ `data.results` is an array
4. ✓ `data.results.length > 0`

If any fail, you'll see detailed error in console and UI.

## Testing With Mock Data

You can test the data mapper directly in console:
```javascript
// Open browser console on the app page
const mockResults = [{
  name: "Test Student",
  courseCredits: { "Test Course": 3 },
  courseGrades: { "Test Course": "A" },
  summary: { sgpa: "9.0", total_credits: 3 }
}];

// This function is exposed on window in dev mode
// Results should show aggregated data structure
```

## Performance Expectations

- **File Upload**: < 1 second
- **Backend Processing**: 1-3 seconds (depends on data size)
- **Frontend Rendering**: < 500ms
- **Total Time**: 2-5 seconds

If longer, check:
- CSV file size (should be < 1MB)
- Backend performance logs
- Network latency

## Network Tab Inspection

In DevTools → Network:
1. Look for POST to `http://localhost:8000/grades`
2. Check Request Payload (should show FormData)
3. Check Response (should be JSON with results)
4. Status should be 200 OK

## Success Indicators

✅ UI shows: "✓ Successfully loaded data for X student(s)"
✅ Cards display GPA values
✅ Table shows all courses
✅ Charts render with data
✅ No errors in console
✅ No red error boxes in UI
