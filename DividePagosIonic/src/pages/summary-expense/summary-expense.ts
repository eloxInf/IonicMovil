import { Component } from '@angular/core';
import { IonicPage, NavParams, ActionSheetController, AlertController } from 'ionic-angular';
import { ExpenseLocalBdProvider } from '../../providers/expense-local-bd/expense-local-bd';

/**
 * Generated class for the SummaryExpensePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-summary-expense',
  templateUrl: 'summary-expense.html',
})
export class SummaryExpensePage {
  public dataParameters;
  public listExPeople: any = [];
  public listPayment: any = [];

  constructor(
    public navParams: NavParams,
    public localBd: ExpenseLocalBdProvider,
    public actionSheetCtrl: ActionSheetController
    ) {
      let data = {
        idGroup: this.navParams.data.idGroup,
        descGroup: this.navParams.data.descGroup
      };
  
      this.dataParameters = data;
  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad SummaryExpensePage');
    this.InitialValues();
  }

  InitialValues() {
    this.GetListExPenseByPeople(this.dataParameters.idGroup);
    this.GetPaymentByPeople(this.dataParameters.idGroup);
  }

  GetListExPenseByPeople(idGropu) {
    this.localBd.GetTotalByPeople(idGropu)
      .then(AuxlistExPeople => {
        this.listExPeople = AuxlistExPeople;
        console.log(AuxlistExPeople);
      })
      .catch(error => {
        console.error(error);
      });
  }
  
  GetPaymentByPeople(idGroup)
  {
    this.localBd.GetPayment(idGroup)
      .then(payment => {
        this.listPayment = payment;
        console.log(payment);
      })
      .catch(error => {
        console.error(error);
      });
  }

}
