
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from dotenv import load_dotenv

from .db import mssql_conn
from .models import ClientInfo, EmailGroup, WebScrapingInfo

load_dotenv()

app = FastAPI(title="ClientLens CRUD API", version="1.0.0")

# CORS
origins = [o.strip() for o in (os.getenv("CORS_ORIGINS", "http://localhost:4200").split(",")) if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# clientLens_client_info
# -----------------------------

@app.get("/api/client-info", response_model=List[ClientInfo])
def list_client_info():
    with mssql_conn() as conn:
        cur = conn.cursor()
        cur.execute("SELECT client_name, client_full_name, client_sfid, language FROM dbo.clientLens_client_info ORDER BY client_name;")
        rows = cur.fetchall()
        return rows

@app.post("/api/client-info", response_model=ClientInfo, status_code=201)
def create_client_info(item: ClientInfo):
    with mssql_conn() as conn:
        cur = conn.cursor()
        # Check exists
        cur.execute("SELECT 1 FROM dbo.clientLens_client_info WHERE client_name=%s", (item.client_name,))
        if cur.fetchone():
            raise HTTPException(status_code=409, detail="client_name already exists")
        cur.execute(
            "INSERT INTO dbo.clientLens_client_info (client_name, client_full_name, client_sfid, language) VALUES (%s, %s, %s, %s)",
            (item.client_name, item.client_full_name, item.client_sfid, item.language)
        )
    return item

@app.put("/api/client-info/{client_name}", response_model=ClientInfo)
def update_client_info(client_name: str, item: ClientInfo):
    with mssql_conn() as conn:
        cur = conn.cursor()
        # Update PK as well (will cascade due to FK ON UPDATE CASCADE in dependent tables)
        cur.execute(
            "UPDATE dbo.clientLens_client_info SET client_name=%s, client_full_name=%s, client_sfid=%s, language=%s WHERE client_name=%s",
            (item.client_name, item.client_full_name, item.client_sfid, item.language, client_name)
        )
        if cur.rowcount == 0:
            raise HTTPException(status_code=404, detail="client_name not found")
    return item

# -----------------------------
# clientLens_email_group
# -----------------------------

@app.get("/api/email-groups", response_model=List[EmailGroup])
def list_email_groups():
    with mssql_conn() as conn:
        cur = conn.cursor()
        cur.execute("SELECT email_group, email_recipients FROM dbo.clientLens_email_group ORDER BY email_group;")
        rows = cur.fetchall()
        return rows

@app.post("/api/email-groups", response_model=EmailGroup, status_code=201)
def create_email_group(item: EmailGroup):
    with mssql_conn() as conn:
        cur = conn.cursor()
        cur.execute("SELECT 1 FROM dbo.clientLens_email_group WHERE email_group=%s", (item.email_group,))
        if cur.fetchone():
            raise HTTPException(status_code=409, detail="email_group already exists")
        cur.execute(
            "INSERT INTO dbo.clientLens_email_group (email_group, email_recipients) VALUES (%s, %s)",
            (item.email_group, item.email_recipients)
        )
    return item

@app.put("/api/email-groups/{email_group}", response_model=EmailGroup)
def update_email_group(email_group: str, item: EmailGroup):
    with mssql_conn() as conn:
        cur = conn.cursor()
        cur.execute(
            "UPDATE dbo.clientLens_email_group SET email_group=%s, email_recipients=%s WHERE email_group=%s",
            (item.email_group, item.email_recipients, email_group)
        )
        if cur.rowcount == 0:
            raise HTTPException(status_code=404, detail="email_group not found")
    return item

# -----------------------------
# clientLens_webscraping_info
# -----------------------------

@app.get("/api/webscraping-info", response_model=List[WebScrapingInfo])
def list_webscraping_info():
    with mssql_conn() as conn:
        cur = conn.cursor()
        cur.execute("""
            SELECT webscraping_id, website_url, client_name, webscraping_type, which_section_to_scrap_comments,
                   is_nested_site, xpath_at_website_root_level, max_depth_for_nested_check, files_to_look_for,
                   xpath_at_website_node_level, language, email_group, activated, matchwords,
                   download_with_sub_path, skip_downloads, skip_sending_email, is_tree_content,
                   is_llm_scraping_needed, domain_url, show_no_keywords_msg_in_email
            FROM dbo.clientLens_webscraping_info
            ORDER BY webscraping_id DESC;
        """)
        rows = cur.fetchall()
        return rows

@app.post("/api/webscraping-info", response_model=WebScrapingInfo, status_code=201)
def create_webscraping_info(item: WebScrapingInfo):
    with mssql_conn() as conn:
        cur = conn.cursor()
        cur.execute(
            """
            INSERT INTO dbo.clientLens_webscraping_info
            (website_url, client_name, webscraping_type, which_section_to_scrap_comments, is_nested_site,
             xpath_at_website_root_level, max_depth_for_nested_check, files_to_look_for, xpath_at_website_node_level,
             language, email_group, activated, matchwords, download_with_sub_path, skip_downloads, skip_sending_email,
             is_tree_content, is_llm_scraping_needed, domain_url, show_no_keywords_msg_in_email)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s);
            """,
            (
                item.website_url, item.client_name, item.webscraping_type, item.which_section_to_scrap_comments,
                int(item.is_nested_site),
                item.xpath_at_website_root_level, item.max_depth_for_nested_check, item.files_to_look_for,
                item.xpath_at_website_node_level, item.language, item.email_group, item.activated,
                item.matchwords, item.download_with_sub_path, int(item.skip_downloads),
                int(item.skip_sending_email), int(item.is_tree_content), int(item.is_llm_scraping_needed),
                item.domain_url, int(item.show_no_keywords_msg_in_email)
            )
        )
        cur.execute("SELECT SCOPE_IDENTITY() AS id;")
        new_id = cur.fetchone()["id"]
        item.webscraping_id = int(new_id)
    return item

@app.put("/api/webscraping-info/{webscraping_id}", response_model=WebScrapingInfo)
def update_webscraping_info(webscraping_id: int, item: WebScrapingInfo):
    with mssql_conn() as conn:
        cur = conn.cursor()
        cur.execute(
            """
            UPDATE dbo.clientLens_webscraping_info
               SET website_url=%s, client_name=%s, webscraping_type=%s, which_section_to_scrap_comments=%s,
                   is_nested_site=%s, xpath_at_website_root_level=%s, max_depth_for_nested_check=%s,
                   files_to_look_for=%s, xpath_at_website_node_level=%s, language=%s, email_group=%s,
                   activated=%s, matchwords=%s, download_with_sub_path=%s, skip_downloads=%s,
                   skip_sending_email=%s, is_tree_content=%s, is_llm_scraping_needed=%s, domain_url=%s,
                   show_no_keywords_msg_in_email=%s
               WHERE webscraping_id=%s
            """,
            (
                item.website_url, item.client_name, item.webscraping_type, item.which_section_to_scrap_comments,
                int(item.is_nested_site), item.xpath_at_website_root_level, item.max_depth_for_nested_check,
                item.files_to_look_for, item.xpath_at_website_node_level, item.language, item.email_group,
                item.activated, item.matchwords, item.download_with_sub_path, int(item.skip_downloads),
                int(item.skip_sending_email), int(item.is_tree_content), int(item.is_llm_scraping_needed),
                item.domain_url, int(item.show_no_keywords_msg_in_email), webscraping_id
            )
        )
        if cur.rowcount == 0:
            raise HTTPException(status_code=404, detail="webscraping_id not found")
    item.webscraping_id = webscraping_id
    return item
