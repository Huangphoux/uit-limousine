// src/domain_layer/submission.entity.js
export class SubmissionEntity {
  #id; #assignmentId; #courseId; #studentId; #text; #files; #version; #submittedAt; #status; #grade; #feedback;

  get id(){ return this.#id; }
  get assignmentId(){ return this.#assignmentId; }
  get courseId(){ return this.#courseId; }
  get studentId(){ return this.#studentId; }
  get text(){ return this.#text; }
  get files(){ return this.#files; }
  get version(){ return this.#version; }
  get submittedAt(){ return this.#submittedAt; }
  get status(){ return this.#status; }
  get grade(){ return this.#grade; }
  get feedback(){ return this.#feedback; }

  set id(v){ this.#id = v; }
  set assignmentId(v){ this.#assignmentId = v; }
  set courseId(v){ this.#courseId = v; }
  set studentId(v){ this.#studentId = v; }
  set text(v){ this.#text = v; }
  set files(v){ this.#files = v; }
  set version(v){ this.#version = v; }
  set submittedAt(v){ this.#submittedAt = v; }
  set status(v){ this.#status = v; }
  set grade(v){ this.#grade = v; }
  set feedback(v){ this.#feedback = v; }
}
