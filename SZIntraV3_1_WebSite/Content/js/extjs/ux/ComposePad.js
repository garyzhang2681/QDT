Ext.define('Asz.ux.ComposePad', {
    extend: 'Ext.window.Window',
    alias: 'widget.composepad',
    requires:[
        'Asz.util.Config'  
    ],

    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            layout: 'fit',
            modal:true,
            width: 600,
            height: 320,
            autoShow: true,
            items: [{
                xtype: 'htmleditor',
                fontFamilies: Asz.util.Config.fontFamilies
            }],
            buttons: [{
                iconCls: 'submit',
                text: Profile.getText('Submit')
            }, {
                iconCls: 'cancel',
                text: Profile.getText('Cancel')
            }]
        });


        me.callParent();
    }
});