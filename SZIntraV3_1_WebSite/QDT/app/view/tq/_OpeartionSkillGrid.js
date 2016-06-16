Ext.define('QDT.view.tq.OperationSkillGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.tq-operationskillgrid',
    store: 'OperationSkills',
    activeRecord: [],

    initComponent: function () {
        var me = this,
            store = Ext.StoreMgr.lookup(me.store);

        Ext.applyIf(me, {
            columns: [{
                xtype: 'rownumberer', width: 32
            }, {
                dataIndex: 'op', text: '工序<br/>OP', width: 50
            }, {
                dataIndex: 'type', text: '类型<br/>Type', width: 50
            }, {
                dataIndex: 'mode', text: '技能类型<br/>Mode', flex: 1
            }, {
                dataIndex: 'certify', text: '已认证<br/>Certified', width: 60
            }, {
                dataIndex: 'process', text: '培训中<br/>Training', width: 60
            }, {
                dataIndex: 'trainer', text: '培训师<br/>Trainer', width: 60
            }]
        });

        me.features = [{
            ftype: 'grouping',
            groupHeaderTpl: '{name}',
            hideGroupedHeader: true
        }];

        me.tbar = [{
            iconCls: 'excel',
            itemId: 'export',
            handler: function () {
                var item = me.activeRecord.data.item,
                    oper_num = me.activeRecord.data.oper_num;
                //window.open('../../KanBan/ExportSkillCertifyPerson?' + Ext.Object.toQueryString({ item: item, op: op }));
            }
        }, '->', {
            //TODO
            xtype: 'searchfield',
            name: 'item',
            emptyText: '搜索零件号',
            store: store
        }];

        me.bbar = {
            xtype: 'pagingtoolbar',
            store: store
        };

        me.callParent();

        me.on({
            selectionchange: me.onSelectionChange
        });
    },

    onSelectionChange: function (selModel, selected) {
        var me = this;
        me.activeRecord = selected[0];
        me.down('#export').setDisabled(selected.length === 0);
    }
})