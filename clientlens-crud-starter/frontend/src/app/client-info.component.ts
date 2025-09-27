import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { environment } from './environments/environment';

interface ClientInfo {
  client_name: string;
  client_full_name: string;
  client_sfid?: string;
  language?: string;
}

@Component({
  selector: 'app-client-info',
  standalone: true,
  imports: [CommonModule, TableModule, DialogModule, InputTextModule, ButtonModule, FormsModule],
  template: `
  <div class="card">
    <div class="toolbar">
      <button pButton label="Add" icon="pi pi-plus" (click)="openCreate()"></button>
      <button pButton label="Refresh" icon="pi pi-refresh" (click)="load()"></button>
    </div>
    <p-table [value]="rows" [paginator]="true" [rows]="10" [resizableColumns]="true" responsiveLayout="scroll">
      <ng-template pTemplate="header">
        <tr>
          <th pResizableColumn>Client Name</th>
          <th pResizableColumn>Full Name</th>
          <th pResizableColumn>SFID</th>
          <th pResizableColumn>Language</th>
          <th style="width:120px;"></th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-r>
        <tr>
          <td>{{r.client_name}}</td>
          <td>{{r.client_full_name}}</td>
          <td>{{r.client_sfid}}</td>
          <td>{{r.language}}</td>
          <td>
            <button pButton icon="pi pi-pencil" class="p-button-text" (click)="openEdit(r)"></button>
          </td>
        </tr>
      </ng-template>
    </p-table>
  </div>

  <p-dialog [(visible)]="dlgVisible" [modal]="true" [style]="{width:'500px'}" [header]="editing ? 'Edit Client' : 'Create Client'">
    <div class="p-fluid" style="display:grid;gap:.75rem;">
      <input pInputText placeholder="Client Name" [(ngModel)]="form.client_name">
      <input pInputText placeholder="Full Name" [(ngModel)]="form.client_full_name">
      <input pInputText placeholder="SFID" [(ngModel)]="form.client_sfid">
      <input pInputText placeholder="Language" [(ngModel)]="form.language">
    </div>
    <ng-template pTemplate="footer">
      <button pButton label="Cancel" class="p-button-text" (click)="dlgVisible=false"></button>
      <button pButton label="Save" (click)="save()"></button>
    </ng-template>
  </p-dialog>
  `
})
export class ClientInfoComponent implements OnInit {
  rows: ClientInfo[] = [];
  dlgVisible = false;
  editing = false;
  originalKey = '';
  form: ClientInfo = {client_name:'', client_full_name:'', client_sfid:'', language:''};

  constructor(private http: HttpClient) {}

  ngOnInit(){ this.load(); }

  load(){
    this.http.get<ClientInfo[]>(`${environment.apiBase}/client-info`).subscribe(r => this.rows = r);
  }

  openCreate(){
    this.editing = false;
    this.form = {client_name:'', client_full_name:'', client_sfid:'', language:''};
    this.dlgVisible = true;
  }

  openEdit(r: ClientInfo){
    this.editing = true;
    this.originalKey = r.client_name;
    this.form = JSON.parse(JSON.stringify(r));
    this.dlgVisible = true;
  }

  save(){
    if(this.editing){
      this.http.put<ClientInfo>(`${environment.apiBase}/client-info/${this.originalKey}`, this.form)
        .subscribe(() => { this.dlgVisible=false; this.load(); });
    }else{
      this.http.post<ClientInfo>(`${environment.apiBase}/client-info`, this.form)
        .subscribe(() => { this.dlgVisible=false; this.load(); });
    }
  }
}
