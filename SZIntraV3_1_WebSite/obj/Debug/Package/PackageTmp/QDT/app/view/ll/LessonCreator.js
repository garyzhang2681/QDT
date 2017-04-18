//创建一个ll training
Ext.define('QDT.view.ll.LessonCreator', {
    extend: 'Ext.form.Panel',
    alias: 'widget.ll-lessoncreator',

    record: {},

    initComponent: function () {
        var me = this;

        var columns = [
            {
                text: Profile.getText('EmployeeName'),
                width: 65,
                dataIndex: 'name_cn'
            }, {
                text: Profile.getText('EmployeeName'),
                width: 90,
                dataIndex: 'name_en'
            }, {
                text: Profile.getText('sso'),
                width: 80,
                dataIndex: 'sso'
            }, {
                text: 'Employee Id', //todo language
                width: 40,
                dataIndex: 'employee_id',
                hidden: true
            }
        ];


        Ext.apply(me, {
            frame: true,
            autoScroll: true,
            border: false,
            bodyPadding: '15',
            defaults: {
                labelWidth: 60,
                margin: '0 0 10 0'
            },

            tbar: [
                {
                    xtype: 'attachmentbutton',
                    iconCls: 'attachment',
                    itemId: 'view-attachment',
                    text: Profile.getText('attachment'),
                    tooltip: Profile.getText('txtViewAttachment'),
                    refType: 'lesson',
                    generateId: false
                }
            ],
            items: [
            {
                xtype: 'container',
                border: true,

                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },

                defaults: {
                    height: 300
                },

                items: [{
                    xtype: 'fieldset',
                    title: Profile.getText('LessonInforamtion'),
                    layout: 'vbox',
                    flex: 2.8,
                    items: [
                                {
                                    xtype: 'hiddenfield',
                                    name: 'id'
                                }, {

                                    xtype: 'displayfield',
                                    name: 'create_by',
                                    fieldLabel: Profile.getText('create_by'),
                                    //  value: '139',
                                    renderer: QDT.util.Renderer.username
                                }, {
                                    xtype: 'displayfield',
                                    name: 'create_date',
                                    fieldLabel: Profile.getText('create_date'),
                                    value: new Date(),
                                    renderer: QDT.util.Renderer.dateTimeRenderer
                                }, {
                                    xtype: 'businesscombo',
                                    name: 'business',
                                    allowBlank: false,
                                    disabled: true,
                                    width: 200
                                }, {
                                    xtype: 'll-categorycombo',
                                    name: 'category_id',
                                    allowBlank: false,
                                    disabled: true
                                }, {
                                    xtype: 'remotecombo',
                                    name: 'failure_mode',
                                    itemId: 'failure_mode',
                                    disabled: true,
                                    editable: false,
                                    displayField: 'failure_mode',
                                    valueField: 'mode_id',
                                    fieldLabel: Profile.getText('failure_mode'),
                                    labelWidth: Profile.getLang() == 'en' ? 100 : 60,
                                    emptyText: Profile.getText('PleaseSelect'),
                                    store: Ext.create('QDT.store.ll.FailureModes')
                                }, {
                                    xtype: 'combobox',
                                    name: 'skill_code_binding_mode',
                                    itemId: 'skill_code_binding_mode',
                                    disabled: true,
                                    displayField: 'skill_code_binding_mode',
                                    editable: false,
                                    valueField: 'skill_code_binding_mode',
                                    fieldLabel: Profile.getText('skill_code_binding_mode'),
                                    store: Ext.create('Ext.data.Store', {
                                        fields: ['skill_code_binding_mode'],
                                        data: [{
                                            'skill_code_binding_mode': "Specific skill to PN/OP"
                                        }, {
                                            'skill_code_binding_mode': "General Skill Code"
                                        }, {
                                            'skill_code_binding_mode': "Not Linked To Skill Code"
                                        }]
                                    }),
                                    emptyText: Profile.getText('PleaseSelect')
                                }, {
                                    xtype: 'll-workinggroupcombo',
                                    itemId: 'working_group',
                                    name: 'working_group',
                                    multiSelect: true,
                                    allowBlank: false,
                                    disabled: true
                                }, {
                                    xtype: 'itemopgroup',
                                    prefix: 'source_',
                                    disabled: true,
                                    hidden: false

                                }, {
                                    xtype: 'employeecombo',
                                    name: 'owner_id',
                                    fieldLabel: Profile.getText('owner'),
                                    disabled: true
                                }, {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    items: [{
                                        xtype: 'numberfield',
                                        name: 'effective_time',
                                        fieldLabel: Profile.getText('CompleteWithin'),
                                        labelWidth: Profile.getLang() == 'en' ? 100 : 60,
                                        width: Profile.getLang() == 'en' ? 150 :110,
                                        disabled: true
                                    }, {
                                        xtype: 'displayfield',
                                        name: 'day',
                                        value: Profile.getText('Day')
                                    }, {
                                        xtype: 'combobox',
                                        name: 'learning_cycle',
                                        disabled: true,
                                        editable: false,
                                        fieldLabel: Profile.getText('learning_cycle'),
                                        labelWidth: Profile.getLang() == 'en' ? 100 : 60,
                                        width: Profile.getLang() == 'en' ? 150 : 110,
                                        displayField: 'day',
                                        valueField: 'day',
                                        margin: '0 0 5 15',
                                        store: Ext.create('Ext.data.Store', {
                                            fields: ['day']
                                        }),
                                        emptyText: Profile.getText('PleaseSelect')
                                    }, {
                                        xtype: 'displayfield',
                                        name: 'day',
                                        value: Profile.getText('Day')
                                    }]
                                }, {
                                    xtype: 'checkbox',
                                    name: 'restrict_all',
                                    boxLabel: Profile.getText('CompulsoryForAll'),

                                    value: false,
                                    disabled: true
                                }
                            ]
                }, {
                    xtype: 'fieldset',
                    title: Profile.getText('SelectTrainee'),
                    margin: '0 0 10 0',
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    defaults: {
                        margin: '5 5 5 5',
                        autoScroll: true,
                        columns: columns,
                        flex: 1,
                        stripeRows: true,
                        sortable: false
                    },
                    flex: 4,
                    items: [{
                                    xtype: 'livesearchgridpanel',
                                    store: Ext.create('Ext.data.Store', {
                                        model: 'Asz.model.hr.Employee'
                                    }),
                                    itemId: 'all_employee_grid',
                                    name: 'all_employee',

                                    multiSelect: true,
                                    viewConfig: {
                                        plugins: {
                                            ptype: 'gridviewdragdrop'
                                        }
                                    },
                                    title: Profile.getText('AllEmployees')
                                }, {
                                    xtype: 'livesearchgridpanel',
                                    store: Ext.create('Ext.data.Store', {
                                        model: 'Asz.model.hr.Employee'
                                    }),
                                    itemId: 'trainees_grid',
                                    name: 'trainees',

                                    multiSelect: true,
                                    viewConfig: {
                                        plugins: {
                                            ptype: 'gridviewdragdrop'
                                        }
                                    },
                                    title: Profile.getText('Trainees')
                                }
                    //                                ,{
                    //                                    xtype: 'livesearchgridpanel',
                    //                                    store: Ext.create('Ext.data.Store', {
                    //                                        model: 'Asz.model.hr.Employee'
                    //                                    }),
                    //                                    itemId: 'approvers_grid',
                    //                                    name: 'approvers',

                    //                                    multiSelect: true,
                    //                                    viewConfig: {
                    //                                        plugins: {
                    //                                            ptype: 'gridviewdragdrop'
                    //                                        }
                    //                                    },
                    //                                    title: Profile.getText('Approver')
                    //                                }
                                ]
                }]
            }, {
                xtype: 'fieldset',
                title: Profile.getText('LessonContent'),
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [{
                    xtype: 'textfield',
                    name: 'subject',
                    fieldLabel: Profile.getText('subject'),
                    width: 400,
                    minWidth: 320,
                    disabled: true
                }, {
                    xtype: 'textarea',
                    name: 'detail',
                    border: 5,
                    height: 120,
                   // fontFamilies: Asz.util.Config.fontFamilies,
                    fieldLabel: Profile.getText('detail'),
                    readOnly: true
                }]
            }],
            buttons: [{
                iconCls: 'save',
                itemId: 'save',
                text: Profile.getText('Create'),
                handler: me.onSaveClick,
                scope: me
            }, {
                iconCls: 'undo',
                itemId: 'undo',
                text: Profile.getText('Reset'),
                handler: me.onResetClick,
                scope: me,
                hidden: true
            }]
        });


        me.callParent();

        me.on({
            afterrender: me.onLessonCreatorRender
        });

    },

    onSaveClick: function () {
        var me = this;

        var lessonId = me.down('[name=id]').value;
        var trainees = me.getRecordsData(me.down('[name=trainees]').store.getRange());
        // var approvers = me.getRecordsData(me.down('[name=approvers]').store.getRange());

        if (trainees.length == 0) {
            My.Msg.warning('请选择受训者');
        }
        //        else if (approvers.length == 0) {
        //            My.Msg.warning('请选择批准人');
        //        }
        else {
            me.down('#save').disable();
            // DpLl.CreateTraining(lessonId, trainees, approvers, function (result) {
            DpLl.CreateTraining(lessonId, trainees, function (result) {
                if (result.success) {
                    My.Msg.alert('Result', 'Create Training Successfully');
                    me.close();
                } else {
                    My.Msg.warning(result.erroeMessage);
                }
                me.down('#save').enable();
            });
        }
    },

    getRecordsData: function (records) {
        var array = [];
        for (var i = 0; i < records.length; i++) {
            array.push(records[i].data);
        }
        return array;
    },


    onResetClick: function () {

    },


    onLessonCreatorRender: function () {
        var me = this;
        me.getForm().loadRecord(me.record);

        var lessonId = me.record.get('id');
        // var lessonId = me.down('[name=id]').getValue();
        var attachmentBtn = me.down('#view-attachment');
        var attachmentQuantity = me.record.get('attachment_quantity');
        attachmentBtn.setRefNum(lessonId);

        attachmentBtn.refreshText(attachmentQuantity);


        var failureModeStore = Ext.create('QDT.store.ll.FailureModes');
        failureModeStore.load({
            callback: function (records, operation, success) {
                var record = failureModeStore.findRecord('mode_id', me.record.get('failure_mode'), 0, false, false, true);
                me.down('#failure_mode').setValue(record);
            }
        });

        var working_groups_string = me.record.get('working_group');
        if (working_groups_string != '') {
            var working_groups = working_groups_string.substring(1, working_groups_string.length - 1).split('},{');
            var groups = new Array();
            for (index in working_groups) {
                groups.push(parseInt(working_groups[index]));
            }
            me.down('[name=working_group]').clearValue();
            me.down('[name=working_group]').store.load();
            me.down('[name=working_group]').setValue(groups, true);


            DpHr.GetEmployeesInWorkingGroups(groups, function (result) {
                if (result.success) {
                    me.down('[itemId=trainees_grid]').store.loadData(result.data);
                } else {
                    My.Msg.warning(result.errorMessage);
                }
            });
            DpHr.GetEmployeesNotInWorkingGroups(groups, function (result) {
                if (result.success) {
                    me.down('[itemId=all_employee_grid]').store.loadData(result.data);
                } else {
                    My.Msg.warning(result.errorMessage);
                }
            });

        }

        DpLl.GetSourcePartNumber(me.record.get('id'), function (result) {
            if (result.success) {
                if (result.data.length >= 1) {
                    var item = Ext.create('Asz.model.util.Item', {
                        item: result.data[0].item
                    });
                    //                    var oper_num = Ext.create('Ext.data.Model', {
                    //                        fields: [
                    //                            { name: 'oper_num', mapping: 'oper_num' }
                    //                        ],
                    //                        oper_num: result.data[0].operation
                    //                    });


                    me.down('#source_part_num').setValue(item);
                    me.down('#source_oper_num').show();
                    me.down('#source_oper_num').setValue(result.data[0].operation);
                    me.down('#source_oper_num').setDisabled(true);
                    me.down('#source_part_num').disable();
                    me.down('#source_oper_num').disable();
                } else {
                    me.down('#source_part_num').hide();
                    me.down('#source_oper_num').hide();

                }
            } else {
                My.Msg.warning(result.errorMessage);
            }
        });
        //        DpLl.GetRestrictItem(me.record.get('id'), function (result) {
        //            if (result.success) {
        //                if (result.data.length >= 1) {
        //                    me.down('[name=restrict_run]').setValue(true);
        //                    var item = Ext.create('QDT.model.Item', {
        //                        item: result.data[0].item
        //                    });
        //                    me.down('[name=part_num]').setValue(item);
        //                }
        //            } else {
        //                My.Msg.warning(result.errorMessage);
        //            }
        //        });
    },

    resetAttachmentButtonText: function (button, quantity) {
        button.setText(Profile.getText('attachment') + ((quantity > 0) ? Ext.String.format('({0})', quantity) : ''));
    }
});