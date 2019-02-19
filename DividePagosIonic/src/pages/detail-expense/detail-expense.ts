import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular';
import { ExpenseLocalBdProvider } from '../../providers/expense-local-bd/expense-local-bd';
import { NewExpensePage } from '../../pages/new-expense/new-expense';
import { SummaryExpensePage } from '../../pages/summary-expense/summary-expense'
import { NewPeoplePage } from '../../pages/new-people/new-people'
/**
 * Generated class for the DetailExpensePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detail-expense',
  templateUrl: 'detail-expense.html',
})
export class DetailExpensePage {
  public idExpense;
  public dataParameters;
  public listexpense: any = [];
  

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public localBd: ExpenseLocalBdProvider,
    public actionSheetCtrl: ActionSheetController,
    private alertController : AlertController 
  ) {
    let data = {
      idGroup: this.navParams.data.idGroup,
      descGroup: this.navParams.data.descGroup
    };

    this.dataParameters = data;
  }

  ionViewDidEnter() {
    this.InitialValues();
  }

  InitialValues() {

    this.GetListexpense(this.dataParameters.idGroup);
  }

  GoToNewPeople() {
    this.navCtrl.push(NewPeoplePage, this.dataParameters);
  }

  
  GoToSummaryExp()
  {
    this.navCtrl.push(SummaryExpensePage, this.dataParameters);
  }
  ClicExpense(idExpense) {
    this.idExpense = idExpense;
    this.ChangeColorSelectedGrid(idExpense);
    this.ShowMenuOptions(idExpense);
  }

  GoToNewExpense() {
    this.navCtrl.push(NewExpensePage, this.dataParameters);
  }


  DeleteExpense(idExpense){
    this.localBd.DeleteExpense(idExpense)
      .then(deleteExpense => {
        this.GetListexpense(this.dataParameters.idGroup);
        console.log(deleteExpense);
      })
      .catch(error => {
        console.error(error);
      });

  }


  GetListexpense(idGropu) {
    this.localBd.GetAllexpense(idGropu)
      .then(listexpense => {
        this.listexpense = listexpense;
        console.log(listexpense);
      })
      .catch(error => {
        console.error(error);
      });
  }

  async ConfirmDelete(idrow) {
    const alert = await this.alertController.create({      
      message: '¿Vas a eliminar el gasto?' ,
      buttons: [
        {
          text: 'no',
          role: 'no',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
            this.ResetColorSelectedGrid(idrow);
          }
        }, {
          text: 'si',
          handler: () => {
            console.log('Confirm Okay');
            this.ResetColorSelectedGrid(idrow);
            this.DeleteExpense(idrow);
          }
        }
      ]
    });

    await alert.present();
  }
  public ShowMenuOptions(idrow) {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Opciones de gasto',
      buttons: [
        {
          text: 'Eliminar',
          handler: () => {
            console.log('Archive clicked');
            this.ConfirmDelete(idrow);
          }
        }, {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
            this.ResetColorSelectedGrid(idrow);
          }
        }
      ]
    });
    actionSheet.present();
  }

  ResetColorSelectedGrid(id) {
    var idrow = "grdexpense-" + id;
    var rowGrid = document.getElementById(idrow);
    rowGrid.classList.remove('gridRowSelected');
  }

  ChangeColorSelectedGrid(id) {
    var idrow = "grdexpense-" + id;
    var rowGrid = document.getElementById(idrow);
    rowGrid.classList.add('gridRowSelected');
  }

  goBack() {
    this.navCtrl.pop();
  }
}
