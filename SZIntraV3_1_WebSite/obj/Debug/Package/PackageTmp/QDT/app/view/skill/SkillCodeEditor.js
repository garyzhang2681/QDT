Ext.define('QDT.view.skill.SkillCodeEditor', {
    extend: 'Ext.window.Window',
    alias: 'widget.skill-skillcodeeditor',
    autoShow: true,
    constrainHeader: true,
    width: 320,
    modal: true,
    saveMode: '',

    initComponent: function () {
        var me = this,
            form = Ext.widget('form', {
                api: { submit: 'DpSkill.SaveSkillCode' },
                frame: true,
                trackResetOnLoad: me.checkIsEditMode(),
                bodyPadding: 10,
                defaults: {
                    labelWidth: 80,
                    allowBlank: false
                },
                items: [
                {
                    name: 'id',
                    xtype: 'hiddenfield'
                }, {
                    name: 'save_mode',
                    xtype: 'hiddenfield',
                    value: me.saveMode
                }, {
                    name: 'skill_code',
                    xtype: 'textfield',
                    editable: true,
                    fieldLabel: Profile.getText('skill_code'),
                    readOnly: me.checkIsEditMode(),
                    readOnlyCls: 'readonly'

                }, {
                    name: 'description',
                    xtype: 'combo',
                    queryMode: 'remote',
                    store: Ext.create('Ext.data.DirectStore', {
                        directFn: 'DpSkill.GetSkillCodeDescriptions',
                        root: 'data',
                        paramOrder: 'query',
                        fields: [
                            'description'
                        ]
                    }),
                    displayField: 'description',
                    fieldLabel: Profile.getText('description'),
                    allowBlank: true
                }, {
                    name: 'category',
                    xtype: 'combo',
                    queryMode: 'remote',
                    store: Ext.create('Ext.data.DirectStore', {
                        directFn: 'DpSkill.GetSkillCodeCategories',
                        root: 'data',
                        paramOrder: 'query',
                        fields: [
                            'category'
                        ]
                    }),
                    displayField: 'category',
                    fieldLabel: Profile.getText('category'),
                    allowBlank: true
                }, {
                    xtype: 'worktypecombo',
                    name: 'work_type',
                    itemId: 'work_type',
                    readOnly: me.checkIsEditMode(),
                    readOnlyCls: 'readonly'
                }, {
                    //disabled if work type not run
                    xtype: 'businesscombo',
                    name: 'business',
                    itemId: 'business',
                    readOnly: me.checkIsEditMode(),
                    readOnlyCls: 'readonly',
                    width:180,
                    store: Ext.create('Ext.data.Store', {
                        fields: [
                            'business',
                            {
                                name: 'business_unit',
                                convert: function (v, record) {
                                    return Ext.String.capitalize(record.data.business);
                                }
                            }
                        ],
                        data: [
                            {
                                business: 'actuation'
                            }, {
                                business: 'composite'
                            }, {
                                business: 'machining'
                            }, {
                                business: 'qa-actuation'
                            }, {
                                business: 'qa-composite'
                            }, {
                                business: 'qa-machining'
                            }, {
                                business: 'quality'
                            }, {
                                business: 'warehouse'
                            }
                        ]
                    })
                }, {
                    //from table qdt_workflow -> business
                    xtype: 'combobox',
                    fieldLabel: '技能类型',
                    name: 'workflow_type',
                    itemId: 'workflow_type',
                    displayField: 'workflow_type_string',
                    valueField: 'workflow_type',
                    readOnly: me.checkIsEditMode(),
                    editable:false,
                    readOnlyCls: 'readonly',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['workflow_type', 'workflow_type_string'],
                        data: [{
                            workflow_type: 'machining',
                            workflow_type_string: 'Machining'
                        }, {
                            workflow_type: 'actuation',
                            workflow_type_string: 'Actuation'
                        }, {
                            workflow_type: 'composite',
                            workflow_type_string: 'Composite'
                        }, {
                            workflow_type: 'quality',
                            workflow_type_string: 'Quality'
                        }, {
                            workflow_type: 'specialIns',
                            workflow_type_string: 'Special Inspection'
                        }, {
                            workflow_type: 'warehouse',
                            workflow_type_string: 'Warehouse'
                        }]
                    })
                }, {
                    xtype: 'fieldset',
                    layout: 'vbox',
                    title: Profile.getText('Time'),
                    defaults: {
                        margin: '5 0 5 0'
                    },
                    items: [{
                        xtype: 'checkboxfield',
                        name: 'is_special_skill',
                        itemId: 'is_special_skill',
                        boxLabel: Profile.getText('Is_Special_Skill')
                    }, {
                        xtype: 'container',
                        layout: 'hbox',
                        items: [{
                            xtype: 'combobox',
                            name: 'learning_time',
                            itemId: 'learning_time',
                            editable: false,
                            labelWidth: 80,
                            readOnly: me.checkIsEditMode(),
                            fieldLabel: Profile.getText('learning_time'),
                            displayField: 'day',
                            valueField: 'day',
                            store: Ext.create('Ext.data.Store', {
                                fields: ['day'],
                                data: [{ "day": 90 }, { "day": 180 }, { "day": 270 }, { "day": 365}]
                            }),
                            value: 270
                        }, {
                            xtype: 'displayfield',
                            name: 'day',
                            maring: '0 0 0 5',
                            value: Profile.getText('Day')
                        }]
                    }, {
                        xtype: 'container',
                        layout: 'hbox',
                        items: [{
                            xtype: 'combobox',
                            name: 'effective_time',
                            itemId: 'effective_time',
                            editable: false,
                            labelWidth: 80,
                            readOnly: me.checkIsEditMode(),
                            fieldLabel: Profile.getText('effective_time1'),
                            displayField: 'day',
                            valueField: 'day',
                            store: Ext.create('Ext.data.Store', {
                                fields: ['day'],
                                data: [{ "day": 90 }, { "day": 180 }, { "day": 365}, { "day": 730}]
                            }),
                            value: 180
                        }, {
                            xtype: 'displayfield',
                            name: 'effective_time_day',
                            itemId: 'effective_time_day',
                            maring: '0 0 0 5',
                            value: Profile.getText('Day')
                        }]
                    }, {
                        xtype: 'container',
                        layout: 'hbox',
                        items: [{
                            xtype: 'combobox',
                            name: 'invalid_time',
                            editable: false,
                            fieldLabel: Profile.getText('invalid_time'),
                            displayField: 'day',
                            valueField: 'day',
                            labelWidth: 80,

                            readOnly: me.checkIsEditMode(),
                            store: Ext.create('Ext.data.Store', {
                                fields: ['day'],
                                data: [{ "day": 90 }, { "day": 180 }, { "day": 365 }, { "day": 730}]
                            }),
                            value: 365
                        }, {
                            xtype: 'displayfield',
                            name: 'day',
                            maring: '0 0 0 5',
                            value: Profile.getText('Day')
                        }]
                    }]
                }, {
                    xtype: 'checkboxfield',
                    name: 'critical',
                    boxLabel: Profile.getText('critical_skill')
                }],
                buttons: [{
                    iconCls: 'submit',
                    text: Profile.getText('Save'),
                    handler: me.onSubmitClick,
                    scope: me
                }, {
                    iconCls: 'cancel',
                    text: Profile.getText('Reset'),
                    handler: function () {
                        me.down('form').getForm().reset();
                    }
                }]
            });

        Ext.applyIf(me, {
            title: me.checkIsEditMode() ? Profile.getText('EditSkillCode') : Profile.getText('CreateSkillCode'),
            items: [form]
        })


        me.callParent();
    },

    checkIsEditMode: function () {
        return this.saveMode === 'edit';
    },

    onSubmitClick: function () {
        var me = this,
            formPanel = me.down('form');
        if (formPanel.isValid()) {
            formPanel.submit({
                success: function (form, action) {
                    formPanel.getForm().updateRecord();
                    Ext.Msg.alert(
                        Profile.getText('Success'),
                        me.checkIsEditMode() ? Profile.getText('txtRecordUpdated') : Profile.getText('txtRecordCreated')
                    );
                },
                failure: function (form, action) {
                    Ext.Msg.alert(Profile.getText('Error'), action.result.errorMessage);
                }
            });
        } else {
            Ext.Msg.alert(Profile.getText('Error'), Profile.getText('txtFormContainsError'));
        }
    }
});