Ext.define('QDT.view.dr.DiscrepancyGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.discrepancy-grid',
    title: Profile.getText('discrepancy'),
    width: 300,
    height: 200,
    xtype: 'cell-editing',
    //   autoScroll: true,
    overflowY: 'auto',
    viewConfig: {// 自动充满表格
        autoFill: true,
        forceFit: true
    },
    initComponent: function () {
        var me = this;

        this.cellEditing = new Ext.grid.plugin.CellEditing({
            clicksToEdit: 1
        });

        Ext.apply(this, {

            plugins: [this.cellEditing],
            columns: [{
                header: 'id',
                dataIndex: 'disc_id',
                hidden: true

            }, {
                header: '超差描述',
                dataIndex: 'description',
                flex: 1,
                editor: {
                    field: {
                        xtype: 'textareafield',
                        height: 100,
                        grow: true
                    },
                    allowBlank: false
                }

            }, {
                header: '正常描述',
                dataIndex: 'NormalDescription',
                flex: 1,
                editor: {
                    field: {
                        xtype: 'textareafield',
                        height: 100,
                        grow: true
                    },
                    allowBlank: false
                }

            }, {
                header: '删除',
                xtype: 'actioncolumn',
                flex: 0.3,
                sortable: false,
                //  menuDisabled: true,
                items: [{
                    iconCls: 'delete',
                    tooltip: 'Delete Discrepancy',
                    scope: this,
                    handler: this.onRemoveClick
                }]
            }],
            selModel: {
                selType: 'cellmodel'
            },
            tbar: [{
                iconCls: 'add',
                tooltip: Profile.getText('AddDiscrepancy'),
                scope: this,
                handler: this.onAddClick
            }]
        });

        me.callParent();
    },

    onAddClick: function () {
        // Create a model instance
        var rec = new QDT.model.dr.Discrepancy({
            disc_id: '',
            dr_num: '',
            description: '',
            NormalDescription: ''
        });

        this.getStore().insert(0, rec);
        this.cellEditing.startEditByPosition({
            row: 0,
            column: 0
        });
    },

    onRemoveClick: function (grid, rowIndex) {
        this.getStore().removeAt(rowIndex);
    }
});
