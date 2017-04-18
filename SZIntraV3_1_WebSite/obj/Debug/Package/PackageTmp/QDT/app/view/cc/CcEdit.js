Ext.define('QDT.view.cc.CcEdit', {
    extend: 'Ext.window.Window',
    alias: 'widget.cc-ccedit',
    is_update: false,
    is_create: true,
    cc_num: '',
    record: '',
    width: 800,
    height: 400,
    layout: 'fit',
    title: Profile.getText('CustomerComplain'),
    modal: true,

    initComponent: function () {
        var me = this;

        var cc_form = Ext.widget('form', {
            xtype: 'form',
            itemId:'cc_edit_form',
            frame: true,
            api: (me.is_create && !me.is_update) === true ? { submit: DpCc.CreateCc} : { submit: DpCc.UpdateCc },
            defaults: {
                xtype: 'container',
                defaults: {
                    margin: '0 10 5 10'
                },
                flex: 1,
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                }
            },
            layout: {
                type: 'hbox'
            },
            items: [{
                items: [
                    {
                        xtype: 'displayfield',
                        fieldLabel: 'CC Num',
                        itemId: 'cc_num',
                        name: 'cc_num',
                        value: me.cc_num,
                        style: {
                            backgroundColor: '#add566'
                        },
                        submitValue: true
                    }, {
                        xtype: 'displayfield',
                        fieldLabel: 'Create By',
                        itemId: 'create_by',
                        name: 'create_by',
                        value: Profile.getUser().user_id,
                        renderer: QDT.util.Renderer.username,
                        submitValue: true
                    }, {
                        xtype: 'container',
                        layout: 'hbox',
                        items: [{
                            xtype: 'displayfield',
                            fieldLabel: 'Create Date',
                            itemId: 'create_date',
                            name: 'create_date',
                            value: Ext.Date.format(new Date(), 'Y-m-d H:i:s'),
                            renderer: QDT.util.Renderer.dateTimeRenderer
                        }, {

                            xtype: 'checkboxfield',
                            align: 'right',
                            boxLabel: 'Repeat',
                            itemId: 'repeat',
                            checked: false,
                            margin: '0 0 0 10',
                            name: 'repeat'

                        }]
                    }, {
                        xtype: 'textfield',
                        fieldLabel: 'Ref ERI/PO No.',
                        itemId: 'po_num',
                        name: 'po_num'
                    }, {
                        xtype: 'seriallotcombo',
                        editable: true,
                        fieldLabel: 'Serial/Lot',
                        name: 'serial_lot',
                        itemId: 'serial_lot'
                    }, {
                        xtype: 'itemcombo',
                        editable: true,
                        emptyText: 'Part no',
                        fieldLabel: 'Part no/Ref',
                        name: 'part_num',
                        itemId: 'part_num'
                    }, {
                        xtype: 'numberfield',
                        fieldLabel: 'Rejected Qty',
                        itemId: 'rejected_quantity',
                        name: 'rejected_quantity',
                        value: 1,
                        minValue: 0
                    }, {
                        xtype: 'businesscombo',
                        fieldLabel: 'Business',
                        name: 'business',
                        itemId: 'business'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: 'Department',
                        name: 'department',
                        itemId: 'department',
                        readOnly: true,
                        value: 'production'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: 'Criteria',
                        itemId: 'criteria',
                        name: 'criteria',
                        hidden:true

                    }, {
                        xtype: 'remotecombo',
                        displayField: 'common_string',
                        fieldLabel: 'Type',
                        itemId: 'type',
                        name: 'type',
                        store: 'QDT.store.cc.CcTypes',
                        valueField: 'id'
                    }, {
                        xtype: 'remotecombo',
                        displayField: 'common_string',
                        fieldLabel: 'Failure Code',
                        itemId: 'failure_code',
                        name: 'failure_code',
                        store: Ext.create('QDT.store.cc.CcFailureCodes'),
                        valueField: 'id'
                    }, {
                        xtype: 'remotecombo',
                        displayField: 'common_string',
                        fieldLabel: 'Indicate Finding',
                        itemId: 'indicate_finding',
                        name: 'indicate_finding',
                        store: Ext.create('QDT.store.cc.CcIndicateFindings'),
                        valueField: 'id'

                    }]
            }, {
                items: [{
                    xtype: 'textarea',
                    fieldLabel: 'Comments',
                    itemId: 'comments',
                    name: 'comments',
                    height:140
                }, {
                    xtype: 'datefield',
                    fieldLabel: 'Receive Date',
                    itemId: 'response_date',
                    name: 'response_date'
                }, {
                    xtype: 'employeecombo',
                    fieldLabel: 'Quality Rep',
                    itemId: 'quality_rep',
                    name: 'quality_rep',
                    pageSize: 10,
                    forctSelection: true,
                    store: Ext.create('Asz.store.hr.Employees'),
                    allowBlank: false
                }, {
                    xtype: 'textfield',
                    fieldLabel: 'Responsible Manager',
                    itemId: 'responsible_manager',
                    name: 'responsible_manager',
                    readOnly: true,
                    value: 'Quality Manager'
                }, {
                    xtype: 'datefield',
                    fieldLabel: 'Closed Date',
                    itemId: 'closed_date',
                    name: 'closed_date'
                }, {
                    xtype: 'employeecombo',
                    fieldLabel: 'CA Assigned to',
                    itemId: 'ca_assigned_to',
                    name: 'ca_assigned_to',
                    pageSize: 10,
                    store: Ext.create('Asz.store.hr.Employees'),
                    forctSelection: true
                  
                }, {
                    xtype: 'textfield',
                    fieldLabel: 'Audit Findings',
                    itemId: 'audit_findings',
                    name: 'audit_findings'
                }]
            }]
        });

        me.items = [cc_form];
        me.buttons = [{
            iconCls: 'print',
            itemId: 'print',
            name: 'print',
            text: 'Print 8D Report',
            handler: function () {
               // me.down('form').getForm().reset();
            }
        }, {
            iconCls: 'undo',
            itemId: 'reset',
            name: 'reset',
            text: 'Reset',
            handler: function () {
                me.down('form').getForm().reset();
            }
        }, {
            iconCls: 'submit',
            itemId: 'save',
            name: 'save',
            text: 'Save',
            handler: function () {

                cc_form.submit({
                    success: function () {
                        if (me.is_create && !me.is_update) {
                             Ext.Msg.alert('Message', 'Custom Complaint ' + me.cc_num + ' is generated!');
                        }else if(me.is_update && !me.is_create)
                        {
                            Ext.Msg.alert('Message', 'Custom Complaint ' + me.cc_num + ' is updated!');
                        }
                       
                        cq.query('cc-cclist')[0].store.load();
                        me.close();
                    },
                    failure: function (form, action) {
                        Ext.Msg.alert(Profile.getText('Error'), action.result.errorMessage);
                    }
                });
            }
        }];
        me.callParent();

        me.on({
            afterrender: me.onCcEditorRender
        });
    },

    onCcEditorRender: function () {
        var me = this;
        var cc = me.record.data;

        if (me.is_update && !me.is_create) {

            me.down('form').getForm().loadRecord(me.record);

            var serial_lot = Ext.create('Asz.model.util.SerialLot', {
                serial_lot: cc.serial_lot
            });
            me.down('#serial_lot').select(serial_lot);


            var part_num = Ext.create('Asz.model.util.Item', {
                item: cc.part_num
            });
            me.down('#part_num').select(part_num);

            me.down('#type').store = Ext.StoreManager.get('QDT.store.cc.CcTypes');
            me.down('#type').select(cc.type);


            me.down('#failure_code').store = Ext.StoreManager.get('QDT.store.cc.CcFailureCodes');
            me.down('#failure_code').select(cc.failure_code);

            me.down('#indicate_finding').store = Ext.StoreManager.get('QDT.store.cc.CcIndicateFindings');
            me.down('#indicate_finding').setValue(cc.indicate_finding);


            me.down('#quality_rep').store = Ext.StoreManager.get('Asz.store.hr.Employees');
            me.down('#quality_rep').select(cc.quality_rep);

            me.down('#ca_assigned_to').store = Ext.StoreManager.get('Asz.store.hr.Employees');
            me.down('#ca_assigned_to').select(cc.ca_assigned_to);
        }
    }
});