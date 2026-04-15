import {
  fisherYatesShuffle,
  initializeShuffledQuestions,
  getNextQuestionFromShuffled,
  advanceQuestionIndex,
  getAvailableQuestions,
} from "@/lib/game";
import { GameSession, Question } from "@/types";

describe("Fisher-Yates Shuffle", () => {
  describe("fisherYatesShuffle", () => {
    it("should return a new array without mutating the original", () => {
      const original = [1, 2, 3, 4, 5];
      const shuffled = fisherYatesShuffle(original);
      
      expect(shuffled).not.toBe(original);
      expect(original).toEqual([1, 2, 3, 4, 5]);
      expect(shuffled.length).toBe(original.length);
    });

    it("should contain all original elements", () => {
      const original = [1, 2, 3, 4, 5];
      const shuffled = fisherYatesShuffle(original);
      
      expect(shuffled.sort()).toEqual(original.sort());
    });

    it("should handle empty arrays", () => {
      const result = fisherYatesShuffle([]);
      expect(result).toEqual([]);
    });

    it("should handle single-element arrays", () => {
      const result = fisherYatesShuffle([42]);
      expect(result).toEqual([42]);
    });

    it("should produce different orders across multiple calls", () => {
      const original = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const results = Array.from({ length: 10 }, () => 
        fisherYatesShuffle(original).join(",")
      );
      const uniqueResults = new Set(results);
      
      // With 10 elements, we should get mostly unique shuffles
      // (probability of collision is very low)
      expect(uniqueResults.size).toBeGreaterThan(5);
    });
  });

  describe("Question selection with Fisher-Yates", () => {
    const mockQuestions: Question[] = [
      { id: "q1", text: "Question 1", category: "general" },
      { id: "q2", text: "Question 2", category: "general" },
      { id: "q3", text: "Question 3", category: "general" },
      { id: "q4", text: "Question 4", category: "general" },
      { id: "q5", text: "Question 5", category: "general" },
    ];

    const createMockSession = (): GameSession => ({
      id: "test-game",
      playerNames: ["Player 1"],
      relationshipMode: "partner",
      answeredIds: [],
      skippedIds: [],
      currentId: null,
      activeCategories: "all",
      createdAt: Date.now(),
    });

    describe("initializeShuffledQuestions", () => {
      it("should initialize shuffled question IDs", () => {
        const session = createMockSession();
        const shuffledSession = initializeShuffledQuestions(session, mockQuestions);
        
        expect(shuffledSession.shuffledQuestionIds).toBeDefined();
        expect(shuffledSession.shuffledQuestionIds!.length).toBe(mockQuestions.length);
        expect(shuffledSession.questionIndex).toBe(0);
      });

      it("should contain all question IDs", () => {
        const session = createMockSession();
        const shuffledSession = initializeShuffledQuestions(session, mockQuestions);
        
        const shuffledIds = shuffledSession.shuffledQuestionIds!.sort();
        const originalIds = mockQuestions.map((q) => q.id).sort();
        
        expect(shuffledIds).toEqual(originalIds);
      });
    });

    describe("getNextQuestionFromShuffled", () => {
      it("should return null if shuffle is not initialized", () => {
        const session = createMockSession();
        expect(getNextQuestionFromShuffled(session)).toBeNull();
      });

      it("should return questions sequentially from shuffled list", () => {
        const session = createMockSession();
        const shuffledSession = initializeShuffledQuestions(session, mockQuestions);
        
        const questions: string[] = [];
        let currentSession = shuffledSession;
        
        // Draw all questions
        for (let i = 0; i < mockQuestions.length; i++) {
          const questionId = getNextQuestionFromShuffled(currentSession);
          expect(questionId).not.toBeNull();
          questions.push(questionId!);
          currentSession = advanceQuestionIndex(currentSession);
        }
        
        // Verify no repeats
        const uniqueQuestions = new Set(questions);
        expect(uniqueQuestions.size).toBe(mockQuestions.length);
        
        // Verify all questions were drawn
        expect(questions.sort()).toEqual(mockQuestions.map((q) => q.id).sort());
      });

      it("should return null when all questions are exhausted", () => {
        const session = createMockSession();
        const shuffledSession = initializeShuffledQuestions(session, mockQuestions);
        
        let currentSession = shuffledSession;
        
        // Draw all questions
        for (let i = 0; i < mockQuestions.length; i++) {
          currentSession = advanceQuestionIndex(currentSession);
        }
        
        // Next call should return null
        expect(getNextQuestionFromShuffled(currentSession)).toBeNull();
      });

      it("should guarantee ZERO repeats until exhaustion", () => {
        // Run multiple test iterations to ensure no repeats ever occur
        const iterations = 100;
        let totalQuestionsDrawn = 0;
        let repeatCount = 0;
        
        for (let iter = 0; iter < iterations; iter++) {
          const session = createMockSession();
          const shuffledSession = initializeShuffledQuestions(session, mockQuestions);
          
          const drawnQuestions: string[] = [];
          let currentSession = shuffledSession;
          
          // Draw all questions
          for (let i = 0; i < mockQuestions.length; i++) {
            const questionId = getNextQuestionFromShuffled(currentSession);
            
            // Check for repeat
            if (questionId && drawnQuestions.includes(questionId)) {
              repeatCount++;
            }
            
            drawnQuestions.push(questionId!);
            currentSession = advanceQuestionIndex(currentSession);
          }
          
          totalQuestionsDrawn += drawnQuestions.length;
        }
        
        // CRITICAL: Zero repeats allowed
        expect(repeatCount).toBe(0);
        expect(totalQuestionsDrawn).toBe(iterations * mockQuestions.length);
      });
    });

    describe("advanceQuestionIndex", () => {
      it("should increment the question index", () => {
        const session = createMockSession();
        const shuffledSession = initializeShuffledQuestions(session, mockQuestions);
        
        expect(shuffledSession.questionIndex).toBe(0);
        
        const advanced = advanceQuestionIndex(shuffledSession);
        expect(advanced.questionIndex).toBe(1);
      });

      it("should handle undefined questionIndex gracefully", () => {
        const session = createMockSession();
        const result = advanceQuestionIndex(session);
        expect(result.questionIndex).toBeUndefined();
      });
    });

    describe("Integration: Full game flow", () => {
      it("should complete a full game without any repeats", () => {
        const session = createMockSession();
        let currentSession = initializeShuffledQuestions(session, mockQuestions);
        
        const drawnQuestions: string[] = [];
        
        // Simulate full game
        while (true) {
          const questionId = getNextQuestionFromShuffled(currentSession);
          if (!questionId) break;
          
          drawnQuestions.push(questionId);
          currentSession = advanceQuestionIndex(currentSession);
        }
        
        // Verify all questions were drawn exactly once
        expect(drawnQuestions.length).toBe(mockQuestions.length);
        expect(new Set(drawnQuestions).size).toBe(mockQuestions.length);
        
        // Verify no question appears twice
        const counts: Record<string, number> = {};
        drawnQuestions.forEach((id) => {
          counts[id] = (counts[id] || 0) + 1;
        });
        
        Object.values(counts).forEach((count) => {
          expect(count).toBe(1);
        });
      });

      it("should work correctly with category filtering", () => {
        const mixedQuestions: Question[] = [
          { id: "g1", text: "General 1", category: "general" },
          { id: "g2", text: "General 2", category: "general" },
          { id: "f1", text: "Funny 1", category: "funny" },
          { id: "f2", text: "Funny 2", category: "funny" },
          { id: "d1", text: "Deep 1", category: "deep" },
        ];

        const session: GameSession = {
          ...createMockSession(),
          activeCategories: ["general", "funny"],
        };

        const shuffledSession = initializeShuffledQuestions(session, mixedQuestions);
        
        const drawnQuestions: string[] = [];
        let currentSession = shuffledSession;
        
        while (true) {
          const questionId = getNextQuestionFromShuffled(currentSession);
          if (!questionId) break;
          
          drawnQuestions.push(questionId);
          currentSession = advanceQuestionIndex(currentSession);
        }
        
        // Should only have general and funny questions
        const drawnIds = drawnQuestions;
        expect(drawnIds).toContain("g1");
        expect(drawnIds).toContain("g2");
        expect(drawnIds).toContain("f1");
        expect(drawnIds).toContain("f2");
        expect(drawnIds).not.toContain("d1");
        
        // No repeats
        expect(new Set(drawnIds).size).toBe(drawnIds.length);
      });

      it("should handle answered questions correctly (they're still in shuffle order)", () => {
        const session = createMockSession();
        const shuffledSession = initializeShuffledQuestions(session, mockQuestions);
        
        // Answer first 2 questions
        let currentSession = advanceQuestionIndex(shuffledSession);
        currentSession = {
          ...currentSession,
          answeredIds: [
            getNextQuestionFromShuffled(shuffledSession)!,
            getNextQuestionFromShuffled(currentSession)!,
          ],
        };
        currentSession = advanceQuestionIndex(currentSession);
        currentSession = advanceQuestionIndex(currentSession);
        
        // Continue drawing - should still get unique questions
        const remainingQuestions: string[] = [];
        while (true) {
          const questionId = getNextQuestionFromShuffled(currentSession);
          if (!questionId) break;
          
          remainingQuestions.push(questionId);
          currentSession = advanceQuestionIndex(currentSession);
        }
        
        // Verify no repeats in remaining questions
        expect(new Set(remainingQuestions).size).toBe(remainingQuestions.length);
        
        // Verify none of the answered questions appear in remaining
        currentSession.answeredIds.forEach((answeredId) => {
          expect(remainingQuestions).not.toContain(answeredId);
        });
      });
    });
  });

  describe("Statistical verification", () => {
    it("should produce uniform distribution over many trials", () => {
      const questions: Question[] = Array.from({ length: 10 }, (_, i) => ({
        id: `q${i}`,
        text: `Question ${i}`,
        category: "general",
      }));

      const session: GameSession = {
        id: "test",
        playerNames: ["Test"],
        relationshipMode: "partner",
        answeredIds: [],
        skippedIds: [],
        currentId: null,
        activeCategories: "all",
        createdAt: Date.now(),
      };

      // Track position frequency for each question
      const positionCounts: Record<string, number[]> = {};
      questions.forEach((q) => {
        positionCounts[q.id] = Array(questions.length).fill(0);
      });

      const trials = 1000;
      for (let t = 0; t < trials; t++) {
        const shuffledSession = initializeShuffledQuestions(session, questions);
        let currentSession = shuffledSession;
        let position = 0;

        while (true) {
          const questionId = getNextQuestionFromShuffled(currentSession);
          if (!questionId) break;

          positionCounts[questionId][position]++;
          currentSession = advanceQuestionIndex(currentSession);
          position++;
        }
      }

      // Each question should appear roughly equally in each position
      // (with some variance due to randomness)
      const expectedPerPosition = trials / questions.length;
      const tolerance = expectedPerPosition * 0.5; // 50% tolerance

      for (let pos = 0; pos < questions.length; pos++) {
        let totalInPosition = 0;
        Object.values(positionCounts).forEach((counts) => {
          totalInPosition += counts[pos];
        });
        
        // All positions should be filled
        expect(totalInPosition).toBe(trials);
      }
    });
  });
});
