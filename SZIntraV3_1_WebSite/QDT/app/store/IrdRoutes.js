Ext.define('QDT.store.IrdRoutes', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.IrdRoute',
   
    proxy: {
        type: 'memory',
         reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total'
        }
    }
    
});