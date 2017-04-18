Ext.define('QDT.view.rig.SearchVendor', {
    extend: 'Ext.window.Window',
    title: Profile.getText('Search'),
    alias: 'widget.searchvendor',
//    width: 328,
//    height: 218,
    layout: {
        type: 'fit'

    },
    initComponent: function() {

        var me = this;
        var createForm = Ext.widget('form', {
            frame: true,
            layout: {
                type: 'vbox',
                align: 'stretch'

            },

            defaults: {
                xtype: 'panel',
                frame: false,
                border: false,
                flex: 1,

                layout: 'anchor',
                margin: '10 0 10 5'
            },
            fieldDefaults: {
                anchor: '90%',
                labelWidth: 100
            },
            items: [
                {
                    xtype: 'searchcombo',
                    name: 'vend_num',
                    fieldLabel: Profile.getText('vendor_num'),
                    displayField: 'vend_num',
                    valueField: 'vend_num',
                    store: Ext.create('QDT.store.rig.VendorNum')


                },
                {
                    xtype: 'searchcombo',
                    name: 'name',
                    fieldLabel: Profile.getText('vendor_name'),
                    displayField: 'name',
                    valueField: 'name',
                    store: Ext.create('QDT.store.rig.VendorMains')


                },
                 {
                     xtype: 'textfield',
                     name: 'vendor_type',
                     fieldLabel: Profile.getText('vendor_type')
                    


                 }
            ]

        });

        me.items = [
            {
                title: Profile.getText('Search'),
                items: [createForm]
            }
        ];

        me.buttons = [
            {
                text: Profile.getText('clear'),
                handler: function() {
                    createForm.getForm().reset();
                }
            },
            {
                text: Profile.getText('Search'),
                iconCls: 'search',
                handler: function () {

                    var searchvendors = Ext.create('QDT.store.rig.SearchVendors');
                    Ext.ComponentQuery.query('pagingtoolbar')[0].bindStore(searchvendors);
                    Ext.ComponentQuery.query('vendormanagement')[0].reconfigure(searchvendors);

                    Ext.ComponentQuery.query('vendormanagement')[0].store.load({
                        params: {
                            searchConditions: createForm.getValues()
                        }
                    });
                    me.hide(Ext.ComponentQuery.query('vendormanagement')[0].down('button[iconCls=search]'));

                }
            }
        ];


        me.callParent();
    }


});