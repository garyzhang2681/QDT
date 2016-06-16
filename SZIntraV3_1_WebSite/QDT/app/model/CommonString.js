Ext.define("QDT.model.CommonString", {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'id', mapping: 'qdtComString.id'
    }, {
        name: 'category1', mapping: 'qdtComString.category_1'
    }, {
        name: 'category2', mapping: 'qdtComString.category_2'
    }, {
        name: 'common_string', mapping: 'qdtComString.' + Profile.getLang() + '_string'
    }]
});