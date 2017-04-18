Ext.define('QDT.view.rig.RIG', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.rig',


    store: 'QDT.store.rig.RIGs',
    creator: Profile.getUser(),

    columns: [
        {
            dataIndex: 'rig_num',
            text: Profile.getText('rig_num'),
            width: 82
        },
        {
            dataIndex: 'rig_line',
            text: Profile.getText('rig_line'),
            width: 62
        },
        {
            dataIndex: 'vendor_num',
            text: Profile.getText('vendor_num'),
            width: 82
        },
        {
            dataIndex: 'part_num',
            text: Profile.getText('part_num'),
            width: 92

        },
        {
            dataIndex: 'liability',
            text: Profile.getText('liability'),
            width: 82

        },
        {
            dataIndex: 'status',
            text: Profile.getText('status'),
            width: 82

        },
        {
            dataIndex: 'serial_lot',
            text: Profile.getText('serial_lot'),
            width: 115

        },
        {
            dataIndex: 'defect_desc',
            text: Profile.getText('problem_description'),
            width: 292

        },
        {
            dataIndex: 'po_num',
            text: Profile.getText('po_num'),
            width: 82

        }, {
            dataIndex: 'po_line',
            text: Profile.getText('po_line'),
            width: 82

        },
        {
            dataIndex: 'coc_num',
            text: Profile.getText('coc_num'),
            width: 82

        },
        {
            dataIndex: 'grn_num',
            text: Profile.getText('grn_num'),
            width: 90

        },
        {
            dataIndex: 'grn_line',
            text: Profile.getText('grn_line'),
            width: 82

        },
        {
            dataIndex: 'part_desc',
            text: Profile.getText('part_desc'),
            width: 82

        },
        {
            dataIndex: 'drawing_num',
            text: Profile.getText('drawing_num'),
            width: 82

        },
        {
            dataIndex: 'goods_returned_for',
            text: Profile.getText('goods_returned_for'),
            width: 110

        },
        {
            dataIndex: 'quanlity_escape_' + Profile.getLang(),
            text: Profile.getText('quanlity_escape'),
            width: 82


        },
        {
            dataIndex: 'create_date',
            text: Profile.getText('create_date'),
            width: 82,
            renderer: QDT.util.Renderer.dateRenderer

        },
        {
            dataIndex: 'due_date',
            text: Profile.getText('due_date'),
            width: 82,
            renderer: QDT.util.Renderer.dateRenderer

        },
        {
            dataIndex: 'goods_receive_date',
            text: Profile.getText('goods_receive_date'),
            width: 82,
            renderer: QDT.util.Renderer.dateRenderer

        },
        {
            dataIndex: 'qty_received',
            text: Profile.getText('qty_received'),
            width: 82

        },
        {
            dataIndex: 'qty_rejected',
            text: Profile.getText('qty_rejected'),
            width: 82

        },
        {
            dataIndex: 'create_by_' + Profile.getLang(),
            text: Profile.getText('create_by'),
            width: 82

        },
        {
            dataIndex: 'dr_num',
            text: Profile.getText('dr_num'),
            width: 82

        }
    ],
    initComponent: function() {
        var me = this;
        me.tbar = [
            {
                text: Profile.getText('Create'),
                xtype: 'button',
                iconCls: 'add_green',
                scope: me,
                id: 'createRIG',
                handler: me.onCreateRIGClick
            }, {
                xtype: 'button',
                text: Profile.getText('Filter'),
                iconCls: 'search',
                scope: me,
                handler: me.onFilterRIGClick
            }, {
                xtype: 'button',
                text:'图表',
                iconCls: 'calculator',
                scope: me,
                handler: me.onGraphicRIGClick
            }
        ];

        me.bbar = Ext.widget('pagingtoolbar', {
            store: me.store,
            displayInfo: true
        });
        me.callParent();
    },
    onCreateRIGClick: function() {
        var win = Ext.create('QDT.view.rig.CreateRIG');
        win.show();
    },


    onFilterRIGClick: function() {

        var searchRig = Ext.ComponentQuery.query('searchrig')[0];
        if (searchRig === undefined) {
            searchRig = Ext.create('QDT.view.rig.SearchRIG');
        }
        searchRig.show();
    },
    onGraphicRIGClick: function () {

        var win = Ext.create('QDT.view.rig.RigGraphic');
        win.show();

    }

});