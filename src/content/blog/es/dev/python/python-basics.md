---
title: "Mejores Prácticas de Seguridad en Python"
description: "Aprende prácticas esenciales de seguridad para el desarrollo en Python, desde la validación de entradas hasta patrones de codificación segura que protegen tus aplicaciones."
pubDate: 2024-01-20
author: "Jonathan Rodriguez"
category: "dev"
subcategory: "python"
tags: ["Python", "Seguridad", "Mejores Prácticas", "Codificación Segura", "Desarrollo"]
image: "/images/python-security.jpg"
locale: "es"
draft: false
---

## Introducción a la Seguridad en Python

La seguridad debe ser una consideración fundamental en cualquier proyecto de Python. Esta guía cubre prácticas esenciales de seguridad que todo desarrollador de Python debe implementar para construir aplicaciones robustas y seguras.

### Vulnerabilidades Comunes de Seguridad en Python

#### 1. Ataques de Inyección de Código
Evita ejecutar código no confiable o usar funciones peligrosas:

```python
# ❌ PELIGROSO - Nunca hagas esto
user_input = input("Ingresa código Python: ")
exec(user_input)  # Permite ejecución arbitraria de código

# ❌ PELIGROSO - eval() también es riesgoso
result = eval(user_input)

# ✅ SEGURO - Usa análisis específico en su lugar
import ast
try:
    # Solo permite expresiones literales
    result = ast.literal_eval(user_input)
except (ValueError, SyntaxError):
    print("Entrada inválida")
```

#### 2. Prevención de Inyección SQL
Siempre usa consultas parametrizadas:

```python
import sqlite3

# ❌ VULNERABLE a inyección SQL
def get_user_unsafe(username):
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    query = f"SELECT * FROM users WHERE username = '{username}'"
    cursor.execute(query)  # NO HAGAS ESTO
    return cursor.fetchone()

# ✅ SEGURO - Usa consultas parametrizadas
def get_user_safe(username):
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    query = "SELECT * FROM users WHERE username = ?"
    cursor.execute(query, (username,))
    return cursor.fetchone()

# ✅ SEGURO - Usando ORM SQLAlchemy
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text

def get_user_sqlalchemy(session, username):
    # Consulta parametrizada con SQLAlchemy
    result = session.execute(
        text("SELECT * FROM users WHERE username = :username"),
        {"username": username}
    )
    return result.fetchone()
```

### Validación y Sanitización de Entradas

#### Validar Todos los Datos de Entrada
```python
import re
from typing import Optional

def validate_email(email: str) -> bool:
    """Validar formato de email"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def sanitize_filename(filename: str) -> Optional[str]:
    """Sanitizar nombre de archivo para prevenir traversal de rutas"""
    import os

    # Eliminar separadores de directorio
    filename = os.path.basename(filename)

    # Eliminar caracteres peligrosos
    dangerous_chars = ['<', '>', ':', '"', '/', '\\', '|', '?', '*']
    for char in dangerous_chars:
        filename = filename.replace(char, '')

    # Limitar longitud
    if len(filename) > 255:
        return None

    return filename if filename else None

# Ejemplo de uso
def process_upload(email: str, filename: str) -> dict:
    """Procesar carga de archivo con validación"""
    if not validate_email(email):
        return {"error": "Formato de email inválido"}

    clean_filename = sanitize_filename(filename)
    if not clean_filename:
        return {"error": "Nombre de archivo inválido"}

    return {"success": True, "filename": clean_filename}
```

### Manejo Seguro de Contraseñas

#### Hash de Contraseñas
```python
import bcrypt
import secrets
from typing import bool

class PasswordManager:
    @staticmethod
    def hash_password(password: str) -> str:
        """Hashear una contraseña con bcrypt"""
        # Generar un salt aleatorio
        salt = bcrypt.gensalt(rounds=12)
        # Hashear la contraseña
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed.decode('utf-8')

    @staticmethod
    def verify_password(password: str, hashed: str) -> bool:
        """Verificar una contraseña contra su hash"""
        return bcrypt.checkpw(
            password.encode('utf-8'),
            hashed.encode('utf-8')
        )

    @staticmethod
    def generate_secure_token(length: int = 32) -> str:
        """Generar un token aleatorio criptográficamente seguro"""
        return secrets.token_urlsafe(length)

# Ejemplo de uso
password_manager = PasswordManager()

# Registro
user_password = "contraseña_entrada_usuario"
hashed_password = password_manager.hash_password(user_password)

# Verificación de inicio de sesión
is_valid = password_manager.verify_password(user_password, hashed_password)
```

### Seguridad Criptográfica

#### Generación Segura de Números Aleatorios
```python
import secrets
import os

# ✅ BUENO - Usa el módulo secrets para propósitos criptográficos
def generate_api_key() -> str:
    """Generar una clave API segura"""
    return secrets.token_hex(32)

def generate_session_id() -> str:
    """Generar un ID de sesión seguro"""
    return secrets.token_urlsafe(32)

# ❌ MALO - No uses el módulo random para seguridad
import random
api_key = str(random.randint(1000000, 9999999))  # ¡Predecible!

# ✅ BUENO - Generar bytes aleatorios seguros
secure_bytes = os.urandom(32)
```

#### Cifrado y Descifrado
```python
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import base64
import os

class SecureStorage:
    def __init__(self, password: bytes):
        """Inicializar con cifrado basado en contraseña"""
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
        """Cifrar datos de cadena"""
        return self.cipher.encrypt(data.encode())

    def decrypt_data(self, encrypted_data: bytes) -> str:
        """Descifrar datos de vuelta a cadena"""
        return self.cipher.decrypt(encrypted_data).decode()

# Ejemplo de uso
storage = SecureStorage(b"contraseña_fuerte_aqui")
encrypted = storage.encrypt_data("información sensible")
decrypted = storage.decrypt_data(encrypted)
```

### Seguridad de Entorno y Configuración

#### Gestión Segura de Configuración
```python
import os
from dataclasses import dataclass
from typing import Optional

@dataclass
class AppConfig:
    """Clase de configuración segura"""
    database_url: str
    secret_key: str
    api_key: str
    debug: bool = False

    @classmethod
    def from_environment(cls) -> 'AppConfig':
        """Cargar configuración desde variables de entorno"""
        return cls(
            database_url=os.getenv('DATABASE_URL', ''),
            secret_key=os.getenv('SECRET_KEY', ''),
            api_key=os.getenv('API_KEY', ''),
            debug=os.getenv('DEBUG', 'False').lower() == 'true'
        )

    def validate(self) -> list[str]:
        """Validar configuración"""
        errors = []

        if not self.database_url:
            errors.append("DATABASE_URL es requerido")

        if not self.secret_key or len(self.secret_key) < 32:
            errors.append("SECRET_KEY debe tener al menos 32 caracteres")

        if not self.api_key:
            errors.append("API_KEY es requerido")

        return errors

# Uso
config = AppConfig.from_environment()
validation_errors = config.validate()
if validation_errors:
    raise ValueError(f"Errores de configuración: {validation_errors}")
```

### Seguridad Web (Flask/Django)

#### Ejemplo de Seguridad en Flask
```python
from flask import Flask, request, session, jsonify
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import secrets

app = Flask(__name__)
app.secret_key = secrets.token_hex(32)  # Clave secreta segura

# Limitación de tasa
limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["1000 por día", "100 por hora"]
)

@app.before_request
def security_headers():
    """Agregar encabezados de seguridad a todas las respuestas"""
    @app.after_request
    def add_headers(response):
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['X-Frame-Options'] = 'DENY'
        response.headers['X-XSS-Protection'] = '1; mode=block'
        response.headers['Strict-Transport-Security'] = 'max-age=31536000'
        return response

@app.route('/api/login', methods=['POST'])
@limiter.limit("5 por minuto")
def login():
    """Endpoint de inicio de sesión seguro con limitación de tasa"""
    data = request.get_json()

    if not data or not data.get('username') or not data.get('password'):
        return jsonify({"error": "Credenciales faltantes"}), 400

    # Validar credenciales (implementa tu lógica de autenticación)
    if validate_credentials(data['username'], data['password']):
        session['user_id'] = data['username']
        session['csrf_token'] = secrets.token_hex(16)
        return jsonify({"success": True})
    else:
        return jsonify({"error": "Credenciales inválidas"}), 401

def validate_credentials(username: str, password: str) -> bool:
    """Implementar validación segura de credenciales"""
    # Tu lógica de validación aquí
    pass
```

### Seguridad en Manejo de Archivos

#### Operaciones Seguras con Archivos
```python
import os
import tempfile
from pathlib import Path
import magic  # biblioteca python-magic

class SecureFileHandler:
    ALLOWED_EXTENSIONS = {'.txt', '.pdf', '.png', '.jpg', '.jpeg'}
    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

    def __init__(self, upload_directory: str):
        self.upload_dir = Path(upload_directory)
        self.upload_dir.mkdir(exist_ok=True)

    def validate_file(self, file_path: Path) -> tuple[bool, str]:
        """Validar archivo cargado"""
        # Verificar tamaño de archivo
        if file_path.stat().st_size > self.MAX_FILE_SIZE:
            return False, "Archivo demasiado grande"

        # Verificar extensión de archivo
        if file_path.suffix.lower() not in self.ALLOWED_EXTENSIONS:
            return False, "Tipo de archivo no permitido"

        # Verificar tipo MIME
        mime_type = magic.from_file(str(file_path), mime=True)
        allowed_mimes = {
            'text/plain', 'application/pdf',
            'image/png', 'image/jpeg'
        }

        if mime_type not in allowed_mimes:
            return False, "Contenido de archivo inválido"

        return True, "Válido"

    def secure_save(self, file_data: bytes, filename: str) -> tuple[bool, str]:
        """Guardar archivo cargado de forma segura"""
        # Sanitizar nombre de archivo
        clean_filename = sanitize_filename(filename)
        if not clean_filename:
            return False, "Nombre de archivo inválido"

        # Crear archivo temporal primero
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            temp_file.write(file_data)
            temp_path = Path(temp_file.name)

        try:
            # Validar el archivo temporal
            is_valid, message = self.validate_file(temp_path)
            if not is_valid:
                temp_path.unlink()  # Eliminar archivo temporal
                return False, message

            # Mover a ubicación final
            final_path = self.upload_dir / clean_filename
            temp_path.rename(final_path)
            return True, str(final_path)

        except Exception as e:
            # Limpiar en caso de error
            if temp_path.exists():
                temp_path.unlink()
            return False, f"Guardado falló: {str(e)}"
```

### Registro y Monitoreo de Seguridad

#### Registro Seguro
```python
import logging
import re
from typing import Any

class SecureFormatter(logging.Formatter):
    """Formateador personalizado que sanitiza datos sensibles"""

    SENSITIVE_PATTERNS = [
        (re.compile(r'password[\'\"]\s*:\s*[\'\"](.*?)[\'\"]', re.IGNORECASE), 'password": "***"'),
        (re.compile(r'token[\'\"]\s*:\s*[\'\"](.*?)[\'\"]', re.IGNORECASE), 'token": "***"'),
        (re.compile(r'api_key[\'\"]\s*:\s*[\'\"](.*?)[\'\"]', re.IGNORECASE), 'api_key": "***"'),
    ]

    def format(self, record: logging.LogRecord) -> str:
        # Obtener el mensaje original
        msg = super().format(record)

        # Sanitizar datos sensibles
        for pattern, replacement in self.SENSITIVE_PATTERNS:
            msg = pattern.sub(replacement, msg)

        return msg

# Configurar registro seguro
def setup_secure_logging():
    """Configurar registro seguro"""
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)

    # Crear manejador
    handler = logging.StreamHandler()
    handler.setFormatter(SecureFormatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    ))

    logger.addHandler(handler)
    return logger

# Uso
logger = setup_secure_logging()

# Esto registrará con datos sensibles ocultos
logger.info('Intento de inicio de sesión: {"username": "john", "password": "secret123"}')
# Salida: Intento de inicio de sesión: {"username": "john", "password": "***"}
```

### Pruebas y Validación de Seguridad

#### Pruebas Unitarias para Seguridad
```python
import unittest
from unittest.mock import patch

class SecurityTests(unittest.TestCase):
    """Pruebas unitarias enfocadas en seguridad"""

    def test_password_hashing(self):
        """Probar seguridad del hash de contraseñas"""
        password = "test_password_123"
        hashed = PasswordManager.hash_password(password)

        # La contraseña debe estar hasheada (no en texto plano)
        self.assertNotEqual(password, hashed)

        # El hash debe ser verificable
        self.assertTrue(PasswordManager.verify_password(password, hashed))

        # La contraseña incorrecta no debe verificar
        self.assertFalse(PasswordManager.verify_password("wrong", hashed))

    def test_input_sanitization(self):
        """Probar sanitización de entradas"""
        dangerous_filename = "../../../etc/passwd"
        safe_filename = sanitize_filename(dangerous_filename)

        # No debe contener traversal de ruta
        self.assertNotIn("..", safe_filename or "")
        self.assertNotIn("/", safe_filename or "")

    def test_sql_injection_protection(self):
        """Probar protección contra inyección SQL"""
        # Esto requeriría configuración de base de datos de prueba
        # Probar que entrada maliciosa no se ejecute
        malicious_input = "'; DROP TABLE users; --"

        # Tu consulta parametrizada debe manejar esto de forma segura
        with self.assertRaises((ValueError, TypeError)):
            # Esto debe fallar de forma segura, no ejecutar el comando DROP
            result = get_user_safe(malicious_input)

if __name__ == '__main__':
    unittest.main()
```

### Lista de Verificación de Seguridad

#### Prácticas Esenciales de Seguridad
- [ ] **Validación de Entrada**: Validar todas las entradas de usuario
- [ ] **Codificación de Salida**: Codificar salidas para prevenir XSS
- [ ] **Autenticación**: Implementar autenticación fuerte
- [ ] **Autorización**: Usar controles de acceso apropiados
- [ ] **Cifrado**: Cifrar datos sensibles en reposo y en tránsito
- [ ] **Configuración Segura**: Usar variables de entorno para secretos
- [ ] **Manejo de Errores**: No exponer información sensible en errores
- [ ] **Registro**: Registrar eventos de seguridad sin datos sensibles
- [ ] **Dependencias**: Mantener dependencias actualizadas
- [ ] **Limitación de Tasa**: Implementar limitación de tasa para APIs

#### Preguntas de Revisión de Código sobre Seguridad
1. ¿Se validan todas las entradas de usuario?
2. ¿Las contraseñas están hasheadas correctamente?
3. ¿Las consultas SQL están parametrizadas?
4. ¿Los datos sensibles están cifrados?
5. ¿Los mensajes de error no revelan información?
6. ¿La autenticación y autorización están implementadas correctamente?
7. ¿Los encabezados de seguridad están configurados para aplicaciones web?

### Herramientas y Bibliotecas de Seguridad

#### Bibliotecas Recomendadas
```python
# requirements.txt para proyectos Python seguros
cryptography>=41.0.0      # Criptografía moderna
bcrypt>=4.0.0            # Hash de contraseñas
requests>=2.31.0         # Biblioteca HTTP con correcciones de seguridad
SQLAlchemy>=2.0.0        # ORM con consultas parametrizadas
flask-limiter>=3.0.0     # Limitación de tasa para Flask
python-magic>=0.4.27     # Detección de tipo de archivo
bandit>=1.7.5            # Linter de seguridad
safety>=2.3.0            # Escáner de vulnerabilidades de dependencias
```

#### Escaneo de Seguridad
```bash
# Ejecutar verificaciones de seguridad
bandit -r tu_proyecto/              # Linter de seguridad
safety check                        # Escáner de vulnerabilidades
pip-audit                           # Otro escáner de vulnerabilidades

# Análisis estático
semgrep --config=python.security    # Análisis estático avanzado
```

### Conclusión

La seguridad en el desarrollo de Python requiere un enfoque de múltiples capas. Al implementar estas prácticas desde el inicio de tu proyecto, puedes construir aplicaciones más seguras que protejan los datos de usuarios y resistan ataques comunes.

**Puntos Clave:**
- Nunca confíes en la entrada del usuario
- Usa consultas parametrizadas para bases de datos
- Hashea contraseñas con algoritmos fuertes
- Valida y sanitiza todos los datos
- Mantén las dependencias actualizadas
- Implementa registro y monitoreo apropiados

**Próximos Pasos:**
- Implementar pruebas de seguridad en tu pipeline CI/CD
- Auditorías de seguridad y revisiones de código regulares
- Mantenerse actualizado con avisos de seguridad de Python
- Considerar usar linters enfocados en seguridad como Bandit

¡Recuerda: La seguridad no es una característica que agregas después—debe estar integrada en tu código desde el día uno!