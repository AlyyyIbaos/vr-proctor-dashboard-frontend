import { useState } from "react";
import api from "../api";

export default function ProctorExamBuilderPage() {
  const [examId, setExamId] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState("MCQ");

  const [choiceA, setChoiceA] = useState("");
  const [choiceB, setChoiceB] = useState("");
  const [choiceC, setChoiceC] = useState("");
  const [choiceD, setChoiceD] = useState("");

  const saveQuestion = async () => {
    const choices = [
      { label: "A", text: choiceA },
      { label: "B", text: choiceB },
      { label: "C", text: choiceC },
      { label: "D", text: choiceD },
    ];

    try {
      await api.post(`/api/exams/admin/${examId}/questions`, {
        question_index: 1,
        question_type: questionType,
        question_text: questionText,
        time_limit: 60,
        choices,
      });

      alert("Question added");
    } catch (err) {
      console.error(err);
      alert("Failed to add question");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Exam Builder</h1>

      <input
        className="border p-2 w-full mb-4"
        placeholder="Exam ID"
        value={examId}
        onChange={(e) => setExamId(e.target.value)}
      />

      <textarea
        className="border p-2 w-full mb-4"
        placeholder="Question text"
        value={questionText}
        onChange={(e) => setQuestionText(e.target.value)}
      />

      <select
        className="border p-2 mb-4"
        value={questionType}
        onChange={(e) => setQuestionType(e.target.value)}
      >
        <option value="MCQ">MCQ</option>
        <option value="TF">True / False</option>
      </select>

      <input
        className="border p-2 w-full mb-2"
        placeholder="Choice A"
        onChange={(e) => setChoiceA(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-2"
        placeholder="Choice B"
        onChange={(e) => setChoiceB(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-2"
        placeholder="Choice C"
        onChange={(e) => setChoiceC(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-4"
        placeholder="Choice D"
        onChange={(e) => setChoiceD(e.target.value)}
      />

      <button
        onClick={saveQuestion}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save Question
      </button>
    </div>
  );
}
