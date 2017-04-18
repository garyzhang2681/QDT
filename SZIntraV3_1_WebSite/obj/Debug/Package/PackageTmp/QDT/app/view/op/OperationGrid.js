Ext.define('QDT.view.op.OperationGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.op-operationgrid',

    initComponent: function () {
        var me = this,
            store = Ext.create('QDT.store.op.Operations');

        Ext.apply(me, {
            store: store,
           
            activeRecords: [],
            columns: [{
                dataIndex: 'item', text: Profile.getText('item'), width: 120
            }, {
                dataIndex: 'oper_num', text: Profile.getText('oper_num'), width: 65
            }, {
                dataIndex: 'wc', text: Profile.getText('wc'), width: 80
            }, {
                dataIndex: 'wc', text: Profile.getText('WcDescription'), flex: 1, renderer: QDT.util.Renderer.wcDescription
            }]
        });

        Ext.applyIf(me, {
            tbar: [{
                iconCls: 'add_green',
                text: Profile.getText('AddOperationalRestriction'),
                xtype: 'button',
                itemId: 'add-restriction',
                disabled: true
            }, '->', {
                xtype: 'searchfield',
                store: store,
                width: 200,
                emptyText: Profile.getText('Search')
            }],
            bbar: {
                xtype: 'pagingtoolbar',
                store: store,
                displayInfo: true
            }
        });



        me.callParent();
    }
});