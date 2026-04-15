import fs from 'fs';
import path from 'path';

const JSON_FILES = [
  'deep_questions.json',
  'intimate_questions.json',
  'questions_nostalgia.json',
  'questions-nsfw.json',
  'spicy_questions.json',
  'would_you_rather.json'
];

const BASE_DIR = '/root/.openclaw/workspace/projects/curiosity-hour';

async function deduplicate() {
  const allQuestions = new Map();
  const duplicates = [];

  JSON_FILES.forEach(file => {
    const filePath = path.join(BASE_DIR, file);
    if (!fs.existsSync(filePath)) return;
    
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    content.forEach(q => {
      const text = q.text.trim().toLowerCase().replace(/[^\w\s]/gi, '');
      if (allQuestions.has(text)) {
        duplicates.push({ file, q });
      } else {
        allQuestions.set(text, q);
      }
    });
  });

  console.log(`Total unique questions: ${allQuestions.size}`);
  console.log(`Total duplicates found: ${duplicates.length}`);
  
  if (duplicates.length > 0) {
    console.log('\\nDuplicates List:');
    duplicates.forEach(d => console.log(`File: ${d.file} | Text: ${d.q.text}`));
  }
}

deduplicate();
