export const user = {
    id: "get-course-materials",
}

export const course = {
    id: "get-course-materials",
    title: "Introduction to JavaScript",
};

export const module = {
    id: "get-course-materials",
    courseId: course.id,
    title: "JavaScript Fundamentals",
};

export const lessons = [
    {
        id: "get-course-materials-lession-1",
        moduleId: module.id,
        title: "Lesson 1: Variables and Data Types",
        mediaUrl: "https://example.com/videos/js-variables.mp4",
        contentType: "video",
        durationSec: 600,
        position: 1,
    },
    {
        id: "get-course-materials-lession-2",
        moduleId: module.id,
        title: "Lesson 2: Functions and Scope",
        mediaUrl: "https://example.com/videos/js-functions.mp4",
        contentType: "video",
        durationSec: 720,
        position: 2,
    },
];