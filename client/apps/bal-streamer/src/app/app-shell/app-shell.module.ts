import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppShellRoutingModule } from './app-shell-routing.module';
import { AppShellComponent } from './app-shell.component';

@NgModule({
  declarations: [AppShellComponent],
  imports: [CommonModule, AppShellRoutingModule],
  exports: [AppShellComponent],
})
export class AppShellModule {}
