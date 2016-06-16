Ext.define('QDT.view.ll.Training', {
    extend: 'Ext.window.Window',
    alias: 'widget.ll-training',
    record: {},
    isApprover: null,
    title: Profile.getText('Training'),
    height: 550,
    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            frame: true,
            // autoScroll: true,
            overflowY: 'auto',

            border: false,

            items: [{
                xtype: 'form',
                frame: true,
                bodyPadding: '15',
                defaults: {
                    labelWidth: 60,
                    margin: '0 10 10 0'
                },
                tbar: [{
                    xtype: 'attachmentbutton',
                    iconCls: 'attachment',
                    itemId: 'view-attachment',
                    text: Profile.getText('attachment'),
                    tooltip: Profile.getText('txtViewAttachment'),
                    refType: 'lesson',
                    generateId: false,
                    viewerMode: true
                }],
                items: [{
                    xtype: 'container',

                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },

                    items: [{
                        xtype: 'fieldset',
                        title: Profile.getText('LessonInforamtion'),
                        margin: '0 5 5 0',
                        layout: 'vbox',
                        items: [
                                {
                                    xtype: 'hiddenfield',
                                    name: 'request_id'
                                }, {
                                    xtype: 'hiddenfield',
                                    name: 'certification_id'
                                }, {
                                    xtype: 'hiddenfield',
                                    name: 'lesson_id'
                                }, {
                                    xtype: 'hiddenfield',
                                    name: 'current_process_id'
                                },
                                {
                                    //TODO: get cookie user
                                    xtype: 'displayfield',
                                    name: 'requestor',
                                    fieldLabel: Profile.getText('requestor'),
                                    renderer: QDT.util.Renderer.username
                                }, {
                                    xtype: 'displayfield',
                                    name: 'start_time',
                                    fieldLabel: Profile.getText('create_date'),

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
                                    disabled: true,
                                    width: 200
                                }, {
                                    xtype: 'combobox',
                                    name: 'working_group',
                                    fieldLabel: Profile.getText('working_group'),
                                    multiSelect: true,
                                    store: 'QDT.store.ll.WorkingGroups',
                                    displayField: 'working_group',
                                    valueField: 'working_group_id',
                                    allowBlank: false,
                                    disabled: true
                                }, {
                                    xtype: 'itemopgroup',
                                    prefix: 'source_',
                                    disabled: true

                                }, {
                                    xtype: 'employeecombo',
                                    name: 'owner_id',
                                    fieldLabel: Profile.getText('owner'),
                                    disabled: true
                                }, {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    items: [
                                        {
                                            xtype: 'numberfield',
                                            name: 'effective_time',
                                            fieldLabel: Profile.getText('CompleteWithin'),
                                            labelWidth: 58,
                                            allowDecimals: false,
                                            minValue: 1,
                                            disabled: true
                                        }, {
                                            xtype: 'displayfield',
                                            name: 'day',
                                            value: Profile.getText('Day')
                                        }
                                    ]
                                }, {
                                    xtype: 'checkbox',
                                    name: 'restrict_all',
                                    boxLabel: Profile.getText('CompulsoryForAll'),
                                    width: 100,
                                    value: false,
                                    disabled: true
                                }]
                    }, {
                        xtype: 'fieldset',
                        title: Profile.getText('SubmitContent'),

                        layout: {
                            type: 'vbox'
                        },
                        defaults: {
                            margin: '5 5 5 20'
                        },
                        width: 405,
                        items: [{
                            xtype: 'textarea',
                            fieldLabel: '培训备注',
                            name: 'remark',
                            width: 350,
                            height: 200
                        }],
                        readonly: !me.isApprover
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
                        anchor: '50%',
                        minWidth: 320,
                        disabled: true
                    }, {
                        xtype: 'textarea',
                        name: 'detail',
                        height: 120,
                        width:650,
                        readOnly: true,
                        fieldLabel: Profile.getText('detail'),
                        border: 5
                    }]
                }]
            }],
            buttons: [
                {
                    iconCls: 'save',
                    itemId: 'save',
                    text: Profile.getText('Submit'),
                    handler: me.onSubmitClick,
                    scope: me,
                    hidden: !me.isApprover
                }, {
                    iconCls: 'undo',
                    itemId: 'undo',
                    text: Profile.getText('Reset'),
                    handler: me.onResetClick,
                    scope: me,
                    hidden: true
                },
                {
                    iconCls: 'close',
                    itemId: 'close',
                    text: Profile.getText('Close'),
                    handler: me.onCloseClick,
                    scope: me,
                    hidden: me.isApprover
                }
            ]
        });


        me.callParent();

        me.on({
            afterrender: me.onTrainingRender
        });

    },

    onCloseClick: function () {
        var me = this;
        me.close();
    },

    onSubmitClick: function () {
        var me = this;

        var currentProcessId = me.down('[name=current_process_id]').value;
        var remark = me.down('[name=remark]').value;
        DpLl.FinishTraining(currentProcessId, remark, function (result) {
            if (result.success) {
                if (result.approve_result) {
                    My.Msg.warning('批准成功');
                    //reload traingList
                    cq.query('ll-mytraininglist')[0].store.load();
                } else {
                    My.Msg.warning('您没有权限进行此操作！');
                }
            } else {
                My.Msg.warning(result.errorMessage);
            }
            me.close();
        });
    },

    onResetClick: function () {

    },

    onTrainingRender: function () {
        var me = this;
        me.down('form').loadRecord(me.record);


        var lessonId = me.record.get('lesson_id');

        // var lessonId = me.down('[name=id]').getValue();
        var attachmentBtn = me.down('#view-attachment');
        var attachmentQuantity = me.record.get('attachment_quantity');
        attachmentBtn.setRefNum(lessonId);
        attachmentBtn.refreshText(attachmentQuantity);





        var working_groups_string = me.record.get('working_group');
        if (working_groups_string != '') {
            var working_groups = working_groups_string.substring(1, working_groups_string.length - 1).split('},{');
            var groups = new Array();
            for (index in working_groups) {
                groups.push(parseInt(working_groups[index]));
            }
            me.down('[name=working_group]').clearValue();
            me.down('[name=working_group]').setValue(groups, true);

        }

        DpLl.GetSourcePartNumber(me.record.get('lesson_id'), function (result) {
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
                    me.down('#source_oper_num').setDisabled(false);
                    me.down('#source_oper_num').setValue(result.data[0].operation);
                }
            } else {
                My.Msg.warning(result.errorMessage);
            }
        });
        //        DpLl.GetRestrictItem(me.record.get('lesson_id'), function (result) {
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
    }
});