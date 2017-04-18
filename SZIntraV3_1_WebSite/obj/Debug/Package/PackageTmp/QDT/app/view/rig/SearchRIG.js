Ext.define('QDT.view.rig.SearchRIG', {
    extend: 'Ext.window.Window',
    title: Profile.getText('SearchRIG'),
    alias: 'widget.searchrig',
    modal: true,
   
    layout: {
        type: 'fit'
    },
 
    creator: Profile.getUser(),

    initComponent: function() {
        var me = this;

        var createForm = Ext.widget('form', {

            frame: true,
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [{
                xtype: 'container',
                flex: 1,
                items: [{
                    xtype: 'searchcombo',
                    name: 'rig_num',
                    fieldLabel: Profile.getText('rig_num'),
                    store: Ext.create('QDT.store.rig.GetRigByRigNums'),
                    displayField: 'rig_num',
                    valueField: 'rig_num',
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
                },{
                    xtype: 'searchcombo',
                    name: 'create_by',
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
                items: [ {
                    xtype: 'combobox',
                    name: 'status',
                    fieldLabel: Profile.getText('status'),
                    store: Ext.create('QDT.store.rig.RigStatuses'),
                    displayField: 'status',
                    valueField: 'status',
                    emptyText: Profile.getText('PleaseSelect'),
                    queryMode: 'local'

                }, {
                    xtype: 'searchcombo',
                    name: 'dr_num',
                    fieldLabel: Profile.getText('dr_num'),
                    store: Ext.create('QDT.store.ComboDRs'),
                    displayField: 'dr_num',
                    valueField: 'dr_num',
                    pageSize: 10,
                    margin: '10 0 0 0'

                }]
            }]


        });



        me.items = [
            {
                title: Profile.getText('SearchRIG'),
                items: [createForm]
            }
        ];

        me.buttons = [
            {
                text: Profile.getText('clear'),
                handler: function() {
                    createForm.getForm().reset();
                }
            }, {
                text: Profile.getText('Search'),
                iconCls: 'search',
                handler: function () {

                    var searchrigs = Ext.create('QDT.store.rig.SearchRIGs');
                    Ext.ComponentQuery.query('pagingtoolbar')[0].bindStore(searchrigs);
                    Ext.ComponentQuery.query('rig')[0].reconfigure(searchrigs);

                    Ext.ComponentQuery.query('rig')[0].store.load({
                        params: {
                            searchConditions: createForm.getValues()
                        }
                    });
                    me.hide(Ext.ComponentQuery.query('rig')[0].down('button[iconCls=search]'));

                }
            }
        ];









        me.callParent();
    }

    
});