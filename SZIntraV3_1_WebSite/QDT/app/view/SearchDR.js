/// <reference path="../../../extjs/ext-all.js" />
Ext.define('QDT.view.SearchDR', {
    extend: 'Ext.window.Window',
    alias: 'widget.searchdr',
    //    store: 'SearchDRs',
    title: Profile.getText('Search'),
    closeAction: 'hide',
    closable: true,
    modal: true,
    layout: 'fit',
    width: 600,

    listeners: {
        hide: function () {
            //TODO: no animation(I do not know why)
            Ext.ComponentQuery.query('searchdr')[0].hide(Ext.ComponentQuery.query('dr')[0].down('button[iconCls=search]'));
        }
    },

    initComponent: function () {

        var me = this;

        var searchDrForm = Ext.widget('form', {
            frame: true,
            //   api: { submit: QDT.SearchDrs },
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [{
                xtype: 'container',
                flex: 1,
                items: [{
                    xtype: 'searchcombo',
                    name: 'dr_num',
                    fieldLabel: Profile.getText('dr_num'),
                    store: Ext.create('QDT.store.ComboDRs'),
                    displayField: 'dr_num',
                    valueField: 'dr_num',
                    pageSize: 10,
                    margin: '10 0 0 0'

                }, {
                    xtype: 'container',
                    layout: 'vbox',
                    items: [{
                        xtype: 'datefield',
                        fieldLabel: Profile.getText('due_date'),
                        name: 'due_date_from',
                        margin: '10 0 5 0'
                    }, {
                        xtype: 'datefield',
                        fieldLabel: Profile.getText('To'),
                        labelWidth: 20,
                        name: 'due_date_to',
                        margin: '0 0 10 80'
                    }]
                }, {
                    xtype: 'container',
                    layout: 'vbox',
                    items: [{
                        xtype: 'datefield',
                        fieldLabel: Profile.getText('create_date'),
                        name: 'create_date_from',
                        margin: '10 0 5 0'
                    }, {
                        xtype: 'datefield',
                        fieldLabel: Profile.getText('To'),
                        labelWidth: 20,
                        name: 'create_date_to',
                        margin: '0 0 10 80'
                    }]
                }, {
                    xtype: 'employeecombo',
                    name:'dr_qe_owner',
                    fieldLabel: Profile.getText('qe_owner')

                }, {
                    xtype: 'searchcombo',
                    name: 'dr_me_owner',
                    fieldLabel: Profile.getText('me_owner'),
                    store: Ext.create('QDT.store.AuthorizedMes'),
                    displayField: 'name',
                    valueField: 'employee_id',
                    pageSize: 10
                }, {
                    xtype: 'employeecombo',
                    name:'act_owner',
                    fieldLabel: Profile.getText('act_owner')
                }, {
                    xtype: 'searchcombo',
                    name: 'dr_creator',
                    fieldLabel: Profile.getText('create_by'),
                    store: Ext.create('QDT.store.Users'),
                    displayField: 'name',
                    valueField: 'user_id',
                    pageSize: 10
                }]
            }, {
                xtype: 'container',
                flex: 1,
                defaults: {
                    //labelWidth: 30,
                    margin: '10 0 10 0',
                    labelWidth: 100
                },
                items: [{
                    xtype: 'combobox',
                    name: 'production_line',
                    store: Ext.create('QDT.store.ProductionLines'),
                    fieldLabel: Profile.getText('production_line'),
                    displayField: 'production_line',
                    valueField: 'code',
                    queryMode: 'local',
                    editable: false,
                    emptyText: Profile.getText('PleaseSelect'),
                    margin: '5 0 10 0'
                }, {
                    xtype: 'searchcombo',
                    name: 'part_num',
                    fieldLabel: Profile.getText('part_num'),
                    store: Ext.create('QDT.store.Items'),
                    displayField: 'item',
                    valueField: 'item',
                    columns: [{ dataIndex: 'item', text: 'Item'}],
                    pageSize: 10
                }, {
                    xtype: 'combobox',
                    name: 'status',
                    fieldLabel: Profile.getText('status'),
                    store: Ext.create('QDT.store.DRStatuses'),
                    displayField: 'status',
                    valueField: 'status',
                    emptyText: Profile.getText('PleaseSelect'),
                    multiSelect: true,
                    editable: false
                }, {
                    xtype: 'searchcombo',
                    name: 'job_card',
                    fieldLabel: Profile.getText('job'),
                    store: Ext.create('QDT.store.Jobs'),
                    displayField: 'job',
                    valueField: 'job',
                    columns: [{ dataIndex: 'job', text: 'JOB'}],
                    pageSize: 10
                }, {
                    xtype: 'searchcombo',
                    name: 'reason_code',
                    fieldLabel: Profile.getText('reason'),
                    store: Ext.create('QDT.store.DispositionReasons'),
                    displayField: 'common_string',
                    valueField: 'id',
                    pageSize: 10
                }, {
                    xtype: 'combobox',
                    name: 'dr_type',
                    fieldLabel: Profile.getText('type'),
                    store: Ext.create('QDT.store.DrTypes'),
                    displayField: 'common_string',
                    valueField: 'id',
                    emptyText: Profile.getText('PleaseSelect'),
                    editable: false
                    // emptyText: Profile.getText('PleaseSelect')
                }]
            }]
        });

        me.items = [searchDrForm];

        me.buttons = [{
            text: Profile.getText('clear'),
            //   iconCls: 'search',
            handler: function () {
                searchDrForm.getForm().reset();
            }
        }, {
            text: Profile.getText('Search'),
            iconCls: 'search',
            handler: function () {

                var searchdrs = Ext.create('QDT.store.SearchDRs');

                Ext.ComponentQuery.query('pagingtoolbar')[0].bindStore(searchdrs);
                Ext.ComponentQuery.query('dr')[0].reconfigure(searchdrs);


                Ext.ComponentQuery.query('dr')[0].getStore().load({
                    params: {
                        searchConditions: searchDrForm.getValues()
                    }
                });
                me.hide(Ext.ComponentQuery.query('dr')[0].down('button[iconCls=search]'));


                //                searchDrForm.submit({
                //                    success: function (form, action) {

                //                        //  Ext.StoreMgr.lookup('RelatedDRs').model = 'QDT.model.DR';
                //                        //TODO: 统一Search和View Store load
                //                        Ext.StoreMgr.lookup('SearchDRs').loadRawData(action.result.data);

                //                        //   Ext.ComponentQuery.query('pagingtoolbar')[0].hide();
                //                        me.hide(Ext.ComponentQuery.query('dr')[0].down('button[iconCls=search]'));
                //                    },
                //                    failure: function (form, action) {
                //                    }
                //                });
            }
        }];

        me.callParent();
    }
});