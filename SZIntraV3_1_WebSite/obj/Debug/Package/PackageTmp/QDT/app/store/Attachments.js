Ext.define('QDT.store.Attachments', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.Attachment',
    autoDestroy:true,
    proxy: {
        type: 'direct',
        directFn: 'DpUtil.GetAttachedAttachments',
        paramOrder: ['ref_type', 'ref_num'],
        reader:{
            root:'data'
        }
    }
});