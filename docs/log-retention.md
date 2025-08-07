# Log Retention Policy
Given that the application is in an early development stage and the budget for detailed analytics and long-term data storage is limited, log data will be retained for the shortest reasonable time to minimize storage costs.

### Retention Periods
- Error and Fatal logs: 30 days
- Warning logs: 15 days
- Info, Debug, and lower-level logs: 7 days

### Archival and Deletion
After their respective retention periods, logs will be archived for up to 90 days.

After this archival window, only analytical logs will be retained long-term, including but not limited to:
- Daily subscription counts
- Frequency of external API calls
- Other key operational metrics

All other logs will be permanently deleted to reduce storage costs and maintain compliance with the minimal logging strategy.

