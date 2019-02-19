import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailExpensePage } from './detail-expense';

@NgModule({
  declarations: [
    DetailExpensePage,
  ],
  imports: [
    IonicPageModule.forChild(DetailExpensePage),
  ],
})
export class DetailExpensePageModule {}
