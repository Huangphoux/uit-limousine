# REST Client Testing Quick Guide

## 🚀 Getting Started (2 Minutes)

### Step 1: Install Extension
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for **"REST Client"** by Humao
4. Click **Install**

### Step 2: Open Test File
```
server/api-tests.http
```

### Step 3: Start Server
```powershell
cd server
npm run dev
```
✅ You should see: "Listening to http://localhost:3000"

### Step 4: Send Your First Request
1. Scroll to "1.1 Register New User"
2. Click **"Send Request"** that appears above the POST line
3. Response opens in new tab on the right
4. Look for: `HTTP/1.1 201 Created` and `"success": true`

**That's it! You're testing!** 🎉

---

## 📋 Complete Testing Workflow

### 1️⃣ Register a User
```http
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "test123",
  "name": "Test User"
}
```
**✅ Success:** Status 201, returns `accessToken`
**📝 Action:** Copy the token from response

### 2️⃣ Update Token Variable
Go to top of file and paste:
```http
@accessToken = eyJhbGci...paste_here
```

### 3️⃣ Search Courses
```http
GET http://localhost:3000/courses
Authorization: Bearer {{accessToken}}
```
**✅ Success:** Status 200, returns array of courses
**📝 Action:** Copy a `course.id` from response

### 4️⃣ Update Course ID Variable
```http
@courseId = paste_course_id_here
```

### 5️⃣ Enroll in Course
```http
POST http://localhost:3000/courses/{{courseId}}/enroll
Authorization: Bearer {{accessToken}}
```
**✅ Success:** Status 201, enrollment created

### 6️⃣ Get Course Materials
```http
GET http://localhost:3000/courses/{{courseId}}/materials
Authorization: Bearer {{accessToken}}
```
**✅ Success:** Status 200, returns modules and lessons
**📝 Action:** Copy a `lesson.id` from response

### 7️⃣ Update Lesson ID Variable
```http
@lessonId = paste_lesson_id_here
```

### 8️⃣ Complete Lesson
```http
POST http://localhost:3000/lessons/{{lessonId}}/complete
Authorization: Bearer {{accessToken}}
```
**✅ Success:** Status 200, lesson marked complete

---

## 🎯 What Each File Does

| File | Purpose |
|------|---------|
| `api-tests.http` | **Main test file** - All endpoints organized |
| `api-requests.http` | Simple version with basic examples |
| `postman-collection.json` | For Postman users |

**Use `api-tests.http` - it's the most comprehensive!**

---

## ✅ How to Know It Worked

### Look for 3 Things:

#### 1. Status Code (Top of Response)
```
HTTP/1.1 200 OK  ← ✅ Success!
```

#### 2. Success Field in JSON
```json
{
  "success": true,  ← ✅ It worked!
  "data": { ... }
}
```

#### 3. No Errors in Server Console
```
POST /auth/register - 201 Created  ← ✅ Good!
```

---

## 📝 Variables You Need to Update

The file has these variables at the top:
```http
@baseUrl = http://localhost:3000           # ← Already correct
@accessToken = YOUR_TOKEN_HERE             # ← Update after login
@courseId = YOUR_COURSE_ID                 # ← Update after search
@lessonId = YOUR_LESSON_ID                 # ← Update after materials
```

**When to update each:**
- `@accessToken` - After Register or Login
- `@courseId` - After Search Courses
- `@lessonId` - After Get Course Materials

---

## 🐛 Common Issues & Fixes

### Issue: "Connection refused"
**Problem:** Server not running
**Fix:**
```powershell
cd server
npm run dev
```

### Issue: "401 Unauthorized"
**Problem:** Token missing or expired
**Fix:** 
1. Run the Login request again
2. Copy new `accessToken`
3. Update `@accessToken` variable at top of file

### Issue: Empty courses array `[]`
**Problem:** No data in database
**Fix:**
```powershell
cd server
npm run seed
```

### Issue: "404 Not Found"
**Problem:** Wrong ID in variable
**Fix:** 
1. Check the ID you copied
2. Make sure no extra spaces
3. Verify it exists in database

---

## 🎨 REST Client Features

### Multiple Requests on Same Line
```http
### Test multiple users
POST {{baseUrl}}/auth/register
###  ← This separates requests
POST {{baseUrl}}/auth/register
```

### Comments
```http
### This is a section header
# This is a comment
// This also works
```

### Environment Switching
You can create `.env.development`, `.env.production` files and switch between them.

### Response Saving
Click "Save Response" in response tab to save for later comparison.

---

## 📚 Test File Sections

The `api-tests.http` file is organized into sections:

1. **Authentication** - Register, Login, Logout
2. **Courses** - Search, Get details
3. **Enrollment** - Enroll in courses
4. **Course Materials** - Get modules & lessons
5. **Lessons & Progress** - Complete lessons
6. **Error Testing** - Test edge cases
7. **Testing Workflow** - Complete sequence
8. **Quick Debugging** - Health checks

---

## 💡 Pro Tips

### Tip 1: Use Request Names
```http
### @name register
POST {{baseUrl}}/auth/register
```
Then reference it: `{{register.response.body.data.accessToken}}`

### Tip 2: Keep Server Terminal Visible
Watch requests in real-time:
```
POST /auth/register - 201 Created
GET /courses - 200 OK
```

### Tip 3: Test Error Cases
The file includes error tests:
- Wrong password
- Duplicate email
- Missing token
- Invalid IDs

### Tip 4: Use Keyboard Shortcuts
- `Ctrl+Alt+R` - Send request
- `Ctrl+Alt+E` - Switch environment

---

## 🔍 Example: Complete Test Session

```
1. Open api-tests.http
2. Click "Send Request" on Register (Section 1.1)
3. Copy accessToken from response
4. Paste in @accessToken variable at top
5. Click "Send Request" on Search Courses (Section 2.1)
6. Copy a course id from response
7. Paste in @courseId variable at top
8. Click "Send Request" on Enroll (Section 3.1)
9. Click "Send Request" on Get Materials (Section 4.1)
10. Copy a lesson id from response
11. Paste in @lessonId variable at top
12. Click "Send Request" on Complete Lesson (Section 5.1)
13. Done! ✅
```

**Total time: ~2 minutes**

---

## 📊 Expected Response Examples

### ✅ Successful Register
```http
HTTP/1.1 201 Created

{
  "success": true,
  "data": {
    "accessToken": "eyJhbGci...",
    "user": {
      "id": "uuid",
      "email": "test@example.com",
      "name": "Test User",
      "role": "LEARNER"
    }
  }
}
```

### ✅ Successful Course Search
```http
HTTP/1.1 200 OK

{
  "success": true,
  "data": {
    "courses": [
      {
        "id": "course-uuid",
        "title": "Introduction to Node.js",
        "description": "Learn Node.js...",
        "price": 500000
      }
    ],
    "total": 10,
    "page": 1
  }
}
```

### ❌ Error Response
```http
HTTP/1.1 401 Unauthorized

{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid credentials"
  }
}
```

---

## 🆘 Need Help?

**Documentation:**
- Full guide: `HOW_TO_VERIFY_SUCCESS.md`
- Quick start: `QUICK_START.md`
- API design: `../docs/api_design.typ`

**Check Server Status:**
```powershell
# Is it running?
curl http://localhost:3000

# Check logs
cd server
npm run dev  # Watch the console output
```

**Reset Database:**
```powershell
cd server
npx prisma migrate reset  # Warning: Deletes all data!
npm run seed  # Add sample data
```

---

## ✨ You're All Set!

Open `api-tests.http` and start clicking "Send Request"! 🚀

Every endpoint is documented with:
- ✅ Expected response
- 📝 What to do next
- ❌ Common errors
- 🔧 How to fix issues

Happy testing! 🎉
