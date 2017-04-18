Ext.define('QDT.store.IrdOpeartionCharacteristics', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.IrdCharacteristic',
  //  pageSize: 15,
    remoteSort: false,

    sorters: ['ird_characteristic.char_seq'],

    proxy: {
        type: 'direct',
        directFn: DpIrd.GetBOMCharacteristicsByIrdIdOperationNumber,
        paramsAsHash: true,
        simpleSortMode:true,
        reader: {
            type: 'json',
            root: 'data',
            totalProperty:'total'
        }
    }
});


 
   

