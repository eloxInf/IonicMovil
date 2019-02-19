import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, ActionSheetController, AlertController, NavParams  } from 'ionic-angular';
import { ExpenseLocalBdProvider } from '../../providers/expense-local-bd/expense-local-bd';

/**
 * Generated class for the NewPeoplePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-new-people',
  templateUrl: 'new-people.html',
})
export class NewPeoplePage {
  public oldClassSelected = "";
  public listPeople: any = [];
  public namePeople = "";
  public selectNamePeople = "";
  public dataParam;
  constructor(
    public navCtrl: NavController,
    private toastCtrl: ToastController,
    public actionSheetCtrl: ActionSheetController,
    public localBd: ExpenseLocalBdProvider,
    private alertController : AlertController,
    public navParams: NavParams,
    ) {
      this.dataParam = this.navParams.data;
  }

  ionViewDidEnter() {
    this.GetInitialValue();
  }

  EnterEvent() {
    if (this.namePeople != "") {
      let newPeople = {
        ID_PEOPLE: 1,
        NAME: this.namePeople,
        ID_STATUS: 1,
        CREATED_BY: 1
      }

      this.AddNewpPeople(newPeople);
      this.ShowTopMessage("Nuevo Grupo '" + this.namePeople + "' Creado !!" );
      this.namePeople = "";
    }
  }

  public GetInitialValue(){
    this.GetListPeople();
  }

  public DeletePeople(idPeople){

      this.localBd.DeletetPeople(this.dataParam.idGroup, idPeople)
        .then(datePeople => {
          console.log(datePeople);
          this.GetListPeople();
        })
        .catch(error => {
          console.error(error);
        });
  }

  public AddNewpPeople(newPeople) {
    this.localBd.InsertPeople(this.dataParam.idGroup, newPeople)
      .then(newPople => {
        console.log(newPople);
        this.localBd.InsertGroupPeople(this.dataParam.idGroup, newPople.insertId)
        .then(newGroupPople => {
          console.log(newGroupPople);
          this.GetListPeople();
        })
        .catch(error => {
          console.error(error);
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  GetListPeople() {
    this.localBd.GetPeople(this.dataParam.idGroup)
      .then(listPeople => {
        this.listPeople = listPeople;
        console.log(listPeople);
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
      message: '¿Vas a eliminar la persona ' + this.selectNamePeople+ '?',
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
            this.DeletePeople(idrow);
          }
        }
      ]
    });

    await alert.present();
  }
  public ShowMenuOptions(idrow) {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Opciones de Grupo',
      buttons: [{
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
    private GetTextFromPeopleId(idPeople) {
    let findPeople: any = this.listPeople.filter(item =>
      item.ID_PEOPLE == idPeople
    );

    return findPeople[0].NAME;
  }
  
  public ChangeRowPeople(idPeople) {
    this.selectNamePeople = this.GetTextFromPeopleId(idPeople);
    var idrow = "grd-people-" + idPeople;
    var rowGrid = document.getElementById(idrow);
    rowGrid.classList.add('gridRowSelected');
    this.ShowMenuOptions(idPeople);
  }

  ResetColorSelectedGrid(id) {
    var idrow = "grd-people-" + id;
    var rowGrid = document.getElementById(idrow);
    rowGrid.classList.remove('gridRowSelected');
  }

}