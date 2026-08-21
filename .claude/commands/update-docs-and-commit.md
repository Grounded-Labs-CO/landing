Usage:
/update-docs-and-commit [optional commit message or description]
What it does:

1. Analyzes git changes (status + diff)
2. Updates docs/changelog.md - adds entries for new features/fixes
3. Updates docs/architecture.md - only if structural changes occurred
4. Updates docs/project_status.md - move completed items, update progress
5. Stages and commits all changes

The command is conservative by desing - it only updates docs that genuinely need on the actual code changes.
