import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { HelpRoutingModule } from './help-routing.module';
import { HelpComponent } from './help.component';

@NgModule({
  imports: [CommonModule, HelpRoutingModule, SharedModule],
  exports: [RouterModule],
  declarations: [HelpComponent]
})
export class HelpModule {}
