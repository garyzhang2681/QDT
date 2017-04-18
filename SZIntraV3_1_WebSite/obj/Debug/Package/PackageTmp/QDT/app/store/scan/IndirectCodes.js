Ext.define('QDT.store.scan.IndirectCodes', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.scan.IndirectCode',
   
    proxy: {
        type: 'direct',
        directFn: 'DpScan.GetIndirectCode',
        reader: {
            type:'json',
            root:'data'
        }
    }
});