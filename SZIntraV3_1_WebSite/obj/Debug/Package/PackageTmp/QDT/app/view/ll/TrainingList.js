Ext.define('QDT.view.ll.TrainingList', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.ll-traininglist',

    initComponent: function () {
        var me = this;

        var training_store = Ext.create('QDT.store.ll.Trainings', {
            listeners: {
                datachanged: function () {
                    me.getSelectionModel().deselectAll();
                }
            }
        });

        Ext.apply(training_store.proxy.extraParams, {
            isAll: true
        });


        Ext.applyIf(me, {
            title: Profile.getText('Training'),
            store: training_store,

            columns: [{
                dataIndex: 'request_id', text: 'request id', width: 30, hidden: true
            }, {
                dataIndex: 'lesson_id', text: 'lesson_id', width: 30, hidden: true
            }, {
                dataIndex: 'employee_id', text: Profile.getText('trainee'), width: 80, renderer: QDT.util.Renderer.employeeName
            }, {
                dataIndex: 'subject', text: Profile.getText('subject'), flex: 1, minWidth: 100, renderer: QDT.util.Renderer.ellipsis(25, false)
            }, {
                dataIndex: 'detail', text: Profile.getText('detail'), flex: 2, minWidth: 200, renderer: QDT.util.Renderer.ellipsis(100, false)
            }, {
                dataIndex: 'business', text: Profile.getText('business'), width: 100
            }, {
                dataIndex: 'start_time', text: Profile.getText('create_date'), width: 90, renderer: QDT.util.Renderer.dateTimeRenderer
            }, {
                dataIndex: 'due_date', text: Profile.getText('due_date'), width: 90, renderer: QDT.util.Renderer.dateRenderer
            }, {
                dataIndex: 'requestor', text: Profile.getText('create_by'), width: 80, renderer: QDT.util.Renderer.username
            }, {
                dataIndex: 'status', text: Profile.getText('status'), width: 100
            }, {
                dataIndex: 'current_step', text: Profile.getText('current_step'), width: 150, hidden: true
            }, {
                dataIndex: 'current_step_name', text: Profile.getText('current_step'), width: 150
            }
            //{
           //     dataIndex: 'current_approvers', text: Profile.getText('Approver'), width: 100, renderer: QDT.util.Renderer.usernames
           // }
            ],


            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                margin: '0 0 5 0',
                layout: 'fit',
                items: [{
                    xtype: 'form',

                    layout: 'vbox',
                    name: 'search_training',
                    itemId: 'search_training',
                    frame: true,
                    items: [{
                        xtype: 'container',
                        layout: 'hbox',
                        margin: '0 0 5 0',
                        defaults: {
                            margin: '2 10 0 0'
                        },
                        items: [{
                            xtype: 'll-workinggroupcombo',
                            name: 'working_group',
                            itemId: 'working_group',
                            editable: false
                        }, {
                            xtype: 'itemcombo',
                            name: 'part_num',
                            itemId: 'part_num',
                            labelWidth: Profile.getLang() == 'en' ? 30 : 40,
                            width: 120
                        }, {
                            xtype: 'businesscombo',
                            name: 'business',
                            labelWidth: Profile.getLang() == 'en' ? 30 : 60,
                            width: 140
                        }, {
                            xtype: 'checkbox',
                            boxLabel: Profile.getText('ExpiredLearning'),
                            name:'expired_training',
                            itemId:'expired_training'
                        }]
                    }, {
                        xtype: 'container',
                        layout: 'hbox',
                        defaults: {
                            margin: '2 10 0 0'
                        },
                        items: [{
                            xtype: 'll-categorycombo',
                            name: 'category_id',
                            itemId: 'category_id',
                            labelWidth: Profile.getLang() == 'en' ? 30 : 60,
                            width: 140
                        }, {
                            xtype: 'textfield',
                            name: 'subject',
                            itemId: 'subject',
                            fieldLabel: Profile.getText('subject'),
                            labelWidth: Profile.getLang() == 'en' ? 30 : 30,
                            width: 150
                        }, {
                            xtype: 'container',
                            layout: 'hbox',
                            items: [{
                                xtype: 'datefield',
                                fieldLabel: Profile.getText('due_date'),
                                name: 'due_date_start',
                                labelWidth: Profile.getLang() == 'en' ? 30 : 40

                            }, {
                                xtype: 'datefield',
                                fieldLabel: Profile.getText('To'),
                                labelWidth: 20,
                                margin: '0 0 0 5',
                                name: 'due_date_end'

                            }]
                        }]
                    }, {
                        xtype: 'container',
                        layout: 'hbox',
                        defaults: {
                            margin: '2 10 2 0'
                        },
                        items: [{
                            xtype: 'employeecombo',
                            name: 'owner_id',
                            itemId: 'owner_id',
                            fieldLabel: Profile.getText('owner'),
                            store: Ext.create('Asz.store.hr.Employees'),
                            labelWidth: Profile.getLang() == 'en' ? 30 : 40,
                            width: 40
                        }, {
                            xtype: 'nativeusercombo',
                            name: 'requestor',
                            itemId: 'requestor',
                            fieldLabel: Profile.getText('create_by'),
                            labelWidth: Profile.getLang() == 'en' ? 30 : 40,
                            width: 40
                        }, {
                            xtype: 'employeecombo',
                            name: 'request_for',
                            itemId: 'request_for',
                            store: Ext.create('Asz.store.hr.Employees'),
                            fieldLabel: Profile.getText('trainee'),
                            labelWidth: Profile.getLang() == 'en' ? 30 : 50,
                            width: 40
                        }, {
                            xtype: 'button',
                            iconCls: 'undo',
                            itemId: 'clear',
                            name: 'clear',
                            text: Profile.getText('clear')
                        }, {
                            xtype: 'button',
                            iconCls: 'search',
                            itemId: 'search',
                            name: 'search',
                            text: Profile.getText('Search')
                        }]
                    }]
                }]
            }, {
                xtype: 'pagingtoolbar',
                store: training_store,
                itemId: 'training_pages',
                name: 'training_pages',
                dock: 'bottom',
                displayInfo: true
            }]
        });

        me.callParent();

        me.on({
            afterrender: me.onAfterRender
        });
    },
    onAfterRender: function () {
        this.getStore().load();
    }
});