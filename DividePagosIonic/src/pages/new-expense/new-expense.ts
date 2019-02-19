import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import  {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ExpenseLocalBdProvider } from '../../providers/expense-local-bd/expense-local-bd';

/**
 * Generated class for the NewExpensePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-new-expense',
  templateUrl: 'new-expense.html',
})
export class NewExpensePage {
  public dataParam;
  public frmNewexpese : FormGroup;
  public listPeople: any = [];
  public listTypeexpense: any = [];
  public listGroup = [];
  constructor(
    public navCtrl: NavController,
     public navParams: NavParams,
      public viewCtrl : ViewController,
      private formBuilder: FormBuilder,
      public localBd : ExpenseLocalBdProvider
       )
  {
    this.GetInitialValues();
  }

  GetInitialValues(){
    this.dataParam = this.navParams.data;
    this.frmNewexpese = this.formBuilder.group({
      descExpense: ['', Validators.required],
      typeExpense: [1, Validators.required],
      descGroup : [this.dataParam.desGroup],
      people: [1 ,Validators.required],
      valueEx: [Validators.required]
    });
    
    // Obtiene listado de personas
        this.localBd.GetPeople(this.dataParam.idGroup)
        .then(listPeople => {
          this.listPeople = listPeople;
          console.log(listPeople);
        })
        .catch(error => {
          console.error(error);
        });

    // Obtiene listado de typo de gastos
      this.localBd.GetTypeexpense()
      .then(typeExpensive => {
        this.listTypeexpense = typeExpensive;
        console.log(typeExpensive);
      })
      .catch(error => {
        console.error(error);
      });

    console.log(this.frmNewexpese.value);
  }

  public AddNewexpense()
  {
    if(this.frmNewexpese.valid)
    {
      console.log("Formulario Gastos :" + this.frmNewexpese );

      var dateNow = new Date()
      let date = dateNow.toISOString();

      let expense = {
        ID_expense:0,
        DES_EXPENSE:this.frmNewexpese.value.descExpense,
        ID_TYPE_EXP:this.frmNewexpese.value.typeExpense,
        ID_GROUP: this.dataParam.idGroup,
        ID_PEOPLE:this.frmNewexpese.value.people,
        DATE: date,
        VALUE_EX: this.frmNewexpese.value.valueEx,
        ID_STATUS:0,
        CREATED_BY:0
      }

      this.localBd.Insertexpense(expense)
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.error(error);
      });
      
      this.navCtrl.pop();
    }
  }
}
