Ext.define('QDT.view.IRDDetail', {
    extend: 'Ext.window.Window',
    alias: 'widget.irddetail',
    title: Profile.getText('IRDDetail'),
    width: 1240,
    height: 520,
    layout: {
        type: 'border'
    },
    modal: true,
    constrainHeader:true,
    //    requires: [
    //        'Ext.grid.plugin.CellEditing',
    //        'Ext.form.field.Text',
    //        'Ext.toolbar.TextItem',
    //        'Ext.ux.ajax.SimManager'
    //    ],


    initComponent: function () {
        var me = this;

        //        var irdDetailInfoForm = Ext.widget('form', {
        //            frame: false,
        //            border: false,
        //            layout: {
        //                type: 'vbox',
        //                align: 'stretch'
        //            },
        //            defaults: {
        //                margin: '5 5 0 5'
        //            },
        //            items: [{
        //                xtype: 'container',
        //                layout: 'hbox',
        //                defaultType: 'textfield',
        //                defaults: {
        //                    lableWidth: 15,
        //                    margin: '10 5 5 5'
        //                },
        //                items: [{
        //                    xtype: 'searchcombo', //2410M51P01
        //                    name: 'part_num',
        //                    id: 'part_num',
        //                    fieldLabel: Profile.getText('part_num'),
        //                    store: Ext.create('QDT.store.Items'),
        //                    displayField: 'item',
        //                    valueField: 'item',
        //                    columns: [{ dataIndex: 'item', text: 'Item'}],
        //                    pageSize: 10
        //                }, {
        //                    fieldLabel: 'Rev. Level:', //TODO: language
        //                    value: 'AK'//TODO:
        //                }, {
        //                    fieldLabel: 'S/N:', //TODO: language
        //                    value: ''//TODO:
        //                }, {
        //                    fieldLabel: 'Forgoing No.:', //TODO: language
        //                    value: ''//TODO:
        //                }]
        //            }, {
        //                xtype: 'container',
        //                layout: 'hbox',
        //                defaultType: 'textfield',
        //                defaults: {
        //                    lableWidth: 15,
        //                    margin: '5 5 10 5'
        //                },
        //                items: [{
        //                    fieldLabel: 'IRD Revision:', //TODO: language 
        //                    value: '21'//TODO:
        //                }, {
        //                    fieldLabel: 'R.I. NO.:', //TODO: language
        //                    value: ''//TODO:
        //                }, {
        //                    fieldLabel: 'Head Code:', //TODO: language
        //                    value: ''//TODO:
        //                }]
        //            }]
        //        });


        var irdHeaderInformationForm = Ext.widget('irdheaderinformationform');

        var irdGrid = Ext.widget('irdgrid', {
            id: 'ird_grid'
        });

        var operationTree = Ext.create('Ext.tree.Panel', {
            frame: false,
            name: 'ird_operation_information',
            width: 350,
            //   height: 350,
           store: Ext.create('QDT.store.ird.OperationInformation'),
            rootVisible: false,
            //  autoScroll: true,
            //  containerScroll: true,
            columns: [{
                xtype: 'treecolumn',
                text: Profile.getText('oper_num'),
                dataIndex: "oper_num",
                flex: 25,
                sortable: false
            }, {
                text: Profile.getText('fml_mark'),
                dataIndex: "fml_mark",
                flex: 20,
                sortable: false
            },{
                text: Profile.getText('is_cmm_flag'),
                dataIndex:'is_cmm',
                flex:20,
                sortable: false
            }, {
                text: Profile.getText('is_cmm_flag'),
                dataIndex: 'is_cm_flag',
               hidden:true,
                sortable: false
            }, {
                text: Profile.getText('OperatorCharCount'),
                dataIndex:'oper_char_count',
                flex:20,
                sortable:false
            },{
                text: Profile.getText('OperatorTransCount'),
                dataIndex:'oper_trans_count',
                flex:15,
                sortable:false
            }, {
                text: Profile.getText('InspectorCharCount'),
                dataIndex: 'insp_char_count',
                flex: 20,
                sortable: false
            }, {
                text: Profile.getText('InspectorTransCount'),
                dataIndex: 'insp_trans_count',
                flex: 15,
                sortable: false
            }]

        });




        me.items = [{
            region: 'north',
            split: true,
            // collapsible: true,
            items: [irdHeaderInformationForm]
        }, {
            region: 'west',
            title: Profile.getText('operation'),
            layout: 'fit',
            split: true,
            collapsible: true,
            items: [operationTree]
        }, {
            region: 'center',
            split: true,
            items: [irdGrid],
            layout:'fit'
        }
        ];

        me.callParent();
    }

});