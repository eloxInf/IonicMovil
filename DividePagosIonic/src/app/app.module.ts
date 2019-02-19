import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { SQLite } from '@ionic-native/sqlite';
import { MyApp } from './app.component';
// PAGES
import { HomePage } from '../pages/home/home';
import { DetailExpensePage } from '../pages/detail-expense/detail-expense';
import { NewExpensePage } from '../pages/new-expense/new-expense';
import { NewPeoplePage } from '../pages/new-people/new-people';
import { SummaryExpensePage } from '../pages/summary-expense/summary-expense';
import { TabsExpensePage } from '../pages/tabs-expense/tabs-expense';

// SERVICES
import { ExpenseLocalBdProvider } from '../providers/expense-local-bd/expense-local-bd';



@NgModule({
  declarations: [
    MyApp,
    HomePage,
    DetailExpensePage,
    NewExpensePage,
    NewPeoplePage,
    SummaryExpensePage,
    TabsExpensePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    DetailExpensePage,
    NewExpensePage,
    NewPeoplePage,
    SummaryExpensePage,
    TabsExpensePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ExpenseLocalBdProvider,
    SQLite
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule {}
