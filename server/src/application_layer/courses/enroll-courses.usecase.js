import { EnrollmentEntity } from "../../domain_layer/enrollment.entity.js";

export class EnrollCoursesUseCaseInput {
    userId;
    courseId;
}

export class EnrollCoursesUseCaseOutput {
    enrollmentId;
    courseId;
    studentId;
    enrolledAt;
    status;

    static create(enrollment) {
        let result = new EnrollCoursesUseCaseOutput();
        result.enrollmentId = enrollment.id;
        result.studentId = enrollment.userId;
        result.courseId = enrollment.courseId;
        result.enrolledAt = enrollment.enrolledAt;
        result.status = enrollment.status;

        return result;
    }
}

export class EnrollCoursesUseCase {
    #userRepository
    #courseRepository;
    #enrollmentRepository;

    constructor(userRepository, courseRepository, enrollmentRepository) {
        this.#userRepository = userRepository;
        this.#courseRepository = courseRepository;
        this.#enrollmentRepository = enrollmentRepository;
    }

    async execute(input) {
        let user = await this.#userRepository.findById(input.userId);
        if (!user) throw Error(`User not found, ${input.userId}`);

        let course = await this.#courseRepository.findById(input.courseId);
        if (!course) throw Error(`Course not found, ${input.courseId}`);

        // Check if user is already enrolled (idempotent)
        let existingEnrollment = await this.#enrollmentRepository.findByUserAndCourse(user.id, course.id);
        if (existingEnrollment) {
            return EnrollCoursesUseCaseOutput.create(existingEnrollment);
        }

        let enrollment = EnrollmentEntity.create(user.id, course.id);

        let savedEnrollment = await this.#enrollmentRepository.add(enrollment);

        return EnrollCoursesUseCaseOutput.create(savedEnrollment);
    }
}