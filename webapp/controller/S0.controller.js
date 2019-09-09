sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("ovly.odata.controller.S0", {
		onInit: function () {
			this._list = this.byId("list"); // sap.m.List
			this._modelo = this.getOwnerComponent().getModel("fonte"); // v2.ODataModel
		},

		onSave: function (oEvent) {
			// criar variavel oNovoProduto
			// ID, Name, Description
			var oNovoProduto = {};
			oNovoProduto.ID = this.byId("produto_id").getValue();
			oNovoProduto.Name = this.byId("produto_nome").getValue();
			oNovoProduto.Description = this.byId("produto_descricao").getValue();
			oNovoProduto.Price = this.byId("produto_price").getValue();
			// Capturar oDataModel
			// Chamar o .create
			this._modelo.create("/Products", oNovoProduto);
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