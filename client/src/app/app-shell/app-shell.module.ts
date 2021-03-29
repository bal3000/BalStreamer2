import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppShellComponent } from './app-shell.component';
import { AppShellRoutingModule } from './app-shell-routing.module';

@NgModule({
  declarations: [AppShellComponent],
  imports: [CommonModule, AppShellRoutingModule],
  exports: [AppShellComponent],
})
export class AppShellModule {}
