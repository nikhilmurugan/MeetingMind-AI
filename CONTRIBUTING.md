# Contributing to MeetingMind AI

Thank you for your interest in contributing to **MeetingMind AI**! We welcome contributions, bug reports, and feature requests.

## How to Contribute

1. **Fork the Repository**: Create your own branch from `main`.
2. **Setup Local Environment**:
   - Backend: `pip install -r backend/requirements.txt`
   - Frontend: `npm install` inside `frontend/`
3. **Make Changes**:
   - Write clean, modular, typed code.
   - Follow standard React 18 & FastAPI conventions.
4. **Test Your Changes**:
   - Backend pipeline test: `python backend/test_pipeline.py`
   - Frontend build test: `npm run build`
5. **Submit a Pull Request**: Describe your changes clearly in the PR template.

## Code Style Guidelines
- **Python**: Follow PEP 8 guidelines. Use Pydantic v2 schemas for all API payloads.
- **Frontend**: Follow functional React component structure with Tailwind CSS styling.
