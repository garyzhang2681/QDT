Ext.define('QDT.store.IrdRecordTypes', {
    extend:'Ext.data.Store',
    model: 'QDT.model.IrdRecordType',
    data:[{
        record_type:'range'
    },{
        record_type:'value'
    },{
        record_type:'pass'
    }]
});