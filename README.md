# curiosity-hour
This is a question game about getting to know a partner or friend better through thought provoking questions. 

---

## 🔁 Retrospective Gate

This project uses a **git pre-push hook** to ensure closed beads (tasks) have corresponding retrospective files before allowing pushes.

### How It Works

When you push commits that close beads, the pre-push hook:
1. Checks if the `bd` (beads) command is available
2. Identifies beads that transitioned to "closed" status
3. Verifies a retrospective file exists in `/root/.openclaw/workspace/retrospectives/`
4. Blocks the push if retrospectives are missing

### Retrospective File Naming

Retrospectives should be named:
- `task-retro-<project>-<bead-id>.md` (preferred)
- `task-retro-<bead-id>.md`
- `retro-<project>-<bead-id>.md`
- `retro-<bead-id>.md`

Location: `/root/.openclaw/workspace/retrospectives/YYYY/MM/DD/`

### Bypassing the Hook

If you need to push without running the hook (e.g., emergency fixes):

```bash
git push --no-verify
```

⚠️ **Note:** Bypassing the hook is discouraged. Retrospectives help capture lessons learned and improve team knowledge.

### Installation

The hook is automatically installed for all projects in `/root/.openclaw/workspace/projects/`. To manually reinstall:

```bash
/root/.openclaw/workspace/scripts/deploy-retro-hook.sh
```

### Graceful Degradation

The hook only enforces retrospectives if:
- The `bd` command is available in PATH
- The retrospectives directory exists

Otherwise, it warns and allows the push to proceed.


