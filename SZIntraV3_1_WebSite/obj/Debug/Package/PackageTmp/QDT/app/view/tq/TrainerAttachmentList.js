Ext.define('QDT.view.tq.TrainerAttachmentList', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.tq-trainerattachmentlist',

    frame: true,

    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            bodyPadding: 10,
            layout: 'fit',
            items: [{
                xtype: 'fieldset',
                name: 'attachment_list',
                itemId: 'attachment_list',
                title: Profile.getText('attachment'),
                collapsible: true,
                layout: 'anchor'
              
            }]
        });

        me.callParent();
    }


});