
from pydantic import BaseModel, Field
from typing import Optional

# ---------- clientLens_client_info ----------
class ClientInfo(BaseModel):
    client_name: str = Field(..., max_length=255)
    client_full_name: str = Field(..., max_length=4000)
    client_sfid: Optional[str] = Field(None, max_length=255)
    language: Optional[str] = Field(None, max_length=10)

# ---------- clientLens_email_group ----------
class EmailGroup(BaseModel):
    email_group: str = Field(..., max_length=255)
    email_recipients: Optional[str]  # nvarchar(max)

# ---------- clientLens_webscraping_info ----------
class WebScrapingInfo(BaseModel):
    webscraping_id: Optional[int] = None
    website_url: str
    client_name: str
    webscraping_type: str
    which_section_to_scrap_comments: Optional[str] = None
    is_nested_site: bool
    xpath_at_website_root_level: Optional[str] = None
    max_depth_for_nested_check: int = 0
    files_to_look_for: Optional[str] = None
    xpath_at_website_node_level: Optional[str] = None
    language: Optional[str] = None
    email_group: Optional[str] = None
    activated: Optional[bool] = None
    matchwords: Optional[str] = None
    download_with_sub_path: Optional[str] = None
    skip_downloads: bool = False
    skip_sending_email: bool = False
    is_tree_content: bool = False
    is_llm_scraping_needed: bool = True
    domain_url: Optional[str] = None
    show_no_keywords_msg_in_email: bool = True
