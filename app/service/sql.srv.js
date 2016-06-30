/**
*@author : sbhardwa@adobe.com
* v1.0
* This contains service to handle WebSQL. (Browser Cache Implementation)
**/

(function(){
	var db = openDatabase("USER","USER",1.0,1*1024*1024);
	angular.module("sql_module",[]);
	angular.module("sql_module").service("SQLService",function(){
			
			this.init = function(){
				db.transaction(function(tx){
					tx.executeSql("CREATE TABLE USER (NAME TEXT PRIMARY KEY, PRICE INT, ITEM INT,RID INT)");
				});
			}
			
			this.add = function(name,price,item,rid){
				db.transaction(function(tx){
					tx.executeSql("INSERT INTO USER (NAME,PRICE,ITEM,RID) VALUES (?,?,?,?);",[name,price,item,rid]);
				});
			}
			
			this.deleteTable = function(){
				db.transaction(function(tx){
					tx.executeSql("DROP TABLE USER");
				});
			}

			this.deleteRow = function(name){
				db.transaction(function(tx){
					tx.executeSql("DELETE from USER WHERE NAME = ?",[name]);
				});
			}

			this.retrieveAll = function(callback){
				db.transaction(function(tx){
					tx.executeSql("SELECT * FROM USER",[],callback);
				});
			}

			
		
	});

})();