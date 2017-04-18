Ext.define('QDT.view.tq.ProcessApproverPicker', {
    extend: 'Ext.window.Window',
    alias: 'widget.tq-processapproverpicker',
    requires: [
    ],
    sourceStore: null,
    targetStore: null,
    columnConfig: [],
    modal: true,
    autoShow: true,
    callback: null,
    selectedUserIds: [],

    initComponent: function () {
        var me = this,
            nativeUserGrid = Ext.widget('grid', {
                flex: 1,
                selType: 'checkboxmodel',
                title: Profile.getText('AvailableApprovers'),
                itemId: 'source-grid',
                store: me.sourceStore,
                hideHeaders: true,
                viewConfig: {
                    plugins: [{
                        ptype: 'gridviewdragdrop',
                        ddGroup: 'approver-picker',
                        dragGroup: 'source-grid',
                        dropGroup: 'selected-user'
                    }]
                },
                columns: me.columnConfig
            }),
            selectedGrid = Ext.widget('grid', {
                flex: 1,
                selType: 'checkboxmodel',
                title: Profile.getText('SelectedApprovers'),
                itemId: 'selected-user',
                store: me.targetStore,
                hideHeaders: true,
                viewConfig: {
                    plugins: [{
                        ptype: 'gridviewdragdrop',
                        ddGroup: 'approver-picker',
                        dropGroup: 'source-grid',
                        dragGroup: 'selected-user'
                    }]
                },
                columns: me.columnConfig
            }),
            selectedUserStore;

        Ext.apply(me, {
            width: 620,
            height: 300,
            layout: 'fit',
            items: [{
                xtype: 'panel',
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                items: [nativeUserGrid, selectedGrid]
            }],
            buttons: [{
                text: Profile.getText('Ok'),
                handler: function () {
                    me.callback(me.selectedUserIds);
                }
            }]
        });


        me.callParent();

        selectedUserStore = selectedGrid.store;
        selectedUserStore.mon(selectedUserStore, {
            destroyable: true,
            datachanged: function () {
                me.selectedUserIds=[];
                selectedUserStore.each(function (record) {
                    me.selectedUserIds.push(record.data.user_id);
                });
            }
        });
    }
});