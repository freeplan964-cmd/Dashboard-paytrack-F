# Contributing to PayTrack Dashboard

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/Dashboard-paytrack-F.git`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Install dependencies: `yarn install`
5. Start development: `yarn dev`

## Development Setup

### Prerequisites
- Node.js 18+
- Yarn 1.22+

### Environment Setup
```bash
cp .env.example .env.development.local
# Add your environment variables
```

### Running Locally
```bash
# Development server
yarn dev

# Run tests
yarn test

# Run linter
yarn lint

# Build
yarn build
```

## Code Guidelines

### Style
- Use ESLint configuration provided
- Follow Tailwind CSS utility-first approach
- Use TypeScript for type safety
- Write meaningful commit messages

### Commit Convention
```
<type>(<scope>): <subject>

<body>

<footer>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

Example:
```
feat(payroll): add tax calculation validation

Implement comprehensive tax validation to ensure
all payroll calculations are accurate before submission.

Fixes #123
```

### Branch Naming
- Feature: `feature/description`
- Bug fix: `fix/description`
- Documentation: `docs/description`

## Pull Request Process

1. **Before Submitting**
   - Ensure all tests pass: `yarn test`
   - Run linter: `yarn lint`
   - Update documentation
   - Add tests for new features

2. **PR Description**
   - Use the provided PR template
   - Clearly describe changes
   - Link related issues
   - Add screenshots for UI changes

3. **Review Process**
   - Address review comments
   - Keep commits clean
   - Don't force-push after review starts

4. **Merging**
   - Squash commits for clean history
   - Delete feature branch after merge

## Testing

- Write tests for all new features
- Maintain or improve code coverage
- Test edge cases
- Use descriptive test names

## Documentation

- Update README.md if needed
- Add inline code comments for complex logic
- Document API changes
- Update CHANGELOG.md

## Reporting Issues

- Use bug report template
- Include reproduction steps
- Provide environment details
- Add error logs if applicable

## Questions?

- Open a discussion in GitHub Discussions
- Contact maintainers
- Check existing documentation

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

Thank you for contributing! 🎉
