# Alerts Policy
This document outlines key alerting policies for monitoring application health, reliability, and potential incidents.

## Notifications Alerts
1. High Rate of Email Sending Failures
- Source: Notification logs and metrics
- Condition: Error logs related to email delivery exceed a defined threshold (e.g., >10 errors/min).
- Purpose: Detect issues with email provider or service misconfiguration.

## Subscriptions & Weather Alerts
2. Missing City Errors
- Source: Subscriptions & Weather micro-services
- Condition: Repeated error logs about city not found (e.g., invalid location input) within a short period.
- Purpose: Indicate possible frontend validation issues or abuse.

## Generic Application Alerts
3. High Error Log Volume
- Source: All micro-services
- Condition: Error-level logs exceed N occurrences in a given time window (e.g., 5 minutes).
- Purpose: Detect widespread failures or regressions.

## Caching Alerts
4. Excessive Cache Misses
- Source: Weather micro-service
- Condition: Cache miss ratio exceeds a threshold (e.g., >60%) over rolling time window.
- Purpose: Indicate inappropriate cache settings and errors.

## RPC Activity Alerts
4. Unusual RPC Traffic Spike
- Source: RPC request counters
- Condition: Sudden increase in RPC calls beyond normal baseline (e.g., 95th percentile).
- Purpose: Identify unexpected behavior, looping, or abuse patterns.

## Subscription Spike Alerts
5. Abnormal Subscription Activity
- Source: subscription_created_total counter or related logs
- Condition: Surge in new subscriptions within a short timeframe.
- Purpose: Could signal legitimate growth, bots, or DDoS attempts.