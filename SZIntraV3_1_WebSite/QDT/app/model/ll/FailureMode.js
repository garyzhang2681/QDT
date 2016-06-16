Ext.define('QDT.model.ll.FailureMode', {
    extend: 'Ext.data.Model',
    fields: [
    {
        name: 'mode_id'
    }, {
        name: 'failure_mode',mapping:'failure_mode_'+ Profile.getLang()
    }, {
        name: 'is_active'
    }
  
    ]
})