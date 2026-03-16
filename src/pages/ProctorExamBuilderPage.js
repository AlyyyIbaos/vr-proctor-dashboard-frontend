import { useEffect, useState } from "react";
import api from "../api";

export default function ProctorExamBuilderPage() {
  /* =========================
     PAGE MODE
  ========================= */

  const [mode, setMode] = useState("list");

  /* =========================
     EXISTING EXAMS
  ========================= */

  const [exams, setExams] = useState([]);
  const [, setSelectedExam] = useState(null);

  const fetchExams = async () => {
    try {
      const res = await api.get("/exams/live");
      setExams(res.data || []);
    } catch (err) {
      console.error("Failed to fetch exams", err);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  /* =========================
     EXAM INFO
  ========================= */

  const [examTitle, setExamTitle] = useState("");
  const [examSubject, setExamSubject] = useState("");
  const [examDuration, setExamDuration] = useState(60);

  /* =========================
     QUESTION INPUT
  ========================= */

  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState("MCQ");

  const [choiceA, setChoiceA] = useState("");
  const [choiceB, setChoiceB] = useState("");
  const [choiceC, setChoiceC] = useState("");
  const [choiceD, setChoiceD] = useState("");

  const [correctAnswer, setCorrectAnswer] = useState("");

  /* =========================
     QUESTIONS LIST
  ========================= */

  const [questions, setQuestions] = useState([]);

  /* =========================
     ADD QUESTION
  ========================= */

  const addQuestion = () => {
    if (!questionText) {
      alert("Question text required");
      return;
    }

    let choices = [];

    if (questionType === "MCQ") {
      choices = [
        { label: "A", text: choiceA },
        { label: "B", text: choiceB },
        { label: "C", text: choiceC },
        { label: "D", text: choiceD },
      ];
    } else {
      choices = [
        { label: "A", text: "True" },
        { label: "B", text: "False" },
      ];
    }

    const newQuestion = {
      question_index: questions.length + 1,
      question_type: questionType,
      question_text: questionText,
      correct_answer: correctAnswer,
      choices,
    };

    setQuestions([...questions, newQuestion]);

    setQuestionText("");
    setChoiceA("");
    setChoiceB("");
    setChoiceC("");
    setChoiceD("");
    setCorrectAnswer("");
  };

  /* =========================
     DELETE QUESTION
  ========================= */

  const deleteQuestion = (index) => {
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
  };

  /* =========================
     OPEN EXAM
  ========================= */

  const openExam = async (exam) => {
    try {
      const res = await api.get(`/exams/${exam.id}`);

      const data = res.data;

      setSelectedExam(exam);

      setExamTitle(data.title);
      setExamDuration(data.duration);

      const loadedQuestions = data.questions.map((q) => ({
        question_index: q.question_index,
        question_type: q.type,
        question_text: q.text,
        choices: q.choices,
        correct_answer: "",
      }));

      setQuestions(loadedQuestions);

      setMode("editor");
    } catch (err) {
      console.error("Failed to load exam", err);
      alert("Failed to load exam");
    }
  };

  /* =========================
     PUBLISH EXAM
  ========================= */

  const publishExam = async () => {
    if (!examTitle || !examSubject) {
      alert("Exam information incomplete");
      return;
    }

    if (questions.length === 0) {
      alert("Add at least one question");
      return;
    }

    try {
      const examRes = await api.post("/exams/admin", {
        title: examTitle,
        subject: examSubject,
        duration_minutes: examDuration,
      });

      const examId = examRes.data.id;

      for (const q of questions) {
        await api.post(`/exams/admin/${examId}/questions`, {
          question_type: q.question_type,
          question_text: q.question_text,
          time_limit: 60,
          correct_answer: q.correct_answer,
          choices: q.choices,
        });
      }

      await api.patch(`/exams/admin/${examId}/publish`);

      alert("Exam published successfully");

      setExamTitle("");
      setExamSubject("");
      setExamDuration(60);
      setQuestions([]);

      setMode("list");
      fetchExams();
    } catch (err) {
      console.error(err);
      alert("Failed to publish exam");
    }
  };

  /* ======================================================
     SCREEN 1 — EXAM LIST
  ====================================================== */

  if (mode === "list") {
    return (
      <div className="w-full space-y-6">
        <button
          onClick={() => setMode("editor")}
          className="bg-green-600 text-white px-5 py-2 rounded"
        >
          + Create New Exam
        </button>

        <div className="border p-6 rounded">
          <h2 className="text-xl font-semibold mb-3">Existing Exams</h2>

          {exams.length === 0 && (
            <p className="text-gray-500">No exams created yet</p>
          )}

          {exams.map((exam) => (
            <div
              key={exam.id}
              onClick={() => openExam(exam)}
              className="border p-4 rounded mb-2 cursor-pointer hover:bg-gray-100"
            >
              <div className="font-semibold text-lg">{exam.title}</div>
              <div className="text-sm text-gray-500">Exam ID: {exam.id}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ======================================================
     SCREEN 2 — EXAM EDITOR
  ====================================================== */

  const latestQuestion = questions[questions.length - 1];

  return (
    <div className="w-full space-y-6">
      <button onClick={() => setMode("list")} className="text-blue-600">
        ← Back to Exams
      </button>

      <div className="grid grid-cols-2 gap-8">
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          {/* Exam Information */}
          <div className="border p-6 rounded space-y-4">
            <h2 className="text-xl font-semibold">Exam Information</h2>

            <input
              className="border p-2 w-full"
              placeholder="Exam Name"
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
            />

            <input
              className="border p-2 w-full"
              placeholder="Subject"
              value={examSubject}
              onChange={(e) => setExamSubject(e.target.value)}
            />

            <div>
              <label className="text-sm font-medium text-gray-600">
                Duration (minutes)
              </label>

              <input
                type="number"
                className="border p-2 w-full"
                placeholder="Duration (in mins)"
                value={examDuration}
                onChange={(e) => setExamDuration(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Add Question */}
          <div className="border p-6 rounded space-y-4">
            <h2 className="text-xl font-semibold">Add Question</h2>

            <textarea
              className="border p-2 w-full"
              placeholder="Question text"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
            />

            <select
              className="border p-2"
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value)}
            >
              <option value="MCQ">Multiple Choice</option>
              <option value="TF">True / False</option>
            </select>

            {questionType === "MCQ" && (
              <div className="space-y-2">
                <input
                  className="border p-2 w-full"
                  placeholder="Choice A"
                  value={choiceA}
                  onChange={(e) => setChoiceA(e.target.value)}
                />
                <input
                  className="border p-2 w-full"
                  placeholder="Choice B"
                  value={choiceB}
                  onChange={(e) => setChoiceB(e.target.value)}
                />
                <input
                  className="border p-2 w-full"
                  placeholder="Choice C"
                  value={choiceC}
                  onChange={(e) => setChoiceC(e.target.value)}
                />
                <input
                  className="border p-2 w-full"
                  placeholder="Choice D"
                  value={choiceD}
                  onChange={(e) => setChoiceD(e.target.value)}
                />
              </div>
            )}

            <select
              className="border p-2"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
            >
              <option value="">Correct Answer</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>

            <button
              onClick={addQuestion}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Add Question
            </button>
          </div>

          {/* Questions List */}
          <div className="border p-6 rounded">
            <div className="flex justify-between mb-3">
              <h2 className="text-xl font-semibold">Questions</h2>
              <span className="bg-gray-200 px-3 py-1 rounded-full text-sm">
                {questions.length}
              </span>
            </div>

            {questions.length === 0 && (
              <p className="text-gray-500">No questions added yet</p>
            )}

            {questions.map((q, index) => (
              <div
                key={index}
                className="border p-3 rounded mb-2 flex justify-between"
              >
                <span>
                  Q{index + 1}: {q.question_text}
                </span>
                <button
                  onClick={() => deleteQuestion(index)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          {/* Publish */}
          <button
            onClick={publishExam}
            className="bg-red-600 text-white px-6 py-3 rounded"
          >
            Publish Exam (VR Ready)
          </button>
        </div>

        {/* RIGHT COLUMN — VR PREVIEW */}
        <div className="border p-6 rounded h-fit">
          <h2 className="text-xl font-semibold mb-4">VR Question Preview</h2>

          {questions.length === 0 && (
            <p className="text-gray-500">Add a question to preview it</p>
          )}

          {latestQuestion && (
            <div className="space-y-3">
              <p className="font-semibold">Question {questions.length}</p>

              <p className="text-lg">{latestQuestion.question_text}</p>

              {latestQuestion.choices.map((c) => (
                <div key={c.label} className="border p-2 rounded">
                  <strong>{c.label}</strong> {c.text}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
