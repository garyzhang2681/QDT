Ext.define('QDT.store.IrdOperations', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.IrdOperation',

    remoteSort: false,
    sorters: [{
        property: 'oper_num',
        direction: 'ASC'
    }]
  
});