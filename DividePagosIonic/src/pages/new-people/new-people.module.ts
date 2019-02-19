import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewPeoplePage } from './new-people';

@NgModule({
  declarations: [
    NewPeoplePage,
  ],
  imports: [
    IonicPageModule.forChild(NewPeoplePage),
  ],
})
export class NewPeoplePageModule {}
