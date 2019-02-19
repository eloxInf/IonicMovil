import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SummaryExpensePage } from './summary-expense';

@NgModule({
  declarations: [
    SummaryExpensePage,
  ],
  imports: [
    IonicPageModule.forChild(SummaryExpensePage),
  ],
})
export class SummaryExpensePageModule {}
