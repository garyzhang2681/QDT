Ext.define('Asz.ux.ExceptionBoard', {
    extend: 'Ext.window.Window',
    alias: 'widget.exceptionboard',
    autoShow: true,
    exceptionEvent: null,
    bodyPadding: 10,
    width: 555,
    layout:'anchor',

    initComponent: function () {
        var me = this;
        me.title = 'Exception Occurred';
        if (me.exceptionEvent) {
            me.items = [{
                xtype: 'displayfield',
                name: 'action',
                fieldLabel: 'Controller',
                value: me.exceptionEvent.action
            }, {
                xtype: 'displayfield',
                name: 'method',
                fieldLabel: 'Action',
                value: me.exceptionEvent.method
            }, {
                xtype: 'textarea',
                anchor: '100%',
                name: 'message',
                labelAlign: 'top',
                fieldLabel: 'Message',
                rows: 12,
                readOnly:true,
                value: me.exceptionEvent.message
            }];
        }
        me.callParent(arguments);
    }
});