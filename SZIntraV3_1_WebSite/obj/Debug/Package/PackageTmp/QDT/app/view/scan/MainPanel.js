Ext.define('QDT.view.scan.MainPanel', {
    extend: 'Ext.window.Window',
    alias: 'widget.scan-mainpanel',

    requires: [
        'QDT.view.tq.SkillTrainingGrid',
        'QDT.view.scan.TransactionInformationPanel',
        'QDT.view.tq.ProcessScanRecordGrid'
    
    ],

    constrainHeader: true,
    autoShow: true,
    closable: false,
    resizable: false,
    y: 50,
    width: 950,
    height: 560,
    layout: 'border',

    initComponent: function () {
        var me = this;

        Ext.applyIf(me, {
            title: Profile.getText('ScanSystem'),
            items: [
                {
                    region: 'center',
                    itemId: 'tab-container',
                    xtype: 'tabpanel',
                    tabPosition: 'bottom',
                    defaults: {
                        layout: 'fit'
                    },
                    tbar: ['->', {
                        xtype: 'container',
                        layout: {
                            type: 'hbox',
                            align: 'middle'
                        },
                        itemId: 'check-in',
                        items: [{
                            xtype: 'textfield',
                            name: 'local_id',
                            fieldLabel: Profile.getText('CheckIn'),
                            emptyText: Profile.getText('local_id'),
                            labelWidth: false,
                            labelStyle: 'white-space:nowrap;'
                        }]
                    }, {
                        xtype: 'container',
                        itemId: 'check-out',
                        hidden: true,
                        layout: {
                            type: 'hbox',
                            align: 'middle'
                        },
                        items: [{
                            xtype: 'tbtext',
                            text: Profile.getText('CurrentUser') + ':'
                        }, {
                            xtype: 'hiddenfield',
                            name: 'employee_id'
                        }, {
                            xtype: 'tbtext',
                            itemId: 'username'
                        }, {
                            xtype: 'button',
                            iconCls: 'export',
                            itemId: 'btn-check-out',
                            text: Profile.getText('CheckOut')
                        }]
                    }],
                    items: [{
                        xtype: 'panel',
                        title: Profile.getText('MySkillTraining'),
                        layout: {
                            type: 'vbox',
                            align: 'stretch'
                        },
                        items: [{
                            xtype: 'tq-skilltraininggrid',
                            flex: 2,
                            store: Ext.create('QDT.store.tq.PersonSkillTrainings'),
                            tbar: [{
                                iconCls: 'add_green',
                                text: '添加实操记录',
                                disabled: true,
                                itemId: 'scan'
                            }]
                        }, {
                            xtype: 'tq-processscanrecordgrid',
                            flex: 1,
                            tbar: [{
                                iconCls: 'cancel',
                                itemId: 'end-job',
                                text: Profile.getText('EndSelectedWork'),
                                disabled: true
                            }]
                        }]
                    }]
                }

//                            ,
//                            {
//                                xtype: 'scan-transactioninformationpanel',
//                                itemId: 'transaction-form',
//                                region: 'east'
//                            }


//                            ,
//                            {
//                                xtype: 'panel',
//                                region: 'south',
//                                layout: 'hbox',
//                                title: '',
//                                dockedItems: [
//                                    {
//                                        xtype: 'toolbar',
//                                        dock: 'top',
//                                        items: [
//                                            {
//                                                xtype: 'button',
//                                                text: Profile.getText('BatchTeamWork')
//                                            },
//                                            {
//                                                xtype: 'button',
//                                                name: 'item',
//                                                itemId: 'item',
//                                                text: '项目'
//                                            },
//                                            {
//                                                xtype: 'button',
//                                                name: 'learn',
//                                                itemId: 'learn',
//                                                text: Profile.getText('Learn')
//                                            }
//                                        ]
//                                    }
//                                ]
//                            }
            ]
        });

        me.callParent(arguments);
    }

});