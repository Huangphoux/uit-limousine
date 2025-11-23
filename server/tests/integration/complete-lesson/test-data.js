export const user = {
    id: "complete-lesson",
    email: "complete-lesson",
}

export const course = {
    id: "complete-lesson",
    title: "complete-lesson",
}

export const enrollment = {
    userId: user.id,
    courseId: course.id,
}

export const module = {
    id: "complete-lesson",
    title: "complete-lesson",
    courseId: course.id,
}

export const lesson = {
    id: "complete-lesson",
    title: "complete-lesson",
    moduleId: module.id,
}

export const lessonProgress = {
    id: "complete-lesson",
    userId: user.id,
    lessonId: lesson.id,
}

export const input = {
    authId: user.id,
    lessonId: lesson.id,
}