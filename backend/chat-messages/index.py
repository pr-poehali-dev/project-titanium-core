import json
import os
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
    """Получение и отправка сообщений чата. GET — список, POST — отправить"""
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    conn = get_conn()
    cur = conn.cursor()

    if event.get("httpMethod") == "GET":
        cur.execute(
            """
            SELECT m.id, m.text, m.created_at, u.name, u.role
            FROM messages m
            JOIN users u ON u.id = m.user_id
            ORDER BY m.created_at ASC
            LIMIT 200
            """
        )
        rows = cur.fetchall()
        msgs = [
            {"id": r[0], "text": r[1], "created_at": r[2].isoformat(), "name": r[3], "role": r[4]}
            for r in rows
        ]
        return {"statusCode": 200, "headers": headers, "body": json.dumps(msgs, ensure_ascii=False)}

    if event.get("httpMethod") == "POST":
        body = json.loads(event.get("body") or "{}")
        user_id = body.get("user_id")
        text = (body.get("text") or "").strip()

        if not user_id or not text:
            return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "Нет user_id или текста"})}
        if len(text) > 1000:
            return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "Сообщение слишком длинное"})}

        cur.execute(
            f"INSERT INTO messages (user_id, text) VALUES ({int(user_id)}, '{esc(text)}') RETURNING id, created_at"
        )
        row = cur.fetchone()
        conn.commit()
        return {
            "statusCode": 200,
            "headers": headers,
            "body": json.dumps({"id": row[0], "created_at": row[1].isoformat()}),
        }

    return {"statusCode": 405, "headers": headers, "body": json.dumps({"error": "Method not allowed"})}