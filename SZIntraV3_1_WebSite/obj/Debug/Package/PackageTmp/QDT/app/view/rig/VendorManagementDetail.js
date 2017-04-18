Ext.define('QDT.view.rig.VendorManagementDetail', {
    extend: 'Ext.window.Window',
    alias: 'widget.vendormanagementdetail',
    title: Profile.getText('vendormanagement'),
    width: 600,
    height: 400,
    modal: false,
    autoScroll: true,
    layout: {
        type: 'border'
    },
    rignum: '',
    isclosed: false,

    initComponent: function () {
        var me = this;
        var vendormanagementDetailForm = Ext.widget('form', {
            frame: false,
            border: false,
            layout: 'anchor',
            defaultType: 'displayfield',
            submitValue: true,
            autoScroll: true,
            api: { submit: DpRig.UpdateVendorInfor },
            height: 400,
            defaults: {
                labelAlign: 'left',
                margin: '5 0 5 5',
                anchor: '90%',
                labelWidth: 100,
                submitValue: true
            },

            items: [
            {
                name: 'vend_num',
                fieldLabel: Profile.getText('vendor_num')



            },
            {
                name: 'name',
                fieldLabel: Profile.getText('vendor_name')

            },
            {
                name: 'vendor_type',
                fieldLabel: Profile.getText('vendor_type')


            },
            {
                name: 'address',
                fieldLabel: Profile.getText('address')


            },
            {
                xtype: 'combobox',
                name: 'vendor_status',
                store: 'QDT.store.rig.VendorStatuss',
                fieldLabel: Profile.getText('status'),
                displayField: 'status',
                valueField: 'status',
                queryMode: 'local'

            },
            {
                xtype: 'textfield',
                name: 'contact_name',
                fieldLabel: Profile.getText('contact_name')


            },
            {
                xtype: 'textfield',
                name: 'mail_address',
                fieldLabel: Profile.getText('mail_address')


            },
            {
                xtype: 'textfield',
                name: 'scope_of_service',
                fieldLabel: Profile.getText('scope_of_service')


            },
            {
                xtype: 'textfield',
                name: 'certification_status',
                fieldLabel: Profile.getText('certification_status')


            },
            {
                xtype: 'datefield',
                name: 'certification_expiry_date',
                fieldLabel: Profile.getText('expire_date')

            },
            {
                xtype: 'textfield',
                name: 'remark',
                fieldLabel: Profile.getText('remark')


            },
            {
                name: 'submit',
                xtype: 'button',
                text: Profile.getText('Save'),
                anchor: '20%',
                listeners: {


                 click: function() {
                     vendormanagementDetailForm.getForm().submit({
                         waitMsg: '正在处理中,请稍后...',
                            success: function (form, action) {
                                me.close();
                                var msgbox = 'Successful!';
                                Ext.MessageBox.show({
                                    title: 'Warning',
                                    msg: msgbox,
                                    buttons: Ext.MessageBox.OK

                                });

                                cq.query('vendormanagement')[0].store.reload();
                            },
                            failure: function (form, action) {
                                My.Msg.info(Profile.getText('Error'), action.result.errorMessage);
                            }





                        });
                    }

                }

                }
            ]

        });


        me.items = [{
            region: 'center',
            title: Profile.getText('vendormanagement'),
            width: 270,
            split: true,
            collapsible: false,
            items: [vendormanagementDetailForm]
        }];

        me.callParent();



    }
});