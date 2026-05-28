import json
import os
import hashlib
import pg8000.dbapi


def get_conn():
    url = os.environ["DATABASE_URL"].replace("postgresql://", "").replace("postgres://", "")
    userpass, rest = url.split("@", 1)
    user, password = userpass.split(":", 1)
    hostport, dbname = rest.split("/", 1)
    host, port = (hostport.split(":", 1) if ":" in hostport else (hostport, "5432"))
    return pg8000.dbapi.connect(
        user=user, password=password, host=host, port=int(port), database=dbname
    )


def esc(val):
    return str(val).replace("'", "''")


def handler(event: dict, context) -> dict:
    """Регистрация и вход в чат. POST с action=register или action=login"""
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    body = json.loads(event.get("body") or "{}")
    action = body.get("action")
    login = (body.get("login") or "").strip()
    password = (body.get("password") or "").strip()
    name = (body.get("name") or "").strip()

    if not login or not password:
        return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "Укажи логин и пароль"})}

    pwd_hash = hashlib.md5(password.encode()).hexdigest()
    conn = get_conn()
    cur = conn.cursor()

    if action == "register":
        if not name:
            return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "Укажи имя"})}
        if login == "teacher":
            return {"statusCode": 403, "headers": headers, "body": json.dumps({"error": "Этот логин зарезервирован для учителя"})}
        try:
            cur.execute(
                f"INSERT INTO users (name, login, password_hash, role) VALUES ('{esc(name)}', '{esc(login)}', '{esc(pwd_hash)}', 'student') RETURNING id, name, role"
            )
            row = cur.fetchone()
            conn.commit()
            return {
                "statusCode": 200,
                "headers": headers,
                "body": json.dumps({"id": row[0], "name": row[1], "role": row[2], "login": login}),
            }
        except Exception as e:
            conn.rollback()
            if "unique" in str(e).lower():
                return {"statusCode": 409, "headers": headers, "body": json.dumps({"error": "Такой логин уже занят"})}
            raise

    elif action == "login":
        cur.execute(
            f"SELECT id, name, role FROM users WHERE login = '{esc(login)}' AND password_hash = '{esc(pwd_hash)}'"
        )
        row = cur.fetchone()
        if not row:
            return {"statusCode": 401, "headers": headers, "body": json.dumps({"error": "Неверный логин или пароль"})}
        return {
            "statusCode": 200,
            "headers": headers,
            "body": json.dumps({"id": row[0], "name": row[1], "role": row[2], "login": login}),
        }

    return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "Неверное действие"})}
