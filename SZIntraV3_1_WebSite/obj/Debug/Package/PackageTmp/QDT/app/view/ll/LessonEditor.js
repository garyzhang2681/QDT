//创建一个lesson   bom
Ext.define('QDT.view.ll.LessonEditor', {
    extend: 'Ext.form.Panel',
    alias: 'widget.ll-lessoneditor',
    //add or edit
    saveMode: '',
    record: {},


    initComponent: function () {
        var me = this;
        //  var workingGroups = Ext.create('QDT.store.ll.WorkingGroups');
        //    var failureModes = Ext.create('QDT.store.ll.FailureModes');
        Ext.apply(me, {
            frame: true,
            autoScroll: true,
            border: false,
            bodyPadding: '15',
            api: { submit: 'DpLl.SaveLesson' },
            defaults: {
                labelWidth: Profile.getLang() == 'en' ? 100 : 60,
                margin: '0 0 5 0'
                //  width:300
            },
            tbar: [{
                xtype: 'attachmentbutton',
                iconCls: 'attachment',
                itemId: 'view-attachment',
                text: Profile.getText('attachment'),
                tooltip: Profile.getText('txtViewAttachment'),
                refType: 'lesson',
                generateId: false
            }],
            items: [{
                xtype: 'hiddenfield',
                name: 'save_mode',
                value: me.saveMode
            }, {
                xtype: 'hiddenfield',
                itemId: 'id',
                name: 'id'
            }, {
                // TODO： Load data
                xtype: 'displayfield',
                name: 'create_by',
                itemId: 'create_by',
                fieldLabel: Profile.getText('create_by'),
                value: Profile.getUser().user_id,
                renderer: QDT.util.Renderer.username
            },
            {
                // TODO： Load data
                xtype: 'displayfield',
                name: 'create_date',
                fieldLabel: Profile.getText('create_date'),
                value: Ext.date

                // renderer: QDT.util.Renderer.dateTimeRenderer
            }, {
                xtype: 'businesscombo',
                name: 'business',
                allowBlank: false

            }, {
                xtype: 'container',
                layout: 'hbox',
                items: [{
                    xtype: 'll-categorycombo',
                    name: 'category_id',
                    itemId: 'category_id',
                    labelWidth: Profile.getLang() == 'en' ? 100 : 60
                }, {
                    xtype: 'remotecombo',
                    name: 'failure_mode',
                    itemId: 'failure_mode',
                    editable: false,
                    displayField: 'failure_mode',
                    valueField: 'mode_id',
                    fieldLabel: Profile.getText('failure_mode'),
                    labelWidth: Profile.getLang() == 'en' ? 100 : 60,
                    margin: '0 0 5 15',
                    emptyText: Profile.getText('PleaseSelect'),
                    store: Ext.create('QDT.store.ll.FailureModes')
                }]
            }, {
                xtype: 'll-workinggroupcombo',
                name: 'working_group',
                itemId: 'working_group',
                multiSelect: true,
                editable: false,
                allowBlank: false
            },
            {
                xtype: 'itemopgroup',
                prefix: 'source_',
                hidden: false,
                disabled: false
            }, {
                xtype: 'employeecombo',
                fieldLabel: Profile.getText('owner'),
                name: 'owner_id',
                pageSize: 10,
                forctSelection: true,
                allowBlank: false
            }, {
                xtype: 'container',
                layout: 'hbox',
                items: [{
                    xtype: 'numberfield',
                    name: 'effective_time',
                    fieldLabel: Profile.getText('effective_time'),
                    labelWidth: Profile.getLang() == 'en' ? 100 : 60,
                    allowDecimals: false,
                    minValue: 1,
                    value: 30
                }, {
                    xtype: 'displayfield',
                    name: 'day',
                    value: Profile.getText('Day')
                }, {
                    xtype: 'combobox',
                    name: 'learning_cycle',
                    editable: false,
                    fieldLabel: Profile.getText('learning_cycle'),
                    labelWidth: Profile.getLang() == 'en' ? 100 : 60,
                    displayField: 'day',
                    valueField: 'day',
                    margin: '0 0 5 15',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['day'],
                        data: [{ "day": 90 }, { "day": 180 }, { "day": 365}]
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
                width: 150,
                value: false
            }, {
                xtype: 'combobox',
                name: 'skill_code_binding_mode',
                itemId: 'skill_code_binding_mode',
                displayField: 'skill_code_binding_mode',
                editable: false,
                width:210,
                valueField: 'skill_code_binding_mode',
                fieldLabel: Profile.getText('skill_code_binding_mode'),
                store: Ext.create('Ext.data.Store', {
                    fields: ['skill_code_binding_mode'],
                    data: [
                    {
                        'skill_code_binding_mode': "Specific skill to PN/OP"
                    }, {
                        'skill_code_binding_mode': "General Skill Code"
                    }, {
                        'skill_code_binding_mode': "Not Linked To Skill Code"
                    }]
                }),
                emptyText: Profile.getText('PleaseSelect')
            }, {
                xtype: 'textfield',
                name: 'subject',
                fieldLabel: Profile.getText('subject'),
                anchor: '50%',
                minWidth: 320
            }, {
                xtype: 'textarea',
                name: 'detail',
                height:120,
             //   fontFamilies: Asz.util.Config.fontFamilies,
                fieldLabel: Profile.getText('detail'),
                anchor: '80%'
            }
        ],
            buttons: [{
                iconCls: 'save',
                itemId: 'save',
                text: Profile.getText('Save'),
                handler: me.onSaveClick,
                scope: me
            }, {
                iconCls: 'undo',
                itemId: 'undo',
                text: Profile.getText('Reset'),
                handler: me.onResetClick,
                scope: me
            }]
        });


        me.callParent();

        me.on({
            afterrender: me.onLessonEditorRender,
            close: me.onLessonEditorClose
        });

    },

    onSaveClick: function () {
        var me = this;

        me.getForm().submit({
            waitMsg: '正在提交数据',
            waitTitle: '提示',
            success: function (form, action) {
                if (me.checkIsEditMode()) {
                    My.Msg.alert('结果', Profile.getText('txtRecordUpdated'));
                    me.close();
                }
                else {
                    My.Msg.alert('结果', Profile.getText('txtRecordCreated'));
                    me.close();
                }
                cq.query('ll-lessonlist')[0].store.load();
            },
            failure: function (form, action) {
                My.Msg.warning('保存失败！');
            }
        });
    },

    onResetClick: function () {
        var me = this,
            btnAttachment = me.down('#view-attachment');
        Ext.Msg.confirm(Profile.getText('Confirm'), Profile.getText('txtAttachmentWillAlsoBeDeleted'), function (btn) {
            if (btn === 'yes') {
                me.deregisterDummyId();
                me.getForm().reset();
                me.registerDummyId();
                btnAttachment.refreshText(0);
            }
        });
    },

    onLessonEditorRender: function () {
        var me = this;
        if (!me.checkIsEditMode()) {

            me.registerDummyId();

        } else {
            me.getForm().loadRecord(me.record);

            var lessonId = me.record.get('id');
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
                me.down('#working_group').clearValue();
                me.down('#working_group').store.load();
                me.down('#working_group').setValue(groups,true);
            }


            var failureModeStore = Ext.create('QDT.store.ll.FailureModes');
            failureModeStore.load({
                callback: function (records, operation, success) {
                    var record = failureModeStore.findRecord('mode_id', me.record.get('failure_mode'), 0, false, false, true);
                    me.down('#failure_mode').setValue(record);
                }
            });

            DpLl.GetSourcePartNumber(me.record.get('id'), function (result) {
                if (result.success) {
                    if (result.data.length >= 1) {
                        var item = Ext.create('Asz.model.util.Item', {
                            item: result.data[0].item
                        });

                        me.down('#source_part_num').setValue(item);
                        me.down('#source_oper_num').show();
                        me.down('#source_oper_num').setDisabled(false);
                        me.down('#source_oper_num').setValue(result.data[0].operation);
                    }
                } else {
                    My.Msg.warning(result.errorMessage);
                }
            });
        }
    },

    onLessonEditorClose: function () {
        var me = this;
        me.deregisterDummyId();
    },

    registerDummyId: function () {
        var me = this;
        DpUtil.RegisterDummyId(function (result) {
            if (result.success) {

                var dummy_id = result.data;
                me.down('[name=id]').setValue(dummy_id);
                me.down('#view-attachment').setRefNum(dummy_id);
            } else {
                QDT.util.Util.showErrorMessage(result.errorMessage);
            }
        });
    },

    deregisterDummyId: function () {
        var me = this,
            id = me.down('[name=id]').getValue();
        if (id.length > 0 && !me.checkIsEditMode()) {
            DpUtil.DeregisterDummyId(id, QDT.util.Util.generalDirectCallBack);
        }
    },

    checkIsEditMode: function () {
        return this.saveMode === 'edit';
    },

    switchToSaveMode: function (lessonId) {
        var me = this;
        me.saveMode = 'save';
        me.setTitle(Profile.getText('EditLesson'));
        me.getForm().setValues({
            id: lessonId
        });
    },

    resetAttachmentButtonText: function (button, quantity) {
        button.setText(Profile.getText('attachment') + ((quantity > 0) ? Ext.String.format('({0})', quantity) : ''));
    }
});