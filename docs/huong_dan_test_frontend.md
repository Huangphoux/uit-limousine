# Hướng dẫn Test Frontend - UIT Limousine

## 📋 Mục lục
1. [Test Frontend là gì?](#test-frontend-là-gì)
2. [Công cụ đang dùng](#công-cụ-đang-dùng)
3. [Các loại test](#các-loại-test)
4. [Ví dụ test cho project](#ví-dụ-test-cho-project)
5. [Chạy tests](#chạy-tests)
6. [Checklist test cho các tính năng](#checklist-test-cho-các-tính-năng)

---

## 🤔 Test Frontend là gì?

**Test frontend** = Viết code để kiểm tra code của bạn hoạt động đúng

**Mục đích:**
- ✅ Đảm bảo UI hiển thị đúng
- ✅ User interactions (click, type, submit) hoạt động đúng
- ✅ Component nhận props và render đúng
- ✅ API calls được gọi đúng lúc
- ✅ Error handling hiển thị đúng
- ✅ Tránh bug khi refactor code

---

## 🛠️ Công cụ đang dùng

Project bạn đã setup:

1. **Vitest** - Test runner (giống Jest nhưng nhanh hơn, tích hợp Vite)
2. **React Testing Library** - Test React components
3. **@testing-library/jest-dom** - Matchers để test DOM
4. **@testing-library/user-event** - Simulate user interactions
5. **jsdom** - Mock DOM environment

---

## 📚 Các loại test

### 1. Unit Tests (Test đơn vị)
**Là gì:** Test 1 component/function riêng lẻ

**Ví dụ:**
- Test `CourseCard` component hiển thị đúng title, price, instructor
- Test `useAuth` hook trả về đúng user info
- Test `formatDate` utility function

### 2. Integration Tests (Test tích hợp)
**Là gì:** Test nhiều component làm việc cùng nhau

**Ví dụ:**
- Test form đăng nhập: type username/password → click submit → gọi API → redirect
- Test search courses: type query → click search → hiển thị results

### 3. E2E Tests (End-to-End)
**Là gì:** Test cả flow như user thật (dùng trình duyệt thật)

**Ví dụ:**
- User mở website → đăng nhập → tìm khóa học → đăng ký → xem bài học

---

## 🎯 Ví dụ test cho project

### Test 1: CourseCard Component (Unit Test)

```jsx
// client/src/test/components/CourseCard.test.jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CourseCard from '../../components/CourseCard';

describe('CourseCard', () => {
  const mockCourse = {
    id: '1',
    title: 'React Cơ Bản',
    description: 'Học React từ đầu',
    instructor: 'Nguyễn Văn A',
    price: 500000,
    thumbnail: '/images/react.jpg'
  };

  it('renders course title', () => {
    render(
      <BrowserRouter>
        <CourseCard course={mockCourse} />
      </BrowserRouter>
    );
    
    expect(screen.getByText('React Cơ Bản')).toBeInTheDocument();
  });

  it('renders course instructor', () => {
    render(
      <BrowserRouter>
        <CourseCard course={mockCourse} />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/Nguyễn Văn A/i)).toBeInTheDocument();
  });

  it('renders course price formatted', () => {
    render(
      <BrowserRouter>
        <CourseCard course={mockCourse} />
      </BrowserRouter>
    );
    
    // Kiểm tra price được format đúng
    expect(screen.getByText(/500,000/)).toBeInTheDocument();
  });
});
```

### Test 2: Login Form (Integration Test)

```jsx
// client/src/test/pages/LoginPage.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../../pages/auth/LoginPage';

// Mock fetch API
global.fetch = vi.fn();

describe('LoginPage', () => {
  it('submits login form with correct credentials', async () => {
    // Mock API response thành công
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: { token: 'fake-token', user: { id: '1', email: 'test@test.com' } }
      })
    });

    const user = userEvent.setup();
    
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    // User type vào form
    await user.type(screen.getByLabelText(/email/i), 'test@test.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    
    // User click submit
    await user.click(screen.getByRole('button', { name: /đăng nhập/i }));

    // Kiểm tra API được gọi đúng
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            email: 'test@test.com',
            password: 'password123'
          })
        })
      );
    });
  });

  it('shows error message with wrong credentials', async () => {
    // Mock API response lỗi
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        success: false,
        error: 'Email hoặc mật khẩu không đúng'
      })
    });

    const user = userEvent.setup();
    
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    await user.type(screen.getByLabelText(/email/i), 'wrong@test.com');
    await user.type(screen.getByLabelText(/password/i), 'wrongpass');
    await user.click(screen.getByRole('button', { name: /đăng nhập/i }));

    // Kiểm tra error message hiển thị
    await waitFor(() => {
      expect(screen.getByText(/Email hoặc mật khẩu không đúng/i)).toBeInTheDocument();
    });
  });
});
```

### Test 3: Custom Hook (Unit Test)

```jsx
// client/src/test/hooks/useAuth.test.jsx
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import useAuth from '../../hooks/useAuth';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

describe('useAuth', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  it('initializes with user from localStorage', () => {
    const mockUser = { id: '1', email: 'test@test.com' };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUser));

    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('returns null when no user in localStorage', () => {
    localStorageMock.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
});
```

### Test 4: Search Functionality (Integration Test)

```jsx
// client/src/test/components/SearchBar.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '../../components/SearchBar';

describe('SearchBar', () => {
  it('calls onSearch after user types and waits', async () => {
    const mockOnSearch = vi.fn();
    const user = userEvent.setup();

    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText(/tìm kiếm/i);
    
    // User type từ từ
    await user.type(input, 'React');

    // Đợi debounce (nếu có)
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('React');
    }, { timeout: 1000 });
  });

  it('shows clear button when input has value', async () => {
    const user = userEvent.setup();

    render(<SearchBar onSearch={vi.fn()} />);

    const input = screen.getByPlaceholderText(/tìm kiếm/i);
    
    await user.type(input, 'React');

    // Nút clear xuất hiện
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
  });
});
```

---

## 🚀 Chạy tests

### Chạy tất cả tests
```bash
cd client
npm test
```

### Chạy tests và watch mode (tự động chạy lại khi code thay đổi)
```bash
npm run test:watch
```

### Chạy test cho 1 file cụ thể
```bash
npm test -- CourseCard.test.jsx
```

### Xem coverage (% code được test)
```bash
npm test -- --coverage
```

---

## ✅ Checklist test cho các tính năng

### Authentication
- [ ] Login form validation (email format, password length)
- [ ] Login success → save token → redirect
- [ ] Login fail → show error message
- [ ] Register form validation
- [ ] Register success → show success message
- [ ] Logout → clear token → redirect to home

### Courses
- [ ] Course list displays correctly
- [ ] Search courses works
- [ ] Filter courses by category
- [ ] Course detail modal shows correct info
- [ ] Enroll button works
- [ ] Only enrolled users see course materials

### Instructor
- [ ] Apply instructor form validation
- [ ] Upload CV/credentials works
- [ ] Application status displays correctly
- [ ] Create course form validation
- [ ] Edit course works

### Admin
- [ ] User list displays
- [ ] Change user role works
- [ ] Approve/reject instructor applications
- [ ] Delete user works

### Notifications
- [ ] Notification badge shows unread count
- [ ] Mark as read works
- [ ] Delete notification works
- [ ] Real-time notifications update

---

## 🎓 Best Practices

### 1. Test User Behavior, Not Implementation
```jsx
// ❌ BAD - Test implementation details
expect(wrapper.state('isOpen')).toBe(true);

// ✅ GOOD - Test what user sees
expect(screen.getByText('Modal is open')).toBeInTheDocument();
```

### 2. Use Semantic Queries
```jsx
// Priority order:
// 1. getByRole - Most accessible
screen.getByRole('button', { name: /submit/i })

// 2. getByLabelText - Forms
screen.getByLabelText(/email/i)

// 3. getByText - Non-interactive content
screen.getByText(/welcome/i)

// 4. getByTestId - Last resort (thêm data-testid="...")
screen.getByTestId('custom-element')
```

### 3. Test Accessibility
```jsx
it('form is accessible', () => {
  render(<LoginForm />);
  
  // Labels phải liên kết với inputs
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  
  // Buttons phải có accessible name
  expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
});
```

### 4. Mock External Dependencies
```jsx
// Mock API calls
global.fetch = vi.fn();

// Mock localStorage
global.localStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
};

// Mock React Router
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));
```

---

## 🐛 Common Issues

### Issue 1: "Cannot find module 'react-icons'"
```bash
npm install react-icons
```

### Issue 2: Router tests fail
```jsx
// Wrap component trong BrowserRouter
render(
  <BrowserRouter>
    <YourComponent />
  </BrowserRouter>
);
```

### Issue 3: Async tests timeout
```jsx
// Tăng timeout
await waitFor(() => {
  expect(something).toBeTruthy();
}, { timeout: 5000 });
```

---

## 📊 Coverage Goals

**Minimum coverage targets:**
- **Statements:** 80%
- **Branches:** 75%
- **Functions:** 80%
- **Lines:** 80%

**Priority để test:**
1. Authentication flows (Critical)
2. Payment/enrollment flows (Critical)
3. Form validations (High)
4. Core components (High)
5. Utility functions (Medium)
6. UI animations (Low)

---

## 🎯 Next Steps

1. **Bắt đầu với component đơn giản:** Test `CourseCard` trước
2. **Sau đó test forms:** Login, Register
3. **Test user flows:** Enroll course, Complete lesson
4. **Thêm coverage report:** Xem phần nào chưa test
5. **Setup CI/CD:** Auto run tests khi push code

---

## 📚 Tài liệu tham khảo

- [Vitest Docs](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Testing Best Practices](https://testingjavascript.com/)
