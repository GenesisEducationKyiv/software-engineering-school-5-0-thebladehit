# ADR-002: Choosing DataBase
**Status**: Accepted    
**Date**: 08.06.2025    
**Author**: Bogdan Yarmolka

## Context
It is necessary to choose a database for storing:
- Users information 
- Subscriptions information
- Subscriptions status

## Considered options
1. PostgreSQL
- **Pros**: Reliability; ACID transactions; migrations.
- **Cons**: More resources needed; more complicated for simple operations.

2. MongoDB
- **Pros**: Flexible schema; support for nested structures.
- **Cons**: Eventual consistency; more complicated migrations.

3. SQLite
- **Pros**: Easy to setup; requires few resources.
- **Cons**: Restrictions for concurrent access; not for production. 

## Decision
**PostgreSQL** was chosen.

## Consequences
### Positive
- Reliability.
- Ability to perform complex queries.
- Ready for production load.

### Negative
- More complicated setup.
- Need more resources.