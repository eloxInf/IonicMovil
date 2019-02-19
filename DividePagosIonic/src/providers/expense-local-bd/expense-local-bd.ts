import { Injectable } from '@angular/core';
import { SQLite } from '@ionic-native/sqlite';
import { SQLiteObject } from '@ionic-native/sqlite';
/*
  Generated class for the ExpenseLocalBdProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ExpenseLocalBdProvider {
  db: SQLiteObject = null;

  constructor(public sqlite: SQLite) {
    if (this.db == null) {
      this.CreateDatabase();
    }
  }

  // public methods

  private CreateDatabase() {
    console.log("Crear BD");

    let bdSet = {
      name: 'data.db',
      location: 'default' // the location field is required
    };

    //this.sqlite.deleteDatabase(bdSet);
    this.sqlite.create(bdSet)
      .then((db) => {
        return this.setDatabase(db);

      })
      .then(() => {
        return this.CreateTables();
      })
      .then(() => {
        return this.InsertTypeexpense();
      })
      .then(() => {
        //return this.InsertMasivePeople();
      })

      .catch(error => {
        console.error(error);
      });
  }
  setDatabase(db: SQLiteObject) {
    if (this.db === null) {
      this.db = db;
    }
  }


  CreateTables() {
    try {
      let sqlexpense =
        'CREATE TABLE IF NOT EXISTS expense' +
        '(  ID_expense                    integer                      PRIMARY KEY AUTOINCREMENT ,' +
        '  DES_EXPENSE                    text                           not null,' +
        '  ID_TYPE_EXP                    integer                        not null,' +
        '  ID_GROUP                       integer                        not null,' +
        '  ID_PEOPLE                      integer                        not null,' +
        '  DATE                           datetime                       not null,' +
        '  VALUE_EX                          integer                        not null,' +
        '  ID_STATUS                      integer                        not null,' +
        '  CREATED_BY                     integer                        not null)';

      this.db.executeSql(sqlexpense, []);

      let sqlTypeexpense = 'create table IF NOT EXISTS  TYPE_expense' +
        '(  ID_TYPE_EXP                    integer                        PRIMARY KEY AUTOINCREMENT,' +
        '  DES_TY_EXPEN                   text                           not null,' +
        '  ID_STATUS                      integer                        not null,' +
        '  CREATED_BY                     integer                        not null)';

      this.db.executeSql(sqlTypeexpense, []);

      let sqlGroup = 'create table IF NOT EXISTS  GROUP_EX' +
        '(  ID_GROUP                       integer                       PRIMARY KEY AUTOINCREMENT,' +
        '  DESC_GROUP                     TEXT                           not null,' +
        '  ID_STATUS                      INTEGER                        not null,' +
        '  CREATED_BY                     INTEGER                        not null)';

      this.db.executeSql(sqlGroup, []);

      let sqlPeople = 'create table IF NOT EXISTS  PEOPLE' +
        '( ID_PEOPLE                      integer                        PRIMARY KEY AUTOINCREMENT,' +
        '  NAME                           text                           not null,' +
        '  ID_STATUS                      INTEGER                        not null,' +
        ' CREATED_BY                     INTEGER                        not null)';
      this.db.executeSql(sqlPeople, []);

      let sqltemp = 'create table IF NOT EXISTS  TMP' +
        '( ID_PEOPLE                      integer                        not null,' +
        '  NAME                           text                           not null,' +
        '  SUM                            INTEGER                        not null,' +
        '  DIF                            INTEGER                        not null,' +
        '  percent                        INTEGER                        not null,' +
        '  TYPEQ                          INTEGER                        not null)';

      this.db.executeSql(sqltemp, []);

      let sqlGrupPeople = 'create table IF NOT EXISTS  GROUP_PEOPLE' +
        '( ID_GROUP                           integer                        not null,' +
        '  ID_PEOPLE                          INTEGER                        not null)';

      return this.db.executeSql(sqlGrupPeople, []);

    }
    catch (err) {
      console.log("Error :" + err);
    }

  }


  /// Pyment
  GetPayment(idGroup) {
    let sqlBaseinsert = "INSERT INTO tmp (ID_PEOPLE,  NAME, Sum,  DIF,  percent,  TYPEQ ) ";

    let sqlDelteTmp = "DELETE FROM TMP";
    this.db.executeSql(sqlDelteTmp, []);

    let sqlExpenseByGroup = sqlBaseinsert +
      "SELECT A.ID_PEOPLE, x.NAME, SUM(ifnull(b.VALUE_EX,0)) Sum,0 AS DIF, 0 AS percent, 1 AS TYPEQ " +
      "FROM GROUP_PEOPLE  A " +
      "INNER JOIN PEOPLE X ON A.ID_PEOPLE=X.ID_PEOPLE " +
      "LEFT JOIN EXPENSE B ON A.ID_PEOPLE=B.ID_PEOPLE and B.ID_GROUP=a.ID_GROUP  " +
      "WHERE a.ID_GROUP =? " +
      "GROUP BY A.ID_PEOPLE,x.NAME ";


    console.log(sqlExpenseByGroup);
    this.db.executeSql(sqlExpenseByGroup, [idGroup]);

    let sqlCalcDif = sqlBaseinsert +
      "SELECT A.ID_PEOPLE, A.NAME,  A.SUM , " +
      "( ( SELECT AVG(x.SUM)  FROM TMP x ) - A.SUM) DIF, " +
      "0 AS percent, " +
      "2 AS TYPEQ " +
      "FROM TMP A " +
      "WHERE A.TYPEQ = 1";

    console.log(sqlCalcDif);
    this.db.executeSql(sqlCalcDif, []);

    let sqlProvee = sqlBaseinsert +
      "SELECT A.ID_PEOPLE, A.NAME, A.SUM,  A.DIF * -1 DIF, " +
      " ( (A.DIF * -1) / " +
      " ( SELECT SUM(X.DIF * -1) " +
      " FROM TMP X WHERE X.TYPEQ = 2 AND " +
      " X.DIF <= 0 )) percent, " +
      " 3 AS TYPEQ " +
      " FROM tmp A  WHERE A.TYPEQ = 2 AND A.DIF < 0 ";
    console.log(sqlProvee);
    this.db.executeSql(sqlProvee, []);

    let sqlPeopleExpense = sqlBaseinsert +
      "SELECT A.ID_PEOPLE, A.NAME, A.SUM, A.DIF DIF,  0 percent, 4 AS TYPEQ " +
      "FROM tmp A WHERE A.TYPEQ = 2 AND A.DIF >= 0";

    console.log(sqlPeopleExpense);
    this.db.executeSql(sqlPeopleExpense, []);

    let sqlFinalCalc = "SELECT A.NAME NAME_EXPE, B.NAME NAME_PROV, B.DIF, " +
      "A.DIF * B.percent TOTAL_PAYMENT " +
      "FROM tmp A  CROSS JOIN  ( " +
      "SELECT *  FROM tmp B WHERE B.TYPEQ = 3 )  B " +
      "WHERE A.TYPEQ = 4";
    console.log(sqlFinalCalc);

    return this.db.executeSql(sqlFinalCalc, [])
      .then(response => {
        let finalCalc = [];
        for (let index = 0; index < response.rows.length; index++) {
          finalCalc.push(response.rows.item(index));
        }
        return Promise.resolve(finalCalc);
      })
      .catch(error => Promise.reject(error));

  }

  /// expenseE

  Insertexpense(expense: any) {
    try {
      let sql = 'INSERT INTO expense ( DES_EXPENSE,  ID_TYPE_EXP,  ID_GROUP,  ID_PEOPLE,  DATE, VALUE_EX,  ID_STATUS,  CREATED_BY)' +
        'VALUES (?, ?, ?, ?, ?, ?, ?,?)';
      return this.db.executeSql(sql,
        [expense.DES_EXPENSE,
        expense.ID_TYPE_EXP,
        expense.ID_GROUP,
        expense.ID_PEOPLE,
        expense.DATE,
        expense.VALUE_EX,
        expense.ID_STATUS,
        expense.CREATED_BY]);
    }
    catch (err) {
      console.log(err);
    }
  }

  GetAllexpense(ID_GROUP) {
    let sql = "SELECT " +
      "A.ID_expense, " +
      "A.DES_EXPENSE, " +
      "A.ID_TYPE_EXP, " +
      "D.DES_TY_EXPEN, " +
      "A.ID_GROUP, " +
      "B.DESC_GROUP, " +
      "A.ID_PEOPLE, " +
      "C.NAME, " +
      "A.DATE, " +
      "A.ID_STATUS, " +
      "A.CREATED_BY, " +
      "A.VALUE_EX " +
      "FROM EXPENSE A " +
      "INNER JOIN " +
      "GROUP_EX B ON A.ID_GROUP = B.ID_GROUP " +
      "INNER JOIN " +
      "PEOPLE C ON A.ID_PEOPLE = C.ID_PEOPLE " +
      "INNER JOIN " +
      "TYPE_EXPENSE D ON A.ID_TYPE_EXP = D.ID_TYPE_EXP " +
      "WHERE A.ID_GROUP = ?"
    return this.db.executeSql(sql, [ID_GROUP])
      .then(response => {
        let listexpense = [];
        for (let index = 0; index < response.rows.length; index++) {
          listexpense.push(response.rows.item(index));
        }
        return Promise.resolve(listexpense);
      })
      .catch(error => Promise.reject(error));
  }

  GetExpensesByGroup() {
    let sql = "SELECT  A.ID_GROUP, A.DESC_GROUP,  SUM(IFNULL(B.VALUE_EX,0))VALUE_EX " +
      "FROM GROUP_EX A " +
      "LEFT JOIN EXPENSE B ON A.ID_GROUP = B.ID_GROUP " +
      "GROUP BY A.ID_GROUP,A.DESC_GROUP ";

    return this.db.executeSql(sql, [])
      .then(response => {
        let listGroup = [];
        for (let index = 0; index < response.rows.length; index++) {
          listGroup.push(response.rows.item(index));
        }
        return Promise.resolve(listGroup);
      })
      .catch(error => Promise.reject(error));
  }

  DeleteExpense(idExpense) {
    let sql = 'DELETE FROM expense WHERE ID_expense=?';
    return this.db.executeSql(sql, [idExpense]);
  }

  Updateexpense(task: any) {
    let sql = 'UPDATE tasks SET title=?, completed=? WHERE id=?';
    return this.db.executeSql(sql, [task.title, task.completed, task.id]);
  }

  //// TYPE expense

  InsertTypeexpense() {
    try {
      let sql1 =
        "INSERT INTO TYPE_expense" +
        "(DES_TY_EXPEN," +
        " ID_STATUS," +
        " CREATED_BY)" +
        "VALUES ('Dividido'," +
        " 1," +
        " 1)";

      this.db.executeSql(sql1, []);

      let sql2 =
        "INSERT INTO TYPE_expense" +
        "(DES_TY_EXPEN," +
        " ID_STATUS," +
        " CREATED_BY)" +
        "VALUES ('Prestamo vane'," +
        " 1," +
        " 1)";

      this.db.executeSql(sql2, []);

      let sql3 =
        "INSERT INTO TYPE_expense" +
        "(DES_TY_EXPEN," +
        " ID_STATUS," +
        " CREATED_BY)" +
        "VALUES ('Prestamo Angelo'," +
        " 1," +
        " 1)";

      return this.db.executeSql(sql3, []);
    }
    catch (err) {
      console.log("Error :" + err);
    }
  }

  GetTypeexpense() {
    let sql = 'SELECT * FROM TYPE_expense';
    return this.db.executeSql(sql, [])
      .then(response => {
        let listTypeexpense = [];
        for (let index = 0; index < response.rows.length; index++) {
          listTypeexpense.push(response.rows.item(index));
        }
        return Promise.resolve(listTypeexpense);
      })
      .catch(error => Promise.reject(error));
  }

  //// GROUP

  InsertGroup(group) {
    try {
      let sql1 =
        " INSERT INTO [GROUP_EX]" +
        "(  DESC_GROUP," +
        "  ID_STATUS, " +
        "   CREATED_BY )" +
        "VALUES (" +
        "?," +
        "?," +
        "?)";

      return this.db.executeSql(sql1, [group.DESC_GROUP, group.ID_STATUS, group.CREATED_BY]);
    }
    catch (err) {
      console.log("Error :" + err);
    }
  }

  GetListGroup() {
    let sql = 'SELECT * FROM GROUP_EX';
    return this.db.executeSql(sql, [])
      .then(response => {
        let listGroup = [];
        for (let index = 0; index < response.rows.length; index++) {
          listGroup.push(response.rows.item(index));
        }
        return Promise.resolve(listGroup);
      })
      .catch(error => Promise.reject(error));
  }

  DeleteGroup(idGroup) {
    let sql = 'DELETE FROM GROUP_EX WHERE ID_GROUP=?';
    let sqlex = 'DELETE FROM expense WHERE ID_GROUP=?';
    this.db.executeSql(sqlex, [idGroup]);
    return this.db.executeSql(sql, [idGroup]);
  }

  /// Group People 
  InsertGroupPeople(idGroup, IdPeople) {

    try {
      let sqlG = "INSERT INTO GROUP_PEOPLE(ID_GROUP,ID_PEOPLE) VALUES (?,?)";
      return this.db.executeSql(sqlG, [idGroup, IdPeople]);
    }
    catch (erro) {
      console.log(erro);
    }

  }
  /// People
  InsertPeople(idGroup, people) {
    try {
      let sqlp = "INSERT INTO PEOPLE" +
        "(   NAME," +
        "ID_STATUS," +
        "CREATED_BY)" +
        "VALUES (" +
        "?," +
        "?," +
        "?)";

      return this.db.executeSql(sqlp, [people.NAME, people.ID_STATUS, people.CREATED_BY]);
    }
    catch (erro) {
      console.log(erro);
    }
  }

  DeletetPeople(idGroup, id) {
    try {
      let sqlp = "DELETE FROM PEOPLE WHERE ID_PEOPLE=?";
      let sqlg = "delete from GROUP_PEOPLE where ID_PEOPLE =? and ID_GROUP =?";
      let sqlx = "delete from expense where ID_PEOPLE =? and ID_GROUP =?";
      this.db.executeSql(sqlp, [id]);
      this.db.executeSql(sqlx, [id]);
      return this.db.executeSql(sqlg, [idGroup , id]);
    }
    catch (erro) {
      console.log(erro);
    }
  }

  InsertMasivePeople() {
    try {
      let sqlp = "INSERT INTO PEOPLE" +
        "(   NAME," +
        "ID_STATUS," +
        "CREATED_BY)" +
        "VALUES (" +
        "'Angelo'," +
        "1," +
        "1)";

      this.db.executeSql(sqlp, []);

      let sqlp2 = "INSERT INTO PEOPLE" +
        "(   NAME," +
        "ID_STATUS," +
        "CREATED_BY)" +
        "VALUES (" +
        "'Vane'," +
        "1," +
        "1)";

      this.db.executeSql(sqlp2, []);
    }
    catch (err) {
      console.log("Error :" + err);
    }
  }

  GetPeople(IdGroup) {
    let sql = "SELECT * FROM PEOPLE A " +
      "INNER JOIN GROUP_PEOPLE B ON A.ID_PEOPLE=B.ID_PEOPLE " +
      "WHERE B.ID_GROUP=? ";

    return this.db.executeSql(sql, [IdGroup])
      .then(response => {
        let listPeople = [];
        for (let index = 0; index < response.rows.length; index++) {
          listPeople.push(response.rows.item(index));
        }
        return Promise.resolve(listPeople);
      })
      .catch(error => Promise.reject(error));
  }

  GetTotalByPeople(idGroup) {
    let sql = "SELECT  A.ID_PEOPLE,  x.NAME,  SUM(IFNULL(B.VALUE_EX,0))VALUE_EX " +
      "FROM GROUP_PEOPLE  A " +
      "INNER JOIN PEOPLE X ON A.ID_PEOPLE=X.ID_PEOPLE " +
      "LEFT JOIN EXPENSE B ON A.ID_PEOPLE=B.ID_PEOPLE and B.ID_GROUP=A.ID_GROUP " +
      "WHERE A.ID_GROUP = ? " +
      "GROUP BY A.ID_PEOPLE,x.NAME ";

    return this.db.executeSql(sql, [idGroup])
      .then(response => {
        let listExpensePeople = [];
        for (let index = 0; index < response.rows.length; index++) {
          listExpensePeople.push(response.rows.item(index));
        }
        return Promise.resolve(listExpensePeople);
      })
      .catch(error => Promise.reject(error));


  }

}