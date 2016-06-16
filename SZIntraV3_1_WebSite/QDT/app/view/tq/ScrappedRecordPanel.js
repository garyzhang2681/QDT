Ext.define('QDT.view.tq.ScrappedRecordPanel', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.scrappedrecordpanel',
    columns: [
    //可以在此处添加列
    ],
    initComponent: function () {
        var me = this;

        me.tbar = [{
            text: Profile.getText('Create'),
            xtype: 'button',
            iconCls: 'add_green',
            id: 'createScrappedRecord',
            handler: me.onCreateScrappedRecordClick
        }];
        me.callParent();
    },


    onCreateScrappedRecordClick: function () {
        var win = Ext.create('QDT.view.tq.CreateScrappedRecord');
        win.show();
    }
});





