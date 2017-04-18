Ext.define('QDT.view.inspection.CustomInspection', {
    extend: 'Ext.form.Panel',
    alias: 'widget.inspection-custominspection',
    api: { submit: 'DpInspection.SendCustomInspection' },
    create_by: null,
    create_by_name: null,
    border: false,
    initComponent: function () {
        var me = this;

        me.items = [{
            xtype: 'form',
            layout: 'anchor',
            frame: true,
            border: false,
            defaults: {
                anchor: '95%',
                labelWidth: 75,
                margin: '5 5 5 5'
            },

            items: [{
                xtype: 'displayfield',
                fieldLabel: Profile.getText('InspectionCreator'),
                value: me.create_by_name
            }, {
                xtype: 'combobox',
                fieldLabel: Profile.getText('inspection_type'),
                name: 'inspection_type',
                store: Ext.create('QDT.store.inspection.CustomInspectionTypes'),
                displayField: 'name',
                valueField: 'inspection_type_id',
                editable: false,
                listeners: {
                    select: me.onInspectionTypeSelect,
                    scope: me
                }
            }, {
                xtype: 'searchcombo',
                name: 'project',
                hideTrigger: false,
                store: Ext.create('QDT.store.inspection.CustomProjects'),
                valueField: 'project_id',
                displayField: 'project',
                fieldLabel: Profile.getText('Project'),
                listeners: {
                    select: me.onInspectionProjectSelect,
                    scope: me
                }
            }, {
                xtype: 'combobox',
                name: 'inspection_location',
                fieldLabel: Profile.getText('inspection_location'),
                store: Ext.create('QDT.store.inspection.InspectionLocations').load({
                    params: {
                        language: Profile.getLang(),
                        view_all: false
                    }
                }),
                displayField: 'name',
                valueField: 'inspection_location_id',
                editable: false
            }, {
                xtype: 'textfield',
                name: 'quantity',
                fieldLabel: Profile.getText('quantity')
            }, {
                xtype: 'textfield',
                name: 'part_num',
                fieldLabel: Profile.getText('part_num')
            }, {
                xtype: 'textarea',
                name: 'remark',
                fieldLabel: Profile.getText('remark')
            }, {
                xtype: 'textfield',
                name: 'create_by',
                value: me.create_by,
                hidden: true,
                submitValue: true
            }],

            buttons: [{
                iconCls: 'submit',
                text: Profile.getText('Submit'),
                handler: function () {
                    this.setDisabled(true);
                    me.submit({
                        waitMsg: 'waiting',
                        success: function (form, action) {
                            if (action.result.success) {
                                My.Msg.warning('送检成功！');
                                cq.query('inspection-maingrid')[0].store.reload();
                            } else {
                                My.Msg.warning(action.result.errorMessage);
                            }
                            me.down('form').getForm().reset();
                            me.down('form').down('button').setDisabled(false);
                        },
                        failure: function (form, action) {
                            My.Msg.warning(action.result.errorMessage);
                            me.down('form').getForm().reset();
                            me.down('form').down('button').setDisabled(false);
                        }
                    });
                }
            }]
        }];

        me.callParent();

        me.on({
            afterrender: me.onAfterRender
        });
    },

    onInspectionTypeSelect: function (combo, records) {
        var me = this,
            cmbInspectionProject = me.down('[name=project]');
        cmbInspectionProject.reset();
        //TODO
        cmbInspectionProject.getStore().load(function (records, operation, success) {
            if (records.length == 1) {
                cmbInspectionProject.select(records[0]);
            }
        });
    },

    onInspectionProjectSelect: function () {
        var me = this,
            inspectionTypeId = me.down('[name=inspection_type]').getValue(),
            inspectionProjectId = me.down('[name=project]').getValue();
        DpInspection.GetProjectInfo(inspectionTypeId, inspectionProjectId, function (result) {
            if (result.success) {
                me.down('[name=part_num]').setValue(result.data.pn);
                me.down('[name=remark]').setValue(result.data.comment);
            } else {
                My.Msg.warning(result.errorMessage);
            }
        });
    },

    onAfterRender: function () {
        var me = this,
            cmbInspectionType = me.down('[name=inspection_type]'),
            cmbInspectionProject = me.down('[name=project]'),
            inspectionTypeId;
        cmbInspectionProject.getStore().on({
            beforeload: function () {
                inspectionTypeId = cmbInspectionType.getValue();
                if (inspectionTypeId) {
                    Ext.apply(this.getProxy().extraParams, {
                        query: cmbInspectionProject.getRawValue(),
                        inspection_type_id: inspectionTypeId
                    });
                }
                else {
                    Ext.Msg.alert(Profile.getText('Warning', '请选择检验类型'));
                }
            }
        });

    }
});