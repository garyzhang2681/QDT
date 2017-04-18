Ext.define('QDT.view.tq.OperationalRestrictionGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.tq-operationalrestrictiongrid',
    requries: [
        'Ext.grid.feature.Grouping'
    ],

    initComponent: function () {
        var me = this,
            store = Ext.create('QDT.store.tq.OperationalRestrictions');

        var selModel = new Ext.selection.CheckboxModel({
            showHeaderCheckbox: false
        });

        Ext.apply(me, {
            activeRecords: [],
            store: store,
            columns: [{
                dataIndex: 'certification_item', text: Profile.getText('certification_item'), flex: 1
            }],
            selModel: selModel,
            viewConfig: {
                features: [{
                    ftype: 'grouping',
                    enableGroupingMenu: false,
                    groupHeaderTpl: [
                        Profile.getText('category'),
                        ': {name:this.renderer}',
                        {
                            renderer: QDT.util.Renderer.certificationCategory
                        }
                    ]
                }]
            },
                tbar: [
//                {
//                    iconCls: 'add_green',
//                    text: Profile.getText('AddOperationalRestriction'),
//                    xtype: 'splitbutton',
//                    itemId: 'add-restriction',
//                    disabled: true,
//                    menu: {
//                        xtype: 'menu',
//                        items: [{
//                            text: Profile.getText('certificationCategory_stc'),
//                            itemId: 'stc-restriction',
//                            category: 'stc'
//                        }, {
//                            text: Profile.getText('certificationCategory_llc'),
//                            itemId: 'llc-restriction',
//                            category: 'llc'
//                        }]
//                    }
//                },  
                {
                iconCls: 'delete',
                itemId: 'delete',
                text: Profile.getText('remove'),
                disabled: true
            }, '->', {
                xtype: 'localcombo',
                name: 'work_type',
                itemId:'work_type',
                store: Ext.create('Asz.store.op.WorkTypes'),
                displayField: 'work_type_string',
                valueField: 'work_type',
                value: 'run'
            }],
            bbar: [{
                iconCls: 'refresh',
                handler: function () {
                    store.load();
                }
            }]
        });



        me.callParent();
    }
});