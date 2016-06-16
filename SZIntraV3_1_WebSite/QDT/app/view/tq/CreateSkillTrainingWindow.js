/// <reference path="../../../../extjs/ext-all-debug-w-comments.js" />
Ext.define('QDT.view.tq.CreateSkillTrainingWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.tq-createskilltrainingwindow',
    modal: true,
    constrainHeader: true,
    autoShow: true,
    //    closeAction: "destroy",
    //    closable: true,
    layout: 'fit',
    width: 500,
    requires: [
        'QDT.view.skill.SkillCodeCombo',
        'Asz.store.op.WorkTypes',
        'QDT.view.tq.SkillTrainingApproverGrid',
        'QDT.store.tq.StandardSkillTrainingRoutes',
        'QDT.view.tq.ProcessApproverPicker',
        'QDT.store.skill.SkillTrainers'
    ],

    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            title: Profile.getText('CreateTraining'),
            items: [
            {
                xtype: 'form',
                frame: true,
                layout: 'anchor',
                bodyPadding: 10,
                defaults: {
                    anchor: '100%',
                    allowBlank: false
                },
                items: [
                {
                    xtype: 'checkboxfield',
                    name: 'is_npi_direct_certification',
                    itemId: 'is_npi_direct_certification',
                    boxLabel: Profile.getText('NPI_Certification_Process'),
                    hidden: me.npicmphide()
                },
                {
                    xtype: 'checkboxfield',
                    name: 'is_direct_certification',
                    itemId: 'is_direct_certification',
                    boxLabel: Profile.getText('Special_Process_Certification'),
                    hidden: me.cmphide()
                }, {
                    xtype: 'employeecombo',
                    name: 'employee_id',
                    itemId: 'employee_id',
                    fieldLabel: Profile.getText('trainee')
                }, {
                    xtype: 'skill-skillcodecombo',
                    store: Ext.create('QDT.store.skill.InUseSkillCodes'),
                    name: 'skill_code_id',
                    id: 'skill_code_id'

                }, {
                    xtype: 'displayfield',
                    name: 'category',
                    fieldLabel: Profile.getText('category')
                }, {
                    xtype: 'displayfield',
                    name: 'description',
                    fieldLabel: Profile.getText('description')
                }, {
                    xtype: 'displayfield',
                    name: 'work_type',
                    fieldLabel: Profile.getText('work_type'),
                    renderer: QDT.util.Renderer.workType
                }, {
                    xtype: 'checkboxfield',
                    name: 'is_refresh_training',
                    itemId: 'is_refresh_training',
                    boxLabel: Profile.getText('is_refresh_training')
                }, {
                    xtype: 'fieldset',
                    autoScroll: true,
                    layout: 'fit',
                    title: Profile.getText('ApproversInformation'),
                    items: [{
                        xtype: 'tq-skilltrainingapprovergrid',
                        store: Ext.create('QDT.store.tq.StandardSkillTrainingRoutes')
                    }]
                }]
            }],
            buttons: [{
                iconCls: 'submit',
                itemId: 'submit',
                text: Profile.getText('Submit'),
                scope: me
            }]
        });

        me.callParent();
    },
    cmphide: function () {
        var currentUserSso = Profile.getUserSso();
        if (currentUserSso == '212348763'
            || currentUserSso == '307006712'
            || currentUserSso == '307004930'
            || currentUserSso == '307006710'
            || currentUserSso == '307007391'
            || currentUserSso == '307008304'
            || currentUserSso == '307009643'
            || currentUserSso == '307004909'
            || currentUserSso == '307004931'
            || currentUserSso == '307004938'
            || currentUserSso == '307006478'
            || currentUserSso == '307009219'
            ) {
            return false;
        } else {
            return true;
        }
    },
    npicmphide: function () {
        var currentUserSso = Profile.getUserSso();
        if (currentUserSso == '212348763'
            || currentUserSso == '307006712'
            || currentUserSso == '307006631'
            || currentUserSso == '307006697'
            || currentUserSso == '307008218'
            || currentUserSso == '307008304'
            || currentUserSso == '307008439'
            || currentUserSso == '307008440'
            || currentUserSso == '307009101'
            || currentUserSso == '307009643'
            || currentUserSso == '307009773'
            || currentUserSso == '307010115'
            || currentUserSso == '307010148'
            || currentUserSso == '307010145'
            || currentUserSso == '307007764'
            || currentUserSso == '212340404'
            || currentUserSso == '307004909'
            || currentUserSso == '307004910'
            || currentUserSso == '307004912'
            || currentUserSso == '307004938'
            || currentUserSso == '307004996'
            || currentUserSso == '307005982'
            || currentUserSso == '307006385'
            || currentUserSso == '307009709'
            || currentUserSso == '307009219'
            || currentUserSso == '212408440'
            || currentUserSso == '307010147'
            || currentUserSso == '307006710'
            || currentUserSso == '307004931'

            ) {
            return false;
        } else {
            return true;
        }
    }


});