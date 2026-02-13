"use client";

import { Question } from "@/types";
import { useState } from "react";

interface CustomQuestionsProps {
  questions: Question[];
  onAdd: (text: string) => void;
  onEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function CustomQuestions({
  questions,
  onAdd,
  onEdit,
  onDelete,
  isOpen,
  onClose,
}: CustomQuestionsProps) {
  const [newQuestion, setNewQuestion] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const handleAdd = () => {
    if (newQuestion.trim()) {
      onAdd(newQuestion.trim());
      setNewQuestion("");
    }
  };

  const handleEditSave = (id: string) => {
    if (editText.trim()) {
      onEdit(id, editText.trim());
      setEditingId(null);
      setEditText("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-3xl border border-border max-w-lg w-full max-h-96 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-serif font-bold text-text-primary">
            My Questions
          </h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Add Question Form */}
          <div className="flex gap-2 pb-4 border-b border-border">
            <input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleAdd();
              }}
              placeholder="Add a new question..."
              className="flex-1 px-3 py-2 border border-border rounded-lg bg-bg text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent text-sm"
            />
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg font-sans font-medium text-sm"
            >
              Add
            </button>
          </div>

          {/* Questions List */}
          {questions.length === 0 ? (
            <p className="text-text-secondary text-sm text-center py-4">
              No custom questions yet
            </p>
          ) : (
            questions.map((q) => (
              <div
                key={q.id}
                className="flex items-start justify-between gap-3 p-3 bg-bg rounded-lg"
              >
                {editingId === q.id ? (
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="flex-1 px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                      autoFocus
                    />
                    <button
                      onClick={() => handleEditSave(q.id)}
                      className="px-3 py-2 bg-accent text-white rounded text-sm"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="flex-1 text-sm text-text-primary">{q.text}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingId(q.id);
                          setEditText(q.text);
                        }}
                        className="text-accent hover:text-accent-hover text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(q.id)}
                        className="text-rose-500 hover:text-rose-600 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-track text-text-primary rounded-lg font-sans font-medium hover:bg-border transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
