This is a blog about Brookline's financial situation.

## Homepage Views
- Journal posts
- Upcoming finance-related meetings
- Summary budget data table

## Manual Meeting Sync
Run this command from the repo root:

```bash
node tools/sync_meetings.js
```

Useful flags:
- `--dry-run` to preview parsed meetings without writing files
- `--debug` to print parser diagnostics (use with `--dry-run`)
- `--allow-empty` to overwrite with an empty meeting list
