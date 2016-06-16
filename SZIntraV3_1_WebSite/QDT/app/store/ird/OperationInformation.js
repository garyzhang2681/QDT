Ext.define('QDT.store.ird.OperationInformation', {
    extend: 'Ext.data.TreeStore',
    model: 'QDT.model.ird.OperationInformation',
    autoLoad:true,


    proxy: {
        type: 'direct',
        directFn: 'DpIrd.GetOperationsBySerialNumber',
        paramOrder: ['serial'],
       // paramsAsHash: true,
        reader: {
            type: 'json',
            root: 'data'
        }
    }

//        listeners: {
//            beforeload: function (store, records, options) {
//                Ext.apply(store.proxy.extraParams,
//                {
//                    serial: cq.query('irddetail textfield[name=serial]')[0].getValue()
//                });
//            }
//        }

   
});