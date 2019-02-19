import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SummaryExpensePage } from '../summary-expense/summary-expense'
import { DetailExpensePage } from '../detail-expense/detail-expense'

/**
 * Generated class for the TabsExpensePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tabs-expense',
  templateUrl: 'tabs-expense.html',
})
export class TabsExpensePage {
  public dataParam;
  tab1Root = DetailExpensePage;
  tab2Root = SummaryExpensePage;
  
  constructor(public navParams: NavParams,) {
    this.dataParam = this.navParams.data;
  }

}
