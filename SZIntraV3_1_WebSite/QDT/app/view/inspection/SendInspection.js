Ext.define('QDT.view.inspection.SendInspection', {
    extend: 'Ext.window.Window',
    alias: 'widget.inspection-sendinspection',
    width: 300,
    modal: true,
    resizable: false,
    create_by: null,
    create_by_name: null,
    border: false,
    initComponent: function () {
        var me = this;
        me.title = Profile.getText('SendInspection');
        var defaultInspection = Ext.create('QDT.view.inspection.DefaultInspection', {
            create_by: me.create_by,
            create_by_name: me.create_by_name
        });
        var customInspection = Ext.create('QDT.view.inspection.CustomInspection', {
            create_by: me.create_by,
            create_by_name: me.create_by_name
        });
        me.items = [{
            xtype: 'tabpanel',
            border: false,
            frame: true,
            items: [{
                title: Profile.getText('PartInspection'),
                items: [defaultInspection]
            }, {
                title: Profile.getText('CustomInspection'),
                items: [customInspection]
            }]
        }];

        me.callParent();
    }
});