import { render, screen, fireEvent } from '@testing-library/react';
import { CarMode } from '../src/modes/CarMode';

// Mock SpeechSynthesis
const mockSpeechSynthesis = {
  speak: jest.fn(),
  cancel: jest.fn(),
  pause: jest.fn(),
  resume: jest.fn(),
  getVoices: jest.fn(() => []),
  speaking: false,
  paused: false,
};

Object.defineProperty(window, 'speechSynthesis', {
  value: mockSpeechSynthesis,
  writable: true,
});

describe('CarMode', () => {
  const mockProps = {
    question: 'What is your biggest fear?',
    category: 'Deep',
    onDone: jest.fn(),
    onSkip: jest.fn(),
    onReplay: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders car mode with question and category', () => {
    render(<CarMode {...mockProps} />);
    
    expect(screen.getByText('Car Mode')).toBeInTheDocument();
    expect(screen.getByText('Deep')).toBeInTheDocument();
    expect(screen.getByText('What is your biggest fear?')).toBeInTheDocument();
  });

  it('auto-plays question via TTS on mount', () => {
    render(<CarMode {...mockProps} />);
    
    expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
  });

  it('calls onDone when Done button is clicked', () => {
    render(<CarMode {...mockProps} />);
    
    const doneButton = screen.getByLabelText('Mark as done');
    fireEvent.click(doneButton);
    
    expect(mockProps.onDone).toHaveBeenCalled();
    expect(mockSpeechSynthesis.cancel).toHaveBeenCalled();
  });

  it('calls onSkip when Skip button is clicked', () => {
    render(<CarMode {...mockProps} />);
    
    const skipButton = screen.getByLabelText('Skip question');
    fireEvent.click(skipButton);
    
    expect(mockProps.onSkip).toHaveBeenCalled();
    expect(mockSpeechSynthesis.cancel).toHaveBeenCalled();
  });

  it('calls onReplay when replay button is clicked', () => {
    render(<CarMode {...mockProps} />);
    
    const replayButton = screen.getByLabelText('Replay question');
    fireEvent.click(replayButton);
    
    expect(mockProps.onReplay).toHaveBeenCalled();
    expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
  });

  it('has large touch targets (min 80px height)', () => {
    render(<CarMode {...mockProps} />);
    
    const doneButton = screen.getByLabelText('Mark as done');
    const skipButton = screen.getByLabelText('Skip question');
    const replayButton = screen.getByLabelText('Replay question');
    
    const doneHeight = parseInt(window.getComputedStyle(doneButton).height);
    const skipHeight = parseInt(window.getComputedStyle(skipButton).height);
    const replayHeight = parseInt(window.getComputedStyle(replayButton).height);
    
    expect(doneHeight).toBeGreaterThanOrEqual(80);
    expect(skipHeight).toBeGreaterThanOrEqual(80);
    expect(replayHeight).toBeGreaterThanOrEqual(44);
  });

  it('shows speaking indicator when TTS is active', () => {
    mockSpeechSynthesis.speaking = true;
    render(<CarMode {...mockProps} />);
    
    expect(screen.querySelectorAll('.speaking-indicator')).toHaveLength(1);
  });

  it('has two big buttons side-by-side', () => {
    render(<CarMode {...mockProps} />);
    
    const actionsContainer = document.querySelector('.car-mode-actions');
    expect(actionsContainer).toBeInTheDocument();
    
    const buttons = actionsContainer?.querySelectorAll('.action-button');
    expect(buttons?.length).toBe(2);
  });
});
