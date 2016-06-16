Ext.define('QDT.store.cc.Ccs', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.cc.Cc',
 //   autoLoad:true,
    pageSize:27,
    proxy: {
        type:'direct',
        directFn:DpCc.GetCcs,
        reader: {
            type:'json',
            root:'data',
            totalProperty:'total'
        }   
    }
});