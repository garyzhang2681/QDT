Ext.define('QDT.store.IrdCharacteristics', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.IrdCharacteristic',
    pageSize: 10,
    remoteSort: true,
    remoteGroup: true
 //   groupField: 'ird_characteristic.oper_num'

//        proxy: {
//            type: 'memory',
//            reader: {
//                type: 'json'
//            }
//        }
//    proxy: {
//        type: 'direct',
//        directFn: DpIrd.GetCharacteristicsByPartNumber,
//        paramOrder: ['part_num'],
//        reader: {
//            type: 'json',
//            root: 'data',
//            totalProperty: 'total'
//        }
//    }
});


 
   

