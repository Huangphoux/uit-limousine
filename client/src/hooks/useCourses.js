import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === "true" || !API_URL;

// Custom hook for managing course data
export const useCourses = (initialCourses = []) => {
  const [courses, setCourses] = useState(initialCourses);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch courses from API (UC-4.1)
  const fetchCourses = async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      // Build query string from params
      const queryParams = new URLSearchParams();
      if (params.search) queryParams.append("search", params.search);
      if (params.category) queryParams.append("category", params.category);
      if (params.page) queryParams.append("page", params.page);
      if (params.limit) queryParams.append("limit", params.limit);
      // If requesting instructor's courses, include instructorId
      try {
        const userStr = localStorage.getItem("user");
        if (userStr && params.onlyMyCourses) {
          const user = JSON.parse(userStr);
          if (user && user.id) queryParams.append("instructorId", user.id);
        }
      } catch (e) {
        // ignore parsing errors
        console.log(e);
      }

      const queryString = queryParams.toString();
      const url = `${API_URL}/courses${queryString ? `?${queryString}` : ""}`;

      // Get token if available (optional for guests)
      const token = localStorage.getItem("accessToken");
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message || `Failed to fetch courses: ${response.statusText}`
        );
      }

      const data = await response.json();

      console.log("API Response:", data);

      // Handle API response format - backend returns 'status' instead of 'success'
      const isSuccess = data.success === true || data.status === "success";

      if (isSuccess && data.data) {
        const coursesArray = data.data.courses || [];
        console.log("Courses fetched:", coursesArray.length, coursesArray);
        setCourses(coursesArray);
        return {
          success: true,
          courses: coursesArray,
          pagination: data.data.pagination,
        };
      } else {
        console.error("Response validation failed:", {
          status: data.status,
          success: data.success,
          hasData: !!data.data,
          fullResponse: data,
        });
        throw new Error("Invalid response format");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching courses:", err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Enroll in a course
  const enrollInCourse = async (courseId) => {
    // If using mock data, just update local state (for demo/development)
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Update local state
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.id === courseId ? { ...course, enrolled: true } : course
        )
      );
      return { success: true };
    }

    // Real API call
    try {
      const response = await fetch(`${API_URL}/api/courses/${courseId}/enroll`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to enroll: ${response.statusText}`);
      }

      // Update local state
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.id === courseId ? { ...course, enrolled: true } : course
        )
      );

      return { success: true };
    } catch (err) {
      console.error("Error enrolling in course:", err);
      return { success: false, error: err.message };
    }
  };

  // Unsubscribe from a course
  const unsubscribeFromCourse = async (courseId) => {
    // If using mock data, just update local state (for demo/development)
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Update local state
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.id === courseId ? { ...course, enrolled: false } : course
        )
      );
      return { success: true };
    }

    // Real API call
    try {
      const response = await fetch(`${API_URL}/api/courses/${courseId}/unsubscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to unsubscribe: ${response.statusText}`);
      }

      // Update local state
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.id === courseId ? { ...course, enrolled: false } : course
        )
      );

      return { success: true };
    } catch (err) {
      console.error("Error unsubscribing from course:", err);
      return { success: false, error: err.message };
    }
  };

  // Search/filter courses
  const searchCourses = (searchTerm, coursesToSearch = courses) => {
    if (!searchTerm.trim()) {
      return coursesToSearch;
    }

    return coursesToSearch.filter(
      (course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Filter by category
  const filterByCategory = (category, coursesToFilter = courses) => {
    if (!category) {
      return coursesToFilter;
    }
    return coursesToFilter.filter(
      (course) => course.category.toLowerCase() === category.toLowerCase()
    );
  };

  // Filter by level
  const filterByLevel = (level, coursesToFilter = courses) => {
    if (!level) {
      return coursesToFilter;
    }
    return coursesToFilter.filter((course) => course.level.toLowerCase() === level.toLowerCase());
  };

  // Get enrolled courses
  const getEnrolledCourses = () => {
    return courses.filter((course) => course.enrolled);
  };

  // Get course by ID
  const getCourseById = (courseId) => {
    return courses.find((course) => course.id === courseId);
  };

  return {
    courses,
    loading,
    error,
    fetchCourses,
    enrollInCourse,
    unsubscribeFromCourse,
    searchCourses,
    filterByCategory,
    filterByLevel,
    getEnrolledCourses,
    getCourseById,
    setCourses, // For manual updates if needed
  };
};

// Default course data for development/testing
export const defaultCourses = [
  {
    id: 1,
    title: "Machine Learning Fundamentals",
    provider: "Stanford University",
    category: "AI & Machine Learning",
    description: "Full courses about machine learning from A to Z",
    rating: 4.9,
    students: 10000,
    level: "Intermediate",
    duration: "3 months",
    image: "https://via.placeholder.com/300x200/007bff/ffffff?text=AI+ML",
    enrolled: false,
    price: 299,
    isPaid: false,
  },
  {
    id: 2,
    title: "Python For Everyone",
    provider: "University of Michigan",
    category: "Coding",
    description: "Python courses for beginner",
    rating: 4.7,
    students: 2322,
    level: "Beginner",
    duration: "2 months",
    image: "https://via.placeholder.com/300x200/28a745/ffffff?text=Python",
    enrolled: false,
    price: 0,
    isPaid: true,
  },
  {
    id: 3,
    title: "Data Science Professional Certificate",
    provider: "IBM",
    category: "Data Science",
    description: "Professional training program with modern technology",
    rating: 4.8,
    students: 5690,
    level: "Intermediate",
    duration: "4 months",
    image: "https://via.placeholder.com/300x200/17a2b8/ffffff?text=Data+Science",
    enrolled: true,
    price: 399,
    isPaid: true,
  },
  {
    id: 4,
    title: "Digital Marketing Strategy",
    provider: "Google Digital Academy",
    category: "Marketing",
    description: "Learn comprehensive digital marketing strategies",
    rating: 4.6,
    students: 8500,
    level: "Beginner",
    duration: "6 weeks",
    image: "https://via.placeholder.com/300x200/fd7e14/ffffff?text=Marketing",
    enrolled: false,
    price: 149,
    isPaid: true,
  },
  {
    id: 5,
    title: "UI/UX Design Bootcamp",
    provider: "Design Institute",
    category: "Design",
    description: "Complete guide to user interface and user experience design",
    rating: 4.7,
    students: 3200,
    level: "Intermediate",
    duration: "5 months",
    image: "https://via.placeholder.com/300x200/6f42c1/ffffff?text=UI%2FUX",
    enrolled: false,
    price: 249,
    isPaid: false,
  },
  {
    id: 6,
    title: "Full Stack Web Development",
    provider: "Tech Academy",
    category: "Web Development",
    description: "Learn frontend and backend development",
    rating: 4.8,
    students: 12000,
    level: "Advanced",
    duration: "8 months",
    image: "https://via.placeholder.com/300x200/dc3545/ffffff?text=Full+Stack",
    enrolled: false,
    price: 499,
    isPaid: false,
  },
  {
    id: 7,
    title: "Full Stack Web Development 2",
    provider: "Tech Academy",
    category: "Web Development",
    description: "Learn frontend and backend development",
    rating: 4.8,
    students: 12000,
    level: "Advanced",
    duration: "8 months",
    image: "https://via.placeholder.com/300x200/dc3545/ffffff?text=Full+Stack",
    enrolled: true,
    price: 0,
    isPaid: true,
  },
];
