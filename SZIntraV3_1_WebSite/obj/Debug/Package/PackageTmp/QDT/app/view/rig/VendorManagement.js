Ext.define('QDT.view.rig.VendorManagement', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.vendormanagement',

    store: 'QDT.store.rig.VendorManagements',

    columns: [
        {
            dataIndex: 'vend_num',
            text: Profile.getText('vendor_num'),
            width: 82
        },
        {
            dataIndex: 'name',
            text: Profile.getText('vendor_name'),
            width: 290
        },
        {
            dataIndex: 'vendor_type',
            text: Profile.getText('vendor_type'),
            width: 82
        },
        {
            dataIndex: 'address',
            text: Profile.getText('address'),
            width: 290
        },
        {
            dataIndex: 'vendor_status',
            text: Profile.getText('status'),
            width: 82
        },
        {
            dataIndex: 'contact_name',
            text: Profile.getText('contact_name'),
            width: 82
        },
        {
            dataIndex: 'mail_address',
            text: Profile.getText('mail_address'),
            width: 82
        },
        {
            dataIndex: 'scope_of_service',
            text: Profile.getText('scope_of_service'),
            width: 290
        },
        {
            dataIndex: 'certification_status',
            text: Profile.getText('certification_status'),
            width: 82
        },
        {
            dataIndex: 'certification_expiry_date',
            text: Profile.getText('expire_date'),
            width: 82,
            renderer: QDT.util.Renderer.dateRenderer
        },
        {
            dataIndex: 'remark',
            text: Profile.getText('remark'),
            width: 82
        }
    ],
    initComponent: function() {
        var me = this;
        me.tbar = [
            {
                xtype:'button',
                text: Profile.getText('Filter'),
                iconCls:'search',
                scope:me,
                handler:me.onFilterVendorClick

            }
        ];

        me.bbar = Ext.widget('pagingtoolbar', {
            store: me.store,
            displayInfo: true
        });


        me.callParent();
    },
    onFilterVendorClick: function () {

        var win = Ext.create('QDT.view.rig.SearchVendor');
        win.show();


    }


});