import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabsExpensePage } from './tabs-expense';

@NgModule({
  declarations: [
    TabsExpensePage,
  ],
  imports: [
    IonicPageModule.forChild(TabsExpensePage),
  ],
})
export class TabsExpensePageModule {}
