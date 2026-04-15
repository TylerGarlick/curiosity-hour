# Project Retrospectives - Curiosity Hour

This file tracks lessons learned, success patterns, and failure modes to drive continuous improvement of the project and the agent's workflow.

---

## 📅 2026-04-15: The "Randomness & Data" Sprint
**Tasks:** `curiosity-hour-08t` (Deduplication), `curiosity-hour-ik9` (Fisher-Yates Shuffle)

### 🌟 What Went Well
- **Parallel Execution**: Spawning specialized sub-agents for data cleaning and logic implementation allowed the sprint to complete in minutes instead of hours.
- **Tooling over Manual Work**: Developing a custom normalization script for deduplication proved significantly more reliable than manual auditing, especially with a dataset of 1,100+ entries.

### 🧠 Key Lessons
- **Random $\neq$ Unique**: A critical realization that `Math.random()` index selection is prone to the "Birthday Paradox," leading to perceived repeats in short sessions.
- **The "Deck" Pattern**: Shuffling the entire pool once and using an index pointer is the only way to guarantee a 100% unique sequence until exhaustion. This is a core pattern for any "card-draw" style feature.

### 🛠️ Future Improvements
- **Automated Audits**: Transition the deduplication script from a one-off `.mjs` file to a permanent `npm run audit:questions` command.
- **Integration Tests**: The 1,000-trial statistical distribution test should be added to the permanent CI suite to prevent regression in randomness quality.
