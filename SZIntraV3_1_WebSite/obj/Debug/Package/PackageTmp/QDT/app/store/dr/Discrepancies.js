Ext.define('QDT.store.dr.Discrepancies', {
    extend:'Ext.data.Store',
    model:'QDT.model.dr.Discrepancy',

    proxy: {
        type:'direct',
        directFn:QDT.GetDiscrepancyByDrNumber,
        paramOrder:['dr_num'],
        reader: {
            type:'json',
            root:'data'
        }
    }
});