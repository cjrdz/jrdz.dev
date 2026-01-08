---
title: "Python Security Best Practices"
description: "Learn essential security practices for Python development, from input validation to secure coding patterns that protect your applications."
pubDate: 2024-01-20
author: "Jonathan Rodriguez"
category: "dev"
subcategory: "python"
tags: ["Python", "Security", "Best Practices", "Secure Coding", "Development"]
image: "/images/python-security.jpg"
draft: false
---

## Introduction to Python Security

Security should be a fundamental consideration in any Python project. This guide covers essential security practices that every Python developer should implement to build robust, secure applications.

### Common Python Security Vulnerabilities

#### 1. Code Injection Attacks
Avoid executing untrusted code or using dangerous functions:

```python
# ❌ DANGEROUS - Never do this
user_input = input("Enter Python code: ")
exec(user_input)  # Allows arbitrary code execution

# ❌ DANGEROUS - eval() is also risky
result = eval(user_input)

# ✅ SAFE - Use specific parsing instead
import ast
try:
    # Only allow literal expressions
    result = ast.literal_eval(user_input)
except (ValueError, SyntaxError):
    print("Invalid input")
```

#### 2. SQL Injection Prevention
Always use parameterized queries:

```python
import sqlite3

# ❌ VULNERABLE to SQL injection
def get_user_unsafe(username):
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    query = f"SELECT * FROM users WHERE username = '{username}'"
    cursor.execute(query)  # DON'T DO THIS
    return cursor.fetchone()

# ✅ SAFE - Use parameterized queries
def get_user_safe(username):
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    query = "SELECT * FROM users WHERE username = ?"
    cursor.execute(query, (username,))
    return cursor.fetchone()

# ✅ SAFE - Using SQLAlchemy ORM
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text

def get_user_sqlalchemy(session, username):
    # Parameterized query with SQLAlchemy
    result = session.execute(
        text("SELECT * FROM users WHERE username = :username"),
        {"username": username}
    )
    return result.fetchone()
```

### Input Validation and Sanitization

#### Validate All Input Data
```python
import re
from typing import Optional

def validate_email(email: str) -> bool:
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def sanitize_filename(filename: str) -> Optional[str]:
    """Sanitize filename to prevent path traversal"""
    import os

    # Remove directory separators
    filename = os.path.basename(filename)

    # Remove dangerous characters
    dangerous_chars = ['<', '>', ':', '"', '/', '\\', '|', '?', '*']
    for char in dangerous_chars:
        filename = filename.replace(char, '')

    # Limit length
    if len(filename) > 255:
        return None

    return filename if filename else None

# Example usage
def process_upload(email: str, filename: str) -> dict:
    """Process file upload with validation"""
    if not validate_email(email):
        return {"error": "Invalid email format"}

    clean_filename = sanitize_filename(filename)
    if not clean_filename:
        return {"error": "Invalid filename"}

    return {"success": True, "filename": clean_filename}
```

### Secure Password Handling

#### Password Hashing
```python
import bcrypt
import secrets
from typing import bool

class PasswordManager:
    @staticmethod
    def hash_password(password: str) -> str:
        """Hash a password with bcrypt"""
        # Generate a random salt
        salt = bcrypt.gensalt(rounds=12)
        # Hash the password
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed.decode('utf-8')

    @staticmethod
    def verify_password(password: str, hashed: str) -> bool:
        """Verify a password against its hash"""
        return bcrypt.checkpw(
            password.encode('utf-8'),
            hashed.encode('utf-8')
        )

    @staticmethod
    def generate_secure_token(length: int = 32) -> str:
        """Generate a cryptographically secure random token"""
        return secrets.token_urlsafe(length)

# Example usage
password_manager = PasswordManager()

# Registration
user_password = "user_input_password"
hashed_password = password_manager.hash_password(user_password)

# Login verification
is_valid = password_manager.verify_password(user_password, hashed_password)
```

### Cryptographic Security

#### Secure Random Number Generation
```python
import secrets
import os

# ✅ GOOD - Use secrets module for cryptographic purposes
def generate_api_key() -> str:
    """Generate a secure API key"""
    return secrets.token_hex(32)

def generate_session_id() -> str:
    """Generate a secure session ID"""
    return secrets.token_urlsafe(32)

# ❌ BAD - Don't use random module for security
import random
api_key = str(random.randint(1000000, 9999999))  # Predictable!

# ✅ GOOD - Generate secure random bytes
secure_bytes = os.urandom(32)
```

#### Encryption and Decryption
```python
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import base64
import os

class SecureStorage:
    def __init__(self, password: bytes):
        """Initialize with password-based encryption"""
        self.salt = os.urandom(16)
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=self.salt,
            iterations=100000,
        )
        key = base64.urlsafe_b64encode(kdf.derive(password))
        self.cipher = Fernet(key)

    def encrypt_data(self, data: str) -> bytes:
        """Encrypt string data"""
        return self.cipher.encrypt(data.encode())

    def decrypt_data(self, encrypted_data: bytes) -> str:
        """Decrypt data back to string"""
        return self.cipher.decrypt(encrypted_data).decode()

# Example usage
storage = SecureStorage(b"strong_password_here")
encrypted = storage.encrypt_data("sensitive information")
decrypted = storage.decrypt_data(encrypted)
```

### Environment and Configuration Security

#### Secure Configuration Management
```python
import os
from dataclasses import dataclass
from typing import Optional

@dataclass
class AppConfig:
    """Secure configuration class"""
    database_url: str
    secret_key: str
    api_key: str
    debug: bool = False

    @classmethod
    def from_environment(cls) -> 'AppConfig':
        """Load configuration from environment variables"""
        return cls(
            database_url=os.getenv('DATABASE_URL', ''),
            secret_key=os.getenv('SECRET_KEY', ''),
            api_key=os.getenv('API_KEY', ''),
            debug=os.getenv('DEBUG', 'False').lower() == 'true'
        )

    def validate(self) -> list[str]:
        """Validate configuration"""
        errors = []

        if not self.database_url:
            errors.append("DATABASE_URL is required")

        if not self.secret_key or len(self.secret_key) < 32:
            errors.append("SECRET_KEY must be at least 32 characters")

        if not self.api_key:
            errors.append("API_KEY is required")

        return errors

# Usage
config = AppConfig.from_environment()
validation_errors = config.validate()
if validation_errors:
    raise ValueError(f"Configuration errors: {validation_errors}")
```

### Web Security (Flask/Django)

#### Flask Security Example
```python
from flask import Flask, request, session, jsonify
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import secrets

app = Flask(__name__)
app.secret_key = secrets.token_hex(32)  # Secure secret key

# Rate limiting
limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["1000 per day", "100 per hour"]
)

@app.before_request
def security_headers():
    """Add security headers to all responses"""
    @app.after_request
    def add_headers(response):
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['X-Frame-Options'] = 'DENY'
        response.headers['X-XSS-Protection'] = '1; mode=block'
        response.headers['Strict-Transport-Security'] = 'max-age=31536000'
        return response

@app.route('/api/login', methods=['POST'])
@limiter.limit("5 per minute")
def login():
    """Secure login endpoint with rate limiting"""
    data = request.get_json()

    if not data or not data.get('username') or not data.get('password'):
        return jsonify({"error": "Missing credentials"}), 400

    # Validate credentials (implement your auth logic)
    if validate_credentials(data['username'], data['password']):
        session['user_id'] = data['username']
        session['csrf_token'] = secrets.token_hex(16)
        return jsonify({"success": True})
    else:
        return jsonify({"error": "Invalid credentials"}), 401

def validate_credentials(username: str, password: str) -> bool:
    """Implement secure credential validation"""
    # Your validation logic here
    pass
```

### File Handling Security

#### Safe File Operations
```python
import os
import tempfile
from pathlib import Path
import magic  # python-magic library

class SecureFileHandler:
    ALLOWED_EXTENSIONS = {'.txt', '.pdf', '.png', '.jpg', '.jpeg'}
    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

    def __init__(self, upload_directory: str):
        self.upload_dir = Path(upload_directory)
        self.upload_dir.mkdir(exist_ok=True)

    def validate_file(self, file_path: Path) -> tuple[bool, str]:
        """Validate uploaded file"""
        # Check file size
        if file_path.stat().st_size > self.MAX_FILE_SIZE:
            return False, "File too large"

        # Check file extension
        if file_path.suffix.lower() not in self.ALLOWED_EXTENSIONS:
            return False, "File type not allowed"

        # Check MIME type
        mime_type = magic.from_file(str(file_path), mime=True)
        allowed_mimes = {
            'text/plain', 'application/pdf',
            'image/png', 'image/jpeg'
        }

        if mime_type not in allowed_mimes:
            return False, "Invalid file content"

        return True, "Valid"

    def secure_save(self, file_data: bytes, filename: str) -> tuple[bool, str]:
        """Securely save uploaded file"""
        # Sanitize filename
        clean_filename = sanitize_filename(filename)
        if not clean_filename:
            return False, "Invalid filename"

        # Create temporary file first
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            temp_file.write(file_data)
            temp_path = Path(temp_file.name)

        try:
            # Validate the temporary file
            is_valid, message = self.validate_file(temp_path)
            if not is_valid:
                temp_path.unlink()  # Delete temp file
                return False, message

            # Move to final location
            final_path = self.upload_dir / clean_filename
            temp_path.rename(final_path)
            return True, str(final_path)

        except Exception as e:
            # Clean up on error
            if temp_path.exists():
                temp_path.unlink()
            return False, f"Save failed: {str(e)}"
```

### Logging and Monitoring Security

#### Secure Logging
```python
import logging
import re
from typing import Any

class SecureFormatter(logging.Formatter):
    """Custom formatter that sanitizes sensitive data"""

    SENSITIVE_PATTERNS = [
        (re.compile(r'password[\'\"]\s*:\s*[\'\"](.*?)[\'\"]', re.IGNORECASE), 'password": "***"'),
        (re.compile(r'token[\'\"]\s*:\s*[\'\"](.*?)[\'\"]', re.IGNORECASE), 'token": "***"'),
        (re.compile(r'api_key[\'\"]\s*:\s*[\'\"](.*?)[\'\"]', re.IGNORECASE), 'api_key": "***"'),
    ]

    def format(self, record: logging.LogRecord) -> str:
        # Get the original message
        msg = super().format(record)

        # Sanitize sensitive data
        for pattern, replacement in self.SENSITIVE_PATTERNS:
            msg = pattern.sub(replacement, msg)

        return msg

# Configure secure logging
def setup_secure_logging():
    """Setup secure logging configuration"""
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)

    # Create handler
    handler = logging.StreamHandler()
    handler.setFormatter(SecureFormatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    ))

    logger.addHandler(handler)
    return logger

# Usage
logger = setup_secure_logging()

# This will log with sensitive data hidden
logger.info('User login attempt: {"username": "john", "password": "secret123"}')
# Output: User login attempt: {"username": "john", "password": "***"}
```

### Security Testing and Validation

#### Unit Tests for Security
```python
import unittest
from unittest.mock import patch

class SecurityTests(unittest.TestCase):
    """Security-focused unit tests"""

    def test_password_hashing(self):
        """Test password hashing security"""
        password = "test_password_123"
        hashed = PasswordManager.hash_password(password)

        # Password should be hashed (not plain text)
        self.assertNotEqual(password, hashed)

        # Hash should be verifiable
        self.assertTrue(PasswordManager.verify_password(password, hashed))

        # Wrong password should not verify
        self.assertFalse(PasswordManager.verify_password("wrong", hashed))

    def test_input_sanitization(self):
        """Test input sanitization"""
        dangerous_filename = "../../../etc/passwd"
        safe_filename = sanitize_filename(dangerous_filename)

        # Should not contain path traversal
        self.assertNotIn("..", safe_filename or "")
        self.assertNotIn("/", safe_filename or "")

    def test_sql_injection_protection(self):
        """Test SQL injection protection"""
        # This would require a test database setup
        # Test that malicious input doesn't execute
        malicious_input = "'; DROP TABLE users; --"

        # Your parameterized query should handle this safely
        with self.assertRaises((ValueError, TypeError)):
            # This should fail safely, not execute the DROP command
            result = get_user_safe(malicious_input)

if __name__ == '__main__':
    unittest.main()
```

### Security Checklist

#### Essential Security Practices
- [ ] **Input Validation**: Validate all user inputs
- [ ] **Output Encoding**: Encode outputs to prevent XSS
- [ ] **Authentication**: Implement strong authentication
- [ ] **Authorization**: Use proper access controls
- [ ] **Encryption**: Encrypt sensitive data at rest and in transit
- [ ] **Secure Configuration**: Use environment variables for secrets
- [ ] **Error Handling**: Don't expose sensitive information in errors
- [ ] **Logging**: Log security events without sensitive data
- [ ] **Dependencies**: Keep dependencies updated
- [ ] **Rate Limiting**: Implement rate limiting for APIs

#### Code Review Security Questions
1. Are all user inputs validated?
2. Are passwords properly hashed?
3. Are SQL queries parameterized?
4. Are sensitive data encrypted?
5. Are error messages information disclosure-free?
6. Are authentication and authorization properly implemented?
7. Are security headers set for web applications?

### Security Tools and Libraries

#### Recommended Libraries
```python
# requirements.txt for secure Python projects
cryptography>=41.0.0      # Modern cryptography
bcrypt>=4.0.0            # Password hashing
requests>=2.31.0         # HTTP library with security fixes
SQLAlchemy>=2.0.0        # ORM with parameterized queries
flask-limiter>=3.0.0     # Rate limiting for Flask
python-magic>=0.4.27     # File type detection
bandit>=1.7.5            # Security linter
safety>=2.3.0            # Dependency vulnerability scanner
```

#### Security Scanning
```bash
# Run security checks
bandit -r your_project/              # Security linter
safety check                        # Vulnerability scanner
pip-audit                           # Another vulnerability scanner

# Static analysis
semgrep --config=python.security    # Advanced static analysis
```

### Conclusion

Security in Python development requires a multi-layered approach. By implementing these practices from the beginning of your project, you can build more secure applications that protect user data and resist common attacks.

**Key Takeaways:**
- Never trust user input
- Use parameterized queries for databases
- Hash passwords with strong algorithms
- Validate and sanitize all data
- Keep dependencies updated
- Implement proper logging and monitoring

**Next Steps:**
- Implement security testing in your CI/CD pipeline
- Regular security audits and code reviews
- Stay updated with Python security advisories
- Consider using security-focused linters like Bandit

Remember: Security is not a feature you add later—it must be built into your code from day one!
