# ClientLens CRUD Starter (Angular 19 + FastAPI + SQL Server)

End-to-end CRUD for:
- dbo.clientLens_client_info (insert, update, list)
- dbo.clientLens_email_group (insert, update, list)
- dbo.clientLens_webscraping_info (insert, update, list)

## Backend (FastAPI)

```bash
cd backend
cp .env.example .env   # edit DB creds
pip install -r requirements.txt
python run.py
# API at http://localhost:8000
```

## Frontend (Angular 19 + PrimeNG)

```bash
cd frontend
npm install
npm start
# UI at http://localhost:4200
```

If your API runs on a different host/port, edit `src/app/environments/environment.ts`.

## Notes
- PK updates for `client_info` and `email_group` are supported via `PUT /api/.../{original_key}`, updating the PK itself; your SQL schema's ON UPDATE CASCADE will cascade changes.
- Only insert, update, display are implemented (no delete).
- The UI uses PrimeNG Table, Dialog, and Lara theme.
