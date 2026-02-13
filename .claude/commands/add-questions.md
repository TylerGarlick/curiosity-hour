# Add Questions Skill

Generate and add new questions to the Curiosity Hour question pool.

## Usage

This skill generates high-quality questions for a specific category and appends them to the corresponding JSON file in `data/`.

### Arguments

- `category` (optional) - The category to add questions to. One of:
  - `general` — Warm, open-ended getting-to-know-you questions
  - `funny` — Silly, absurd, creative hypotheticals
  - `would-you-rather` — "Would you rather X or Y?" questions
  - `deep` — Existential, meaning-of-life, values-driven questions
  - `spicy` — Debate-worthy opinions and hot takes
  - `nostalgia` — Memory lane, throwbacks
  - `intimate` — Emotionally vulnerable, relationship-focused
  - `nsfw` — Adult/romantic questions

- `count` (optional, default: 10) - Number of questions to generate

### Example

```
/add-questions general 15
/add-questions would-you-rather
/add-questions deep 5
```

## Implementation Details

The skill should:

1. Read the existing `data/{category}.json` file to understand the tone and style
2. Parse existing questions to identify patterns and avoid duplicates/near-duplicates
3. Generate `count` new open-ended, high-quality questions matching the category guidelines
4. Auto-assign the next available ID using the category prefix (e.g., `gen_301` for general if the highest is `gen_300`)
5. Append the new questions to the JSON file in the same format
6. Return a summary of added questions

## Category Guidelines

### General (450 total)
Warm, open-ended getting-to-know-you. Covers childhood, daily life, preferences, personality, goals, habits. Should feel like a good first-date or new-friend conversation. Avoid yes/no answers.

### Funny (225 total)
Silly, absurd, creative hypotheticals. Should make people laugh and reveal personality through humor. Quality drops fast — every question must genuinely make you smile.

### Would You Rather (225 total)
Always formatted as "Would you rather X or Y?" Both options must be genuinely hard to choose between — avoid obvious answers.

### Deep (175 total)
Existential, meaning-of-life, values-driven. Should spark genuine reflection and long conversations. Finite distinct themes — don't force it.

### Spicy (175 total)
Debate-worthy opinions and hot takes. Provocative but not cruel or political. Reveals how someone thinks under pressure.

### Nostalgia (250 total)
Memory lane, throwbacks, "remember when." Covers music, childhood, embarrassing moments, firsts, old favorites. Should trigger storytelling.

### Intimate (175 total)
Emotionally vulnerable, relationship-focused. Love languages, trust, fears about closeness, what makes someone feel seen.

### NSFW (125 total)
Adult/romantic. Physical intimacy, fantasies, desires, boundaries, attraction. Tasteful but direct — not crude. Most constrained category.

## Quality Checklist

When reviewing generated questions, ensure:

- ✓ No duplicates or near-duplicates with existing questions
- ✓ No yes/no questions (must be open-ended)
- ✓ Appropriate tone for the category
- ✓ Actually useful for getting to know someone deeper
- ✓ Unique ID assigned (next in sequence)
- ✓ Proper JSON format maintained
