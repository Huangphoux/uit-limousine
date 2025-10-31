export const user = {
    email: 'test',
    name: 'Tran Van C',
}

export const userRole = {
    user: {
        connect: { email: user.email },
    },
    role: {
        connect: { name: 'INSTRUCTOR' },
    }
}

export const course = {
    title: "Introduction to Node.js",
    // slug: "introduction-to-node-js",
    category: "Programming",
    shortDesc: "Learn Node.js basics",
    description: "Learn Node.js from scratch, covering core concepts and building your first app.",
    language: "en",
    level: "Beginner",
    price: 500000,
    published: true,
    publishDate: new Date("2025-01-01T00:00:00Z"),
    coverImage: "https://cdn.example.com/thumbnails/course.jpg",
    instructor: {
        connect: { email: user.email },
    }
};