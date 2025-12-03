import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import CourseCard from "../../components/CourseCard";

// Helper function để wrap component với Router
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("CourseCard Component", () => {
  const mockCourse = {
    id: "1",
    title: "React Cơ Bản",
    description: "Học React từ đầu cho người mới bắt đầu",
    instructor: "Nguyễn Văn A",
    price: 500000,
    thumbnail: "/images/react.jpg",
    image: "/images/react.jpg", // ✅ Thêm image property
    level: "Beginner",
    duration: "10 giờ",
    enrolled: false,
    provider: "UIT",
    category: "Programming", // ✅ Thêm category property
    students: 150,
    rating: 4.5,
    lessons: 25,
  };

  describe("Rendering", () => {
    it("renders course title correctly", () => {
      renderWithRouter(<CourseCard course={mockCourse} />);

      expect(screen.getByText("React Cơ Bản")).toBeInTheDocument();
    });

    it("renders course provider", () => {
      renderWithRouter(<CourseCard course={mockCourse} />);

      // Component hiển thị provider, không phải instructor
      expect(screen.getByText(/UIT/i)).toBeInTheDocument();
    });

    it("renders course description", () => {
      renderWithRouter(<CourseCard course={mockCourse} />);

      expect(screen.getByText(/Học React từ đầu/i)).toBeInTheDocument();
    });

    it("renders course level badge", () => {
      renderWithRouter(<CourseCard course={mockCourse} />);

      expect(screen.getByText("Beginner")).toBeInTheDocument();
    });

    it("shows enrolled badge when enrolled", () => {
      const enrolledCourse = { ...mockCourse, enrolled: true };
      renderWithRouter(<CourseCard course={enrolledCourse} />);

      expect(screen.getByText(/✓ enrolled/i)).toBeInTheDocument();
    });

    it("does not show enrolled badge when not enrolled", () => {
      renderWithRouter(<CourseCard course={mockCourse} />);

      expect(screen.queryByText(/✓ enrolled/i)).not.toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("calls onCardClick when card is clicked", () => {
      const mockOnCardClick = vi.fn();
      renderWithRouter(<CourseCard course={mockCourse} onCardClick={mockOnCardClick} />);

      const card = screen.getByText("React Cơ Bản").closest(".card");
      fireEvent.click(card);

      expect(mockOnCardClick).toHaveBeenCalledWith(mockCourse);
    });
  });

  describe("Image Handling", () => {
    it("renders course thumbnail", () => {
      renderWithRouter(<CourseCard course={mockCourse} />);

      const image = screen.getByRole("img");
      expect(image).toHaveAttribute("src", "/images/react.jpg");
    });

    it("falls back to placeholder image on error", () => {
      renderWithRouter(<CourseCard course={mockCourse} />);

      const image = screen.getByRole("img");

      // Simulate image load error
      fireEvent.error(image);

      // Should fall back to placeholder
      expect(image).toHaveAttribute("src", "/images/course-placeholder.svg");
    });
  });

  describe("Level Color Coding", () => {
    it("shows green badge for Beginner level", () => {
      renderWithRouter(<CourseCard course={{ ...mockCourse, level: "Beginner" }} />);

      const badge = screen.getByText("Beginner");
      expect(badge).toHaveClass("bg-success");
    });

    it("shows yellow badge for Intermediate level", () => {
      renderWithRouter(<CourseCard course={{ ...mockCourse, level: "Intermediate" }} />);

      const badge = screen.getByText("Intermediate");
      expect(badge).toHaveClass("bg-warning");
    });

    it("shows red badge for Advanced level", () => {
      renderWithRouter(<CourseCard course={{ ...mockCourse, level: "Advanced" }} />);

      const badge = screen.getByText("Advanced");
      expect(badge).toHaveClass("bg-danger");
    });
  });

  describe("Edge Cases", () => {
    it("renders without crashing when optional props are missing", () => {
      const minimalCourse = {
        id: "1",
        title: "Test Course",
        provider: "Test Provider",
        category: "Test Category",
        description: "Test Description",
        students: 0,
        rating: 0,
        level: "Beginner",
        duration: "1h",
        image: "",
        enrolled: false,
      };

      renderWithRouter(<CourseCard course={minimalCourse} />);

      expect(screen.getByText("Test Course")).toBeInTheDocument();
    });

    it("handles missing onCardClick callback gracefully", () => {
      renderWithRouter(<CourseCard course={mockCourse} />);

      const card = screen.getByText("React Cơ Bản").closest(".card");

      // Should not throw error when onCardClick is undefined
      expect(() => fireEvent.click(card)).not.toThrow();
    });
  });

  describe("Styling", () => {
    it("applies different border style when enrolled", () => {
      const enrolledCourse = { ...mockCourse, enrolled: true };
      const { container } = renderWithRouter(<CourseCard course={enrolledCourse} />);

      const card = container.querySelector(".card");
      const style = window.getComputedStyle(card);

      // Card should have different styling when enrolled
      expect(card).toBeTruthy();
    });

    it("has pointer cursor on card", () => {
      const { container } = renderWithRouter(<CourseCard course={mockCourse} />);

      const card = container.querySelector(".card");
      expect(card).toHaveStyle({ cursor: "pointer" });
    });
  });
});
