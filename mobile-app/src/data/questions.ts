export interface Question {
  id: string;
  text: string;
  category: 'deep' | 'funny' | 'intimate' | 'nostalgia' | 'spicy' | 'custom' | 'would-you-rather';
  difficulty?: 'easy' | 'medium' | 'hard';
}

export const sampleQuestions: Question[] = [
  // Deep
  { id: '1', text: 'What is a belief you held strongly that changed over time?', category: 'deep', difficulty: 'medium' },
  { id: '2', text: 'What do you think about most when you are alone?', category: 'deep', difficulty: 'medium' },
  { id: '3', text: 'What would you do if you knew you could not fail?', category: 'deep', difficulty: 'hard' },
  { id: '4', text: 'What is something you have never told anyone?', category: 'deep', difficulty: 'hard' },
  { id: '5', text: 'If you could change one thing about yourself, what would it be?', category: 'deep', difficulty: 'medium' },
  
  // Funny
  { id: '6', text: 'What is the most embarrassing thing you have done while alone?', category: 'funny', difficulty: 'easy' },
  { id: '7', text: 'If you were a vegetable, what would you be?', category: 'funny', difficulty: 'easy' },
  { id: '8', text: 'What is your guilty pleasure TV show?', category: 'funny', difficulty: 'easy' },
  { id: '9', text: 'What would you do if you woke up and everyone else was gone?', category: 'funny', difficulty: 'medium' },
  { id: '10', text: 'What is the weirdest food combination you enjoy?', category: 'funny', difficulty: 'easy' },
  
  // Intimate
  { id: '11', text: 'What is something new you want to try with a partner?', category: 'intimate', difficulty: 'medium' },
  { id: '12', text: 'Describe your ideal romantic evening.', category: 'intimate', difficulty: 'medium' },
  { id: '13', text: 'What is your biggest turn-on?', category: 'intimate', difficulty: 'hard' },
  { id: '14', text: 'What is something you find attractive that others might not?', category: 'intimate', difficulty: 'medium' },
  { id: '15', text: 'How do you want to be comforted when you are sad?', category: 'intimate', difficulty: 'medium' },
  
  // Nostalgia
  { id: '16', text: 'What was your favorite childhood cartoon?', category: 'nostalgia', difficulty: 'easy' },
  { id: '17', text: 'What is a memory you wish you could relive?', category: 'nostalgia', difficulty: 'medium' },
  { id: '18', text: 'What was your favorite Halloween costume?', category: 'nostalgia', difficulty: 'easy' },
  { id: '19', text: 'Who was your childhood celebrity crush?', category: 'nostalgia', difficulty: 'easy' },
  { id: '20', text: 'What is a trend from your youth you wish would come back?', category: 'nostalgia', difficulty: 'easy' },
  
  // Spicy
  { id: '21', text: 'What is your biggest fantasy?', category: 'spicy', difficulty: 'hard' },
  { id: '22', text: 'Have you ever had a dream about someone you know?', category: 'spicy', difficulty: 'medium' },
  { id: '23', text: 'What is something you would never do?', category: 'spicy', difficulty: 'hard' },
  { id: '24', text: 'What is your opinion on public displays of affection?', category: 'spicy', difficulty: 'medium' },
  { id: '25', text: 'Describe your perfect kiss.', category: 'spicy', difficulty: 'medium' },
  
  // Would You Rather
  { id: '26', text: 'Would you rather always say what you think or never speak again?', category: 'would-you-rather', difficulty: 'medium' },
  { id: '27', text: 'Would you rather live without music or without movies?', category: 'would-you-rather', difficulty: 'easy' },
  { id: '28', text: 'Would you rather know how you will die or when?', category: 'would-you-rather', difficulty: 'hard' },
  { id: '29', text: 'Would you rather be able to fly or be invisible?', category: 'would-you-rather', difficulty: 'easy' },
  { id: '30', text: 'Would you rather have unlimited money or unlimited time?', category: 'would-you-rather', difficulty: 'medium' },
];

export const categories = [
  { id: 'deep', label: 'Deep', icon: '🤔', color: '#805ad5' },
  { id: 'funny', label: 'Funny', icon: '😂', color: '#ed8936' },
  { id: 'intimate', label: 'Intimate', icon: '❤️', color: '#d53f8c' },
  { id: 'nostalgia', label: 'Nostalgia', icon: '📸', color: '#38b2ac' },
  { id: 'spicy', label: 'Spicy', icon: '🌶️', color: '#e94560' },
  { id: 'would-you-rather', label: 'Would You Rather', icon: '🤨', color: '#4299e1' },
];