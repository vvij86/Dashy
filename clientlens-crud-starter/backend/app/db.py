
import os
import pymssql
from contextlib import contextmanager
from dotenv import load_dotenv

load_dotenv()

def _get_env(name: str, default=None):
    v = os.getenv(name, default)
    if v is None:
        raise RuntimeError(f"Missing required env var: {name}")
    return v

MSSQL_SERVER = _get_env("MSSQL_SERVER", "localhost")
MSSQL_PORT = int(_get_env("MSSQL_PORT", "1433"))
MSSQL_DB = _get_env("MSSQL_DB", "client_group")
MSSQL_USER = _get_env("MSSQL_USER", "sa")
MSSQL_PASSWORD = _get_env("MSSQL_PASSWORD", "Strong_Password_123!")

@contextmanager
def mssql_conn():
    conn = pymssql.connect(
        server=MSSQL_SERVER,
        port=MSSQL_PORT,
        user=MSSQL_USER,
        password=MSSQL_PASSWORD,
        database=MSSQL_DB,
        charset="UTF-8",
        as_dict=True,
        login_timeout=10,
        timeout=30,
    )
    try:
        yield conn
        conn.commit()
    finally:
        try:
            conn.close()
        except Exception:
            pass
