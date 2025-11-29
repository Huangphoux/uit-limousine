import requests
import json
from datetime import datetime

# Configuration
BASE_URL = "http://localhost:3000"
token = ""
user_id = ""
course_id = ""

# Test results
results = []

def test_api(name, method, endpoint, data=None, headers=None, expected_status=200):
    """Test một API endpoint và lưu kết quả"""
    url = f"{BASE_URL}{endpoint}"
    
    try:
        if method == "GET":
            response = requests.get(url, headers=headers, timeout=5)
        elif method == "POST":
            response = requests.post(url, json=data, headers=headers, timeout=5)
        elif method == "PUT":
            response = requests.put(url, json=data, headers=headers, timeout=5)
        elif method == "DELETE":
            response = requests.delete(url, headers=headers, timeout=5)
        
        status_code = response.status_code
        success = status_code == expected_status
        
        result = {
            "name": name,
            "method": method,
            "endpoint": endpoint,
            "status_code": status_code,
            "expected": expected_status,
            "success": success,
            "response": response.text[:200] if response.text else "",
            "error": None
        }
        
    except Exception as e:
        result = {
            "name": name,
            "method": method,
            "endpoint": endpoint,
            "status_code": None,
            "expected": expected_status,
            "success": False,
            "response": "",
            "error": str(e)
        }
    
    results.append(result)
    return result

# Test Authentication APIs
print("Testing Authentication APIs...")
test_api("Register - Valid", "POST", "/auth/register", {
    "email": f"test_{datetime.now().timestamp()}@test.com",
    "password": "password123",
    "name": "Test User"
}, expected_status=201)

test_api("Register - Duplicate Email", "POST", "/auth/register", {
    "email": "admin@test.com",
    "password": "password123",
    "name": "Duplicate"
}, expected_status=400)

test_api("Register - Missing Fields", "POST", "/auth/register", {
    "email": "test@test.com"
}, expected_status=400)

login_result = test_api("Login - Valid Credentials", "POST", "/auth/login", {
    "email": "admin@test.com",
    "password": "admin123"
})

# Extract token if login successful
if login_result["success"]:
    try:
        response_data = json.loads(login_result["response"])
        if "data" in response_data and "token" in response_data["data"]:
            token = response_data["data"]["token"]
            print(f"✓ Got token: {token[:20]}...")
    except:
        pass

test_api("Login - Invalid Password", "POST", "/auth/login", {
    "email": "admin@test.com",
    "password": "wrongpassword"
}, expected_status=401)

# Test Course APIs
print("\nTesting Course APIs...")
courses_result = test_api("Search Courses - Public", "GET", "/courses")

if courses_result["success"]:
    try:
        response_data = json.loads(courses_result["response"])
        if "data" in response_data and len(response_data["data"]) > 0:
            course_id = response_data["data"][0].get("id", "")
            print(f"✓ Got course_id: {course_id}")
    except:
        pass

test_api("Search Courses - With Filters", "GET", "/courses?search=python&page=1&limit=5")

if course_id:
    test_api("Get Course by ID", "GET", f"/courses/{course_id}")
    
    if token:
        headers = {"Authorization": f"Bearer {token}"}
        test_api("Enroll in Course - Authenticated", "POST", f"/courses/{course_id}/enroll", headers=headers)
        test_api("Get Course Materials - Authenticated", "GET", f"/courses/{course_id}/materials", headers=headers)

test_api("Enroll without Auth", "POST", "/courses/test-id/enroll", expected_status=401)

# Test Instructor Application APIs
print("\nTesting Instructor Application APIs...")
if token:
    headers = {"Authorization": f"Bearer {token}"}
    
    test_api("Apply as Instructor", "POST", "/instructor/apply", {
        "requestedCourseTitle": "Test Course",
        "requestedCourseSummary": "Test summary",
        "portfolioUrl": "https://github.com/test"
    }, headers=headers)
    
    test_api("Get All Applications", "GET", "/instructor/applications", headers=headers)

# Test Admin APIs  
print("\nTesting Admin APIs...")
if token:
    headers = {"Authorization": f"Bearer {token}"}
    
    test_api("Get All Users - Admin", "GET", "/admin/users", headers=headers)
    test_api("Create Course - Admin", "POST", "/admin/courses", {
        "title": "Test Admin Course",
        "slug": f"test-course-{datetime.now().timestamp()}",
        "shortDesc": "Test description",
        "description": "Full description",
        "category": "Programming",
        "level": "beginner",
        "price": 0,
        "instructorId": user_id if user_id else None
    }, headers=headers)

# Test Notification APIs
print("\nTesting Notification APIs...")
if token:
    headers = {"Authorization": f"Bearer {token}"}
    
    test_api("Get User Notifications", "GET", "/notifications", headers=headers)
    test_api("Get Unread Count", "GET", "/notifications/unread-count", headers=headers)

# Print Summary
print("\n" + "="*80)
print("TEST SUMMARY")
print("="*80)

total = len(results)
passed = sum(1 for r in results if r["success"])
failed = total - passed

print(f"\nTotal Tests: {total}")
print(f"Passed: {passed} ✓")
print(f"Failed: {failed} ✗")
print(f"Success Rate: {(passed/total*100):.1f}%")

print("\n" + "="*80)
print("FAILED TESTS:")
print("="*80)

for result in results:
    if not result["success"]:
        print(f"\n✗ {result['name']}")
        print(f"  Method: {result['method']}")
        print(f"  Endpoint: {result['endpoint']}")
        print(f"  Expected: {result['expected']}, Got: {result['status_code']}")
        if result['error']:
            print(f"  Error: {result['error']}")
        else:
            print(f"  Response: {result['response'][:100]}")

# Save to JSON
with open("api-test-results.json", "w", encoding="utf-8") as f:
    json.dump({
        "timestamp": datetime.now().isoformat(),
        "base_url": BASE_URL,
        "summary": {
            "total": total,
            "passed": passed,
            "failed": failed,
            "success_rate": f"{(passed/total*100):.1f}%"
        },
        "results": results
    }, f, indent=2, ensure_ascii=False)

print("\n✓ Results saved to api-test-results.json")
