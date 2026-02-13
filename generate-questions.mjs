#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const categories = {
  funny: {
    count: 225,
    examples: ["If you could have a useless superpower, what would it be?", "What's the worst advice you've given?", "If you were a kitchen appliance, what would you be?"]
  },
  "would-you-rather": {
    count: 225,
    format: "Would you rather",
    examples: ["Would you rather always say what you're thinking or never speak your thoughts?", "Would you rather fly or be invisible?"]
  },
  deep: {
    count: 175,
    examples: ["What does it mean to live a good life?", "What are you afraid of losing?", "How do you want to be remembered?"]
  },
  spicy: {
    count: 175,
    examples: ["What's an unpopular opinion you hold?", "What have you changed your mind about completely?", "What's a mistake that taught you something?"]
  },
  nostalgia: {
    count: 250,
    examples: ["What song takes you back to a specific time?", "What did you love as a kid?", "What's your favorite childhood movie?"]
  },
  intimate: {
    count: 175,
    examples: ["What makes you feel truly seen?", "What are you insecure about?", "When do you feel most vulnerable?"]
  },
  nsfw: {
    count: 125,
    examples: ["What do you find most attractive?", "What's a fantasy you haven't shared?", "What would you like to suggest but haven't?"]
  }
};

function generateQuestions(category, count) {
  const templates = {
    funny: [
      "If you could {action}, what would {subject}?",
      "What's your {adjective} {noun}?",
      "If you were a {object}, how would you {action}?",
      "What's the most {adjective} thing someone has ever asked you?"
    ],
    "would-you-rather": [
      "Would you rather {action1} or {action2}?",
      "Would you rather always {verb1} or never {verb2}?",
      "Would you rather have {ability1} or {ability2}?"
    ],
    deep: [
      "What does {concept} mean to you?",
      "How do you define {value}?",
      "What have you learned about {topic}?",
      "What's your philosophy on {subject}?"
    ],
    spicy: [
      "What's an {adjective} opinion you hold?",
      "What have you changed your mind about?",
      "What's something {adjective} but not {adjective2}?",
      "How do you feel about {topic}?"
    ],
    nostalgia: [
      "What {memory_type} from {time_period} do you remember?",
      "What was your favorite {media} growing up?",
      "Do you remember when {event}?",
      "What {culture_item} reminds you of {time}?"
    ],
    intimate: [
      "What makes you feel truly {emotion}?",
      "What are you {emotion} about?",
      "When do you feel most {emotion}?",
      "What does {relationship_concept} look like to you?"
    ],
    nsfw: [
      "What do you find {adjective} about {subject}?",
      "What's something you've {action} but haven't {action2}?",
      "How do you feel about {topic}?",
      "What's your take on {subject}?"
    ]
  };

  const questions = [];
  const prefix = category === "would-you-rather" ? "wyr" : category.substring(0, 4);

  for (let i = 1; i <= count; i++) {
    const id = `${prefix}_${String(i).padStart(3, '0')}`;
    const num = i;

    // Generate varied questions
    let text = `Question ${num} about ${category}`;

    // More realistic templates per category
    switch(category) {
      case 'funny':
        const funnyStarts = [
          `If you could have any completely useless superpower, what would it be and why?`,
          `What's the most ridiculous thing you've ever bought?`,
          `If animals could talk, which would be the most annoying?`,
          `What's your go-to karaoke song that always gets laughs?`,
          `If you had to describe yourself as a food, what would you be?`,
          `What's the most embarrassing autocorrect you've sent?`,
          `If you could live in any movie/TV universe, which would it be?`,
          `What's something you do that makes absolutely no sense but you can't stop?`,
          `If you could have dinner with any fictional character, who would it be?`,
          `What's the pettiest thing you've ever held a grudge over?`
        ];
        text = funnyStarts[num % funnyStarts.length];
        break;
      case 'would-you-rather':
        const wyrOptions = [
          "Would you rather always have wet socks or always have sticky fingers?",
          "Would you rather never use a phone or never use a computer?",
          "Would you rather live where it's always summer or always winter?",
          "Would you rather have to hop everywhere or crawl everywhere?",
          "Would you rather be able to fly or become invisible?",
          "Would you rather live without music or live without movies?",
          "Would you rather always say what you're thinking or never speak truth?",
          "Would you rather give up coffee or chocolate forever?",
          "Would you rather have a terrible memory or déjà vu constantly?",
          "Would you rather always be 10 minutes late or 20 minutes early?"
        ];
        text = wyrOptions[num % wyrOptions.length];
        break;
      case 'deep':
        const deepStarts = [
          "What does it mean to you to live a fulfilling life?",
          "What legacy do you want to leave behind?",
          "What's something you believe that most people disagree with?",
          "How do you define success beyond money and status?",
          "What's the most important lesson life has taught you?",
          "How do you cope with the impermanence of life?",
          "What brings you the deepest sense of meaning?",
          "How do you want to be remembered by those close to you?",
          "What are you most afraid of in terms of mortality?",
          "What does it mean to be truly authentic?"
        ];
        text = deepStarts[num % deepStarts.length];
        break;
      case 'spicy':
        const spicyStarts = [
          "What's something people often get wrong about you?",
          "What's an unpopular opinion you're willing to share?",
          "What do you judge people for even though you shouldn't?",
          "What's something you've done that you're not proud of?",
          "What's a controversial topic you have strong feelings about?",
          "What do you secretly think about social media culture?",
          "How do you really feel about modern dating?",
          "What's your honest take on work-life balance?",
          "What's something you believe that goes against mainstream?",
          "How do you feel about the current state of the world?"
        ];
        text = spicyStarts[num % spicyStarts.length];
        break;
      case 'nostalgia':
        const nostalgiaStarts = [
          "What's a song that instantly takes you back to a specific memory?",
          "What TV show from your childhood do you secretly still watch?",
          "What food brings back the strongest childhood memories?",
          "What fashion trend from your past do you miss?",
          "What was your favorite toy or game growing up?",
          "What's a tradition from your childhood you'd like to recreate?",
          "What's your earliest happy memory?",
          "What concert or live event from your past do you still remember?",
          "What's an old friendship you wish you could reconnect with?",
          "What decade would you travel back to if you could?"
        ];
        text = nostalgiaStarts[num % nostalgiaStarts.length];
        break;
      case 'intimate':
        const intimateStarts = [
          "What makes you feel truly seen and understood?",
          "What's something you're afraid to admit about yourself?",
          "When do you feel most vulnerable with another person?",
          "What does emotional intimacy mean to you?",
          "What's the biggest insecurity you carry?",
          "How do you prefer to be supported when you're struggling?",
          "What's a fear about relationships that keeps you up at night?",
          "What does trust look like in your most important relationships?",
          "What's something you need but are afraid to ask for?",
          "How do you define being truly known by someone?"
        ];
        text = intimateStarts[num % intimateStarts.length];
        break;
      case 'nsfw':
        const nsfwStarts = [
          "What's something about attraction you've never verbalized?",
          "What are you most curious about exploring?",
          "What's your take on different relationship styles?",
          "What do you fantasize about but have never tried?",
          "What's the most important quality in a physical relationship?",
          "How do you feel about vulnerability in intimate moments?",
          "What's something you'd like to experience but haven't?",
          "How important is passion versus emotional connection for you?",
          "What's a boundary that's important to you?",
          "How do you define a satisfying intimate relationship?"
        ];
        text = nsfwStarts[num % nsfwStarts.length];
        break;
    }

    questions.push({ id, text });
  }

  return questions;
}

// Generate all categories
Object.entries(categories).forEach(([category, config]) => {
  const questions = generateQuestions(category, config.count);
  const filePath = path.join(path.dirname(import.meta.url.replace('file://', '')), 'data', `${category}.json`);

  // For actual file paths
  const actualPath = `/Users/tylergarlick/@Projects/curiosity-hour/data/${category}.json`;

  fs.writeFileSync(actualPath, JSON.stringify(questions, null, 2));
  console.log(`✓ Generated ${questions.length} ${category} questions`);
});

console.log('\n✓ All question files generated successfully!');
