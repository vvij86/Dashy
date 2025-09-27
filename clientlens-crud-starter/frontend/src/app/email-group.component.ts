import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { environment } from './environments/environment';

interface EmailGroup {
  email_group: string;
  email_recipients?: string;
}

@Component({
  selector: 'app-email-group',
  standalone: true,
  imports: [CommonModule, TableModule, DialogModule, InputTextModule, ButtonModule, FormsModule],
  template: `
  <div class="card">
    <div class="toolbar">
      <button pButton label="Add" icon="pi pi-plus" (click)="openCreate()"></button>
      <button pButton label="Refresh" icon="pi pi-refresh" (click)="load()"></button>
    </div>
    <p-table [value]="rows" [paginator]="true" [rows]="10" responsiveLayout="scroll">
      <ng-template pTemplate="header">
        <tr>
          <th>Email Group</th>
          <th>Recipients (comma separated)</th>
          <th style="width:120px;"></th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-r>
        <tr>
          <td>{{r.email_group}}</td>
          <td>{{r.email_recipients}}</td>
          <td>
            <button pButton icon="pi pi-pencil" class="p-button-text" (click)="openEdit(r)"></button>
          </td>
        </tr>
      </ng-template>
    </p-table>
  </div>

  <p-dialog [(visible)]="dlgVisible" [modal]="true" [style]="{width:'600px'}" [header]="editing ? 'Edit Group' : 'Create Group'">
    <div class="p-fluid" style="display:grid;gap:.75rem;">
      <input pInputText placeholder="Email Group" [(ngModel)]="form.email_group">
      <input pInputText placeholder="Recipients (comma separated)" [(ngModel)]="form.email_recipients">
    </div>
    <ng-template pTemplate="footer">
      <button pButton label="Cancel" class="p-button-text" (click)="dlgVisible=false"></button>
      <button pButton label="Save" (click)="save()"></button>
    </ng-template>
  </p-dialog>
  `
})
export class EmailGroupComponent implements OnInit {
  rows: EmailGroup[] = [];
  dlgVisible = false;
  editing = false;
  originalKey = '';
  form: EmailGroup = {email_group:'', email_recipients:''};

  constructor(private http: HttpClient) {}

  ngOnInit(){ this.load(); }

  load(){
    this.http.get<EmailGroup[]>(`${environment.apiBase}/email-groups`).subscribe(r => this.rows = r);
  }

  openCreate(){
    this.editing = false;
    this.form = {email_group:'', email_recipients:''};
    this.dlgVisible = true;
  }

  openEdit(r: EmailGroup){
    this.editing = true;
    this.originalKey = r.email_group;
    this.form = JSON.parse(JSON.stringify(r));
    this.dlgVisible = true;
  }

  save(){
    if(this.editing){
      this.http.put<EmailGroup>(`${environment.apiBase}/email-groups/${this.originalKey}`, this.form)
        .subscribe(() => { this.dlgVisible=false; this.load(); });
    }else{
      this.http.post<EmailGroup>(`${environment.apiBase}/email-groups`, this.form)
        .subscribe(() => { this.dlgVisible=false; this.load(); });
    }
  }
}
