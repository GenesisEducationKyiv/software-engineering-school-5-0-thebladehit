# ADR-001: Choosing Framework
**Status**: Accepted    
**Date**: 08.06.2025    
**Author**: Bogdan Yarmolka 

## Context
It is necessary to choose a framework for developing:
- REST API for current weather
- REST API for subscription management
- Integration with external weather API provider
- Sending `HOURLY` / `DAILY` forecast emails
- Caching weather data

## Considered options
1. NestJS
- **Pros**: Scalability; modularity; lots of built-in features: DI, pipes, interceptors, etc; own **CLI**; easy integration with testing frameworks; easy integration with wide range of ORMs; own experience with it.
- **Cons**: Lots of dependencies; need more time to start work with;

2. Express.js
- **Pros**: Easy to start; flexibility; lots of documentation and guides.
- **Cons**: No defined structure how to write code; no build-in features like: DI, global exception filters, pipes, etc.

3. Node `http` module
- **Pros**: Full control; flexibility; official support by Node.js; very fast;
- **Cons**: No built-it features; little community support; need to implement all features on your own.

## Decision
**NestJS** was chosen.

## Consequences
### Positive
- Improved code structure through built-in support for modular architecture.
- Faster development thanks to built-in tools, decorators, and dependency injection.
- Easy integration with tools like PrismaORM.

### Negative
- More dependencies compare to more light frameworks.
- Heavier abstraction layer, which might reduce flexibility in low-level performance tuning.
- Tight coupling with NestJS-specific decorators and patterns, which may impact portability to other frameworks.