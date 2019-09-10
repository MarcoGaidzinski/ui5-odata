sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function (Controller, MessageToast, MessageBox) {
	"use strict";

	return Controller.extend("ovly.odata.controller.S0", {
		onInit: function () {
			this._list = this.byId("list"); // sap.m.List
			this._modelo = this.getOwnerComponent().getModel("fonte"); // v2.ODataModel
		},

		onSave: function (oEvent) {

			function onSuccess(oProdutoCriado, resposta) {
				MessageToast.show("Produto criado com ID" + oProdutoCriado.ID);
			}

			function onError(oError) {
				MessageBox.error("Erro:" + oError.responseText);
			}

			// criar variavel oNovoProduto
			// ID, Name, Description
			var oNovoProduto = {};
			oNovoProduto.ID = this.byId("produto_id").getValue();
			oNovoProduto.Name = this.byId("produto_nome").getValue();
			oNovoProduto.Description = this.byId("produto_descricao").getValue();

			var oParameters = {
				success: onSuccess,
				error: onError
			};
			// Capturar oDataModel
			// Chamar o .create
			this._modelo.create("/Products", oNovoProduto, oParameters);
		},

		onUpdate: function (oEvent) {

			function onSuccess() {
				MessageToast.show("Produto atualizado com sucesso");
			}

			function onError(oError) {
				MessageBox.error("Erro:" + oError.responseText);
			}

			// criar variavel oNovoProduto
			// ID, Name, Description
			var oNovoProduto = {};
			oNovoProduto.ID = this.byId("produto_id").getValue();
			oNovoProduto.Name = this.byId("produto_nome").getValue();
			oNovoProduto.Description = this.byId("produto_descricao").getValue();

			var oParameters = {
				success: onSuccess,
				error: onError
			};
			// Capturar oDataModel
			// Chamar o .create
			var sPath = this._modelo.createKey("Products", {
				ID: oNovoProduto.ID
			});
			this._modelo.update("/" + sPath, oNovoProduto, oParameters);
		},

		onItemPress: function (oEvent) {
			// alert("clicou no item");

			var oParameters = oEvent.getParameters();
			var oListItem = oParameters.listItem; // nao eh funcao - sap.m.StandardListItem
			var oListItemContext = oListItem.getBindingContext("fonte");
			// window._contexto = oListItemContext;

			this.byId("produto_id").setValue(oListItemContext.getProperty("ID"));
			this.byId("produto_nome").setValue(oListItemContext.getProperty("Name"));
			this.byId("produto_descricao").setValue(oListItemContext.getProperty("Description"));

		},

		onDelete: function (oEvent) {

			function onSuccess() {
				MessageToast.show("Produto atualizado com sucesso"); // <------
			}

			function onError(oError) {
				MessageBox.error("Erro:" + oError.responseText);
			}

			var oSettings = {
				success: onSuccess,
				error: onError
			};

			var oParameters = oEvent.getParameters();
			var oListItem = oParameters.listItem; // nao eh funcao - sap.m.StandardListItem
			var oListItemContext = oListItem.getBindingContext("fonte");
			var sPath = oListItemContext.getPath();

			this._modelo.remove(sPath, oSettings);
		},

		onSearch: function (oEvent) {
			var oListBinding = this._list.getBinding("items");
			var sQuery = oEvent.getParameters().query;

			if (sQuery === "") {
				oListBinding.filter();
			} else {
				var oFilter = new sap.ui.model.Filter({
					path: "Name",
					operator: sap.ui.model.FilterOperator.Contains,
					value1: sQuery
				});
				oListBinding.filter(oFilter);
			}

		},

		chamaAPI: function (oEvent) { // antigo onSearch

			var sPath = "/Products";
			var oParameters = {
				success: function (dados, resposta) {
					console.table(dados.results);

					for (var i = 0; i < dados.results.length; i++) {
						var oProduct = dados.results[i];

						this._list.addItem(new sap.m.StandardListItem({
							title: oProduct.ID,
							description: oProduct.Name,
							info: oProduct.Price
						}));
					}
				}.bind(this)
			};
			this._modelo.read(sPath, oParameters);

		}

	});
});