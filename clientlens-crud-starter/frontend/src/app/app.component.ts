import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { ClientInfoComponent } from './client-info.component';
import { EmailGroupComponent } from './email-group.component';
import { WebscrapingInfoComponent } from './webscraping-info.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TabViewModule, ButtonModule, ClientInfoComponent, EmailGroupComponent, WebscrapingInfoComponent],
  template: `
    <div class="container">
      <div class="header">
        <i class="pi pi-database" style="font-size:1.5rem;color:var(--brand)"></i>
        <h1>ClientLens Admin</h1>
      </div>
      <p-tabView>
        <p-tabPanel header="Client Info">
          <app-client-info></app-client-info>
        </p-tabPanel>
        <p-tabPanel header="Email Groups">
          <app-email-group></app-email-group>
        </p-tabPanel>
        <p-tabPanel header="Webscraping Info">
          <app-webscraping-info></app-webscraping-info>
        </p-tabPanel>
      </p-tabView>
    </div>
  `
})
export class AppComponent {}
