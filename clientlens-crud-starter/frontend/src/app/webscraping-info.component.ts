import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { environment } from './environments/environment';

interface WebScrapingInfo {
  webscraping_id?: number;
  website_url: string;
  client_name: string;
  webscraping_type: string;
  which_section_to_scrap_comments?: string;
  is_nested_site: boolean;
  xpath_at_website_root_level?: string;
  max_depth_for_nested_check: number;
  files_to_look_for?: string;
  xpath_at_website_node_level?: string;
  language?: string;
  email_group?: string;
  activated?: boolean;
  matchwords?: string;
  download_with_sub_path?: string;
  skip_downloads: boolean;
  skip_sending_email: boolean;
  is_tree_content: boolean;
  is_llm_scraping_needed: boolean;
  domain_url?: string;
  show_no_keywords_msg_in_email: boolean;
}

@Component({
  selector: 'app-webscraping-info',
  standalone: true,
  imports: [CommonModule, TableModule, DialogModule, InputTextModule, InputSwitchModule, ButtonModule, FormsModule],
  template: `
  <div class="card">
    <div class="toolbar">
      <button pButton label="Add" icon="pi pi-plus" (click)="openCreate()"></button>
      <button pButton label="Refresh" icon="pi pi-refresh" (click)="load()"></button>
    </div>
    <p-table [value]="rows" [paginator]="true" [rows]="10" responsiveLayout="scroll">
      <ng-template pTemplate="header">
        <tr>
          <th>ID</th>
          <th>Website URL</th>
          <th>Client</th>
          <th>Type</th>
          <th>Activated</th>
          <th style="width:120px;"></th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-r>
        <tr>
          <td>{{r.webscraping_id}}</td>
          <td>{{r.website_url}}</td>
          <td>{{r.client_name}}</td>
          <td>{{r.webscraping_type}}</td>
          <td>{{r.activated}}</td>
          <td>
            <button pButton icon="pi pi-pencil" class="p-button-text" (click)="openEdit(r)"></button>
          </td>
        </tr>
      </ng-template>
    </p-table>
  </div>

  <p-dialog [(visible)]="dlgVisible" [modal]="true" [style]="{width:'700px'}" [header]="editing ? 'Edit Webscraping Info' : 'Create Webscraping Info'">
    <div class="p-fluid" style="display:grid;gap:.75rem;">
      <input pInputText placeholder="Website URL" [(ngModel)]="form.website_url">
      <input pInputText placeholder="Client Name" [(ngModel)]="form.client_name">
      <input pInputText placeholder="Webscraping Type" [(ngModel)]="form.webscraping_type">
      <input pInputText placeholder="Language" [(ngModel)]="form.language">
      <input pInputText placeholder="Email Group" [(ngModel)]="form.email_group">
      <div>
        <span>Activated</span>
        <p-inputSwitch [(ngModel)]="form.activated"></p-inputSwitch>
      </div>
    </div>
    <ng-template pTemplate="footer">
      <button pButton label="Cancel" class="p-button-text" (click)="dlgVisible=false"></button>
      <button pButton label="Save" (click)="save()"></button>
    </ng-template>
  </p-dialog>
  `
})
export class WebscrapingInfoComponent implements OnInit {
  rows: WebScrapingInfo[] = [];
  dlgVisible = false;
  editing = false;
  form: WebScrapingInfo = {
    website_url:'', client_name:'', webscraping_type:'',
    is_nested_site:false, max_depth_for_nested_check:0,
    skip_downloads:false, skip_sending_email:false, is_tree_content:false,
    is_llm_scraping_needed:true, show_no_keywords_msg_in_email:true
  };

  constructor(private http: HttpClient) {}

  ngOnInit(){ this.load(); }

  load(){
    this.http.get<WebScrapingInfo[]>(`${environment.apiBase}/webscraping-info`).subscribe(r => this.rows = r);
  }

  openCreate(){
    this.editing = false;
    this.form = {
      website_url:'', client_name:'', webscraping_type:'',
      is_nested_site:false, max_depth_for_nested_check:0,
      skip_downloads:false, skip_sending_email:false, is_tree_content:false,
      is_llm_scraping_needed:true, show_no_keywords_msg_in_email:true
    };
    this.dlgVisible = true;
  }

  openEdit(r: WebScrapingInfo){
    this.editing = true;
    this.form = JSON.parse(JSON.stringify(r));
    this.dlgVisible = true;
  }

  save(){
    if(this.editing && this.form.webscraping_id){
      this.http.put<WebScrapingInfo>(`${environment.apiBase}/webscraping-info/${this.form.webscraping_id}`, this.form)
        .subscribe(() => { this.dlgVisible=false; this.load(); });
    }else{
      this.http.post<WebScrapingInfo>(`${environment.apiBase}/webscraping-info`, this.form)
        .subscribe(() => { this.dlgVisible=false; this.load(); });
    }
  }
}
