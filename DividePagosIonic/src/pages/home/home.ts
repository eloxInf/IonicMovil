import { CUSTOM_ELEMENTS_SCHEMA , Component } from '@angular/core';
import { NavController, ToastController, ActionSheetController, AlertController  } from 'ionic-angular';
import { ExpenseLocalBdProvider } from '../../providers/expense-local-bd/expense-local-bd';
import { TabsExpensePage } from '../../pages/tabs-expense/tabs-expense';
import { DetailExpensePage } from '../../pages/detail-expense/detail-expense';
import { SummaryExpensePage } from '../../pages/summary-expense/summary-expense'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public oldClassSelected = "";
  public listGroup: any = [];
  public nameGroup = "";
  public selectTextGroup = "";
  constructor(
    public navCtrl: NavController,
    private toastCtrl: ToastController,
    public actionSheetCtrl: ActionSheetController,
    public localBd: ExpenseLocalBdProvider,
    private alertController : AlertController 
    ) {

  }

  GoToSummaryExp(idGroup)
  {
    let data = {
      idGroup: idGroup,
      descGroup: this.selectTextGroup
    }

    this.navCtrl.push(SummaryExpensePage, data);
  }

  ionViewDidEnter() {
    this.GetInitialValue();
  }

  EnterEvent() {
    if (this.nameGroup != "") {
      let newGroup = {
        ID_GROUP: 1,
        DESC_GROUP: this.nameGroup,
        ID_STATUS: 1,
        CREATED_BY: 1
      }

      this.AddNewGroup(newGroup);
      this.ShowTopMessage("Nuevo Grupo '" + this.nameGroup + "' Creado !!" );
      this.nameGroup = "";
    }
  }

  public GetInitialValue(){
    this.GetExpensiveByGroup();
  }

  public GoToExpenseDetails(idGroup)
  {
    let data = {
      idGroup: idGroup,
      descGroup: this.selectTextGroup
    }

    this.navCtrl.push(DetailExpensePage, data);
  }

  public DeleteGroup(idGroup){

      this.localBd.DeleteGroup(idGroup)
        .then(newGrop => {
          console.log(newGrop);
          this.GetExpensiveByGroup();
        })
        .catch(error => {
          console.error(error);
        });
  }

  public AddNewGroup(newGroup) {
    this.localBd.InsertGroup(newGroup)
      .then(newGrop => {
        console.log(newGrop);
        this.GetExpensiveByGroup();
      })
      .catch(error => {
        console.error(error);
      });
  }

  GetExpensiveByGroup() {
    this.localBd.GetExpensesByGroup()
      .then(listGroupout => {
        this.listGroup = listGroupout;
        console.log(listGroupout);
      })
      .catch(error => {
        console.error(error);
      });
  }

  ShowTopMessage(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  async ConfirmDelete(idrow) {
    const alert = await this.alertController.create({      
      message: '¿Vas a eliminar el grupo ' + this.selectTextGroup + '?',
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
            this.DeleteGroup(idrow);
          }
        }
      ]
    });

    await alert.present();
  }
  public ShowMenuOptions(idrow) {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Opciones de Grupo',
      buttons: [
        {
          text: 'Detalle Gastos',
          role: 'destructive',
          handler: () => {
            console.log('Agregar Gastos');
            this.ResetColorSelectedGrid(idrow);
            this.GoToExpenseDetails(idrow);
          }
        },
        {
          text: 'Ver Resumen',
          role: 'destructive',
          handler: () => {
            console.log('Ver resumen');
            this.GoToSummaryExp(idrow);
          }
        }, {
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
    private GetTextFromGroupId(groupId) {
    let findGroup: any = this.listGroup.filter(item =>
      item.ID_GROUP == groupId
    );

    return findGroup[0].DESC_GROUP;
  }
  
  public ChangeRowGroup(idGroup) {
    this.selectTextGroup = this.GetTextFromGroupId(idGroup);
    var idrow = "grd-group-" + idGroup;
    var rowGrid = document.getElementById(idrow);
    rowGrid.classList.add('gridRowSelected');
    this.ShowMenuOptions(idGroup);
  }

  ResetColorSelectedGrid(id) {
    var idrow = "grd-group-" + id;
    var rowGrid = document.getElementById(idrow);
    rowGrid.classList.remove('gridRowSelected');
  }

}
