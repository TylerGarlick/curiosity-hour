/**
 * @vitest-environment jsdom
 * Visual regression and layout consistency tests for card-style UI
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QuestionCard } from '@/components/QuestionCard';
import { SettingsPanel } from '@/components/SettingsPanel';
import { WelcomeScreen } from '@/components/WelcomeScreen';

describe('Card-style UI Components', () => {
  describe('QuestionCard', () => {
    it('renders with card-style classes', () => {
      const mockQuestion = {
        id: 'test-1',
        text: 'What is your favorite memory?',
        category: 'personal',
        relationshipType: 'partner',
      };

      render(<QuestionCard question={mockQuestion} />);
      
      const cardElement = screen.getByText(mockQuestion.text).parentElement;
      expect(cardElement).toHaveClass('card-style');
      expect(cardElement).toHaveClass('card-texture');
    });

    it('applies rounded corners and shadow styling', () => {
      const mockQuestion = {
        id: 'test-2',
        text: 'Test question',
        category: 'personal',
        relationshipType: 'partner',
      };

      const { container } = render(<QuestionCard question={mockQuestion} />);
      const card = container.firstChild as HTMLElement;
      
      // Check for card-style class which includes rounded-2xl and shadow in CSS
      expect(card.className).toContain('card-style');
      // card-style class provides shadow via CSS, not Tailwind utility
    });

    it('displays empty state with card styling', () => {
      render(<QuestionCard question={null} />);
      
      const emptyState = screen.getByText('No more questions available!');
      const cardElement = emptyState.parentElement;
      
      expect(cardElement).toHaveClass('card-style');
      expect(cardElement).toHaveClass('card-texture');
    });

    it('has accessible TTS button with proper styling', () => {
      const mockQuestion = {
        id: 'test-3',
        text: 'Test question',
        category: 'personal',
        relationshipType: 'partner',
      };

      render(<QuestionCard question={mockQuestion} />);
      
      const ttsButton = screen.getByRole('button', { name: /read aloud/i });
      expect(ttsButton).toBeInTheDocument();
      expect(ttsButton).toHaveClass('touch-manipulation');
    });
  });

  describe('SettingsPanel', () => {
    it('renders with card-style-elevated classes when open', () => {
      const mockUpdateSettings = jest.fn();
      
      // Mock useSettings hook
      jest.mock('@/hooks/useSettings', () => ({
        useSettings: () => ({
          settings: {
            tierMode: 'basic',
            globalAutoRead: false,
            autoAdvanceDelayMs: 1500,
          },
          updateSettings: mockUpdateSettings,
          isClient: true,
        }),
      }));

      render(<SettingsPanel isOpen={true} onClose={() => {}} />);
      
      const panel = screen.getByRole('heading', { name: /settings/i }).closest('.card-style-elevated');
      expect(panel).toBeInTheDocument();
    });

    it('has proper backdrop and overlay', () => {
      render(<SettingsPanel isOpen={true} onClose={() => {}} />);
      
      const backdrop = document.querySelector('.fixed.inset-0');
      expect(backdrop).toHaveClass('backdrop-blur-md');
    });

    it('close button has card-style interactions', () => {
      const mockOnClose = jest.fn();
      render(<SettingsPanel isOpen={true} onClose={mockOnClose} />);
      
      const closeButton = screen.getByRole('button', { name: /close settings/i });
      expect(closeButton).toHaveClass('touch-manipulation');
      expect(closeButton).toHaveClass('active:scale-95');
    });
  });

  describe('WelcomeScreen', () => {
    it('renders main container with card-style-elevated', () => {
      const mockOnStart = jest.fn();
      
      render(<WelcomeScreen onStartGame={mockOnStart} />);
      
      const cardContainer = screen.getByText(/curiosity hour/i).closest('.card-style-elevated');
      expect(cardContainer).toBeInTheDocument();
    });

    it('applies card-texture overlay effect', () => {
      const mockOnStart = jest.fn();
      
      render(<WelcomeScreen onStartGame={mockOnStart} />);
      
      const cardContainer = screen.getByText(/curiosity hour/i).closest('.card-texture');
      expect(cardContainer).toBeInTheDocument();
    });

    it('input fields have enhanced shadow and border styling', () => {
      const mockOnStart = jest.fn();
      
      render(<WelcomeScreen onStartGame={mockOnStart} />);
      
      const inputs = screen.getAllByPlaceholderText(/player/i);
      inputs.forEach(input => {
        expect(input.className).toContain('shadow-sm');
        expect(input.className).toContain('border-border/80');
      });
    });

    it('player count buttons have shadow-sm class', () => {
      const mockOnStart = jest.fn();
      
      render(<WelcomeScreen onStartGame={mockOnStart} />);
      
      const playerButtons = screen.getAllByRole('button').filter(btn => 
        ['2', '3', '4'].includes(btn.textContent || '')
      );
      
      playerButtons.forEach(button => {
        expect(button.className).toContain('shadow-sm');
      });
    });

    it('start button has proper shadow transitions', () => {
      const mockOnStart = jest.fn();
      
      // Fill in names to enable start button
      render(<WelcomeScreen onStartGame={mockOnStart} />);
      
      const inputs = screen.getAllByPlaceholderText(/player/i);
      inputs.forEach((input, idx) => {
        // Simulate typing
        input.focus();
        // Input would be filled in real scenario
      });
      
      const startButton = screen.getByRole('button', { name: /start game/i });
      expect(startButton.className).toContain('shadow-lg');
    });

    it('pro upgrade prompt uses card-style', () => {
      const mockOnStart = jest.fn();
      const mockOnUpgrade = jest.fn();
      
      render(<WelcomeScreen onStartGame={mockOnStart} isPro={false} onUpgrade={mockOnUpgrade} />);
      
      const upgradeCard = screen.getByText(/support the app/i).closest('.card-style');
      expect(upgradeCard).toBeInTheDocument();
    });
  });

  describe('Accessibility & Contrast', () => {
    it('QuestionCard maintains text contrast ratios', () => {
      const mockQuestion = {
        id: 'test-contrast-1',
        text: 'High contrast test',
        category: 'personal',
        relationshipType: 'partner',
      };

      render(<QuestionCard question={mockQuestion} />);
      
      const textElement = screen.getByText(mockQuestion.text);
      // Check that text uses text-primary class for proper contrast
      expect(textElement.className).toContain('text-text-primary');
    });

    it('Buttons have touch-manipulation for accessibility', () => {
      const mockQuestion = {
        id: 'test-a11y-1',
        text: 'Accessibility test',
        category: 'personal',
        relationshipType: 'partner',
      };

      render(<QuestionCard question={mockQuestion} />);
      
      const ttsButton = screen.getByRole('button', { name: /read aloud/i });
      expect(ttsButton).toHaveClass('touch-manipulation');
    });

    it('Interactive elements have active states for feedback', () => {
      const mockOnStart = jest.fn();
      render(<WelcomeScreen onStartGame={mockOnStart} />);
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        // All buttons should have active:scale-95 or similar feedback
        const hasActiveState = button.className.includes('active:scale') || 
                               button.className.includes('active:bg');
        expect(hasActiveState).toBe(true);
      });
    });
  });

  describe('Responsive Layout', () => {
    it('QuestionCard uses responsive padding', () => {
      const mockQuestion = {
        id: 'test-responsive-1',
        text: 'Responsive test',
        category: 'personal',
        relationshipType: 'partner',
      };

      const { container } = render(<QuestionCard question={mockQuestion} />);
      const card = container.firstChild as HTMLElement;
      
      // Check for responsive padding classes
      expect(card.className).toContain('p-6');
      expect(card.className).toContain('sm:p-8');
    });

    it('QuestionCard has responsive text sizing', () => {
      const mockQuestion = {
        id: 'test-responsive-2',
        text: 'Responsive text test',
        category: 'personal',
        relationshipType: 'partner',
      };

      render(<QuestionCard question={mockQuestion} />);
      
      const heading = screen.getByText(mockQuestion.text);
      // Check for responsive text classes
      expect(heading.className).toMatch(/text-(xl|2xl|3xl)/);
    });

    it('WelcomeScreen maintains max-width constraint', () => {
      const mockOnStart = jest.fn();
      render(<WelcomeScreen onStartGame={mockOnStart} />);
      
      const container = screen.getByText(/curiosity hour/i).closest('.w-full');
      expect(container?.className).toContain('max-w-md');
    });
  });
});
