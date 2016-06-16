Ext.define('QDT.store.Bools', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.Bool',

    data: [{
        name: 'True', value: 1
    }, {
        name:'False', value:0
    }]
});