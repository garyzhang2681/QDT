Ext.define('QDT.controller.tq.CreateSkillTraining', {
    extend: 'Ext.app.Controller',
    views: [
        'QDT.view.tq.CreateSkillTrainingWindow',
        'QDT.view.tq.SkillTrainingPanel'
    ],

    refs: [{
        ref: 'createSkillTrainingWindow',
        selector: 'tq-createskilltrainingwindow'
    }, {
        ref: 'trainingApproverGrid',
        selector: 'tq-createskilltrainingwindow tq-skilltrainingapprovergrid'
    }, {
        ref: 'trainingGrid',
        selector: 'tq-skilltrainingpanel tq-skilltraininggrid'
    }],

    init: function () {
        var me = this;

        me.control({
            'tq-createskilltrainingwindow #submit': {
                click: me.onSubmitClick
            },

            'tq-createskilltrainingwindow #employee_id': {
                select: me.onCheckRefreshCertification
            },


            'tq-createskilltrainingwindow #is_refresh_training': {
                change: function (cmp, newValue, oldValue) {

                    if (newValue == true) {
                        cmp.up('form').down('#is_npi_direct_certification').setValue(false);
                        cmp.up('form').down('#is_direct_certification').setValue(false);
                        cmp.up('form').down('#is_npi_direct_certification').setDisabled(true);
                        cmp.up('form').down('#is_direct_certification').setDisabled(true);
                    }
                    if (newValue == false) {
                        cmp.up('form').down('#is_npi_direct_certification').setDisabled(false);
                        cmp.up('form').down('#is_direct_certification').setDisabled(false);
                    }
                    var values = cmp.up('form').getForm().getValues();
                    var is_refresh_training = (values.is_refresh_training === 'on' ? true : false);
                    var createWindow = me.getCreateSkillTrainingWindow();
                    var trainingRoutesStore = createWindow.down('tq-skilltrainingapprovergrid').store;
                    trainingRoutesStore.load({
                        params: {
                            is_refresh_training: is_refresh_training,
                            is_direct_certification: false,
                            is_npi_direct_certification: false,
                            skill_code_id: values.skill_code_id
                        }
                    });
                    me.getTrainingApproverGrid().skillCodeId = values.skill_code_id;
                    me.onCheckRefreshCertification();



                }
            },

            'tq-createskilltrainingwindow #is_direct_certification': {
                change: function (cmp, newValue, oldValue) {

                    if (newValue == true) {
                        cmp.up('form').down('#is_npi_direct_certification').setValue(false);
                        cmp.up('form').down('#is_refresh_training').setValue(false);
                        cmp.up('form').down('#is_npi_direct_certification').setDisabled(true);
                        cmp.up('form').down('#is_refresh_training').setDisabled(true);

                    }
                    if (newValue == false) {
                        cmp.up('form').down('#is_npi_direct_certification').setDisabled(false);
                        cmp.up('form').down('#is_refresh_training').setDisabled(false);
                    }
                    var values = cmp.up('form').getForm().getValues();
                    var is_direct_certification = (values.is_direct_certification === 'on' ? true : false);
                    var createWindow = me.getCreateSkillTrainingWindow();
                    var trainingRoutesStore = createWindow.down('tq-skilltrainingapprovergrid').store;
                    trainingRoutesStore.load({
                        params: {
                            is_refresh_training: false,
                            is_direct_certification: is_direct_certification,
                            is_npi_direct_certification: false,
                            skill_code_id: values.skill_code_id
                        }
                    });
                    me.getTrainingApproverGrid().skillCodeId = values.skill_code_id;
                    me.onCheckRefreshCertification();


                    //   cmp.up('form').down('#is_refresh_training').setDisabled(is_direct_certification || is_npi_direct_certification);
                }
            },

            'tq-createskilltrainingwindow #is_npi_direct_certification': {
                change: function (cmp, newValue, oldValue) {

                    if (newValue == true) {
                        cmp.up('form').down('#is_refresh_training').setValue(false);
                        cmp.up('form').down('#is_direct_certification').setValue(false);
                        cmp.up('form').down('#is_refresh_training').setDisabled(true);
                        cmp.up('form').down('#is_direct_certification').setDisabled(true);
                    }
                    if (newValue == false) {
                        cmp.up('form').down('#is_direct_certification').setDisabled(false);
                        cmp.up('form').down('#is_refresh_training').setDisabled(false);
                    }

                    var values = cmp.up('form').getForm().getValues();
                    var is_npi_direct_certification = (values.is_npi_direct_certification === 'on' ? true : false);
                    var createWindow = me.getCreateSkillTrainingWindow();
                    var trainingRoutesStore = createWindow.down('tq-skilltrainingapprovergrid').store;
                    trainingRoutesStore.load({
                        params: {
                            is_refresh_training: false,
                            is_direct_certification: false,
                            is_npi_direct_certification: is_npi_direct_certification,
                            skill_code_id: values.skill_code_id
                        }
                    });
                    me.getTrainingApproverGrid().skillCodeId = values.skill_code_id;
                    me.onCheckRefreshCertification();

                }
            },

            'tq-createskilltrainingwindow #skill_code_id': {

                select: function (combo, records) {
                    var skill = records[0].data,
                        createWindow = me.getCreateSkillTrainingWindow(),
                        trainingRoutesStore = createWindow.down('tq-skilltrainingapprovergrid').store;
                    combo.up('form').getForm().setValues({
                        category: skill.category,
                        description: skill.description,
                        work_type: skill.work_type
                    });

                    var values = combo.up('form').getForm().getValues();
                    var is_refresh_training = (values.is_refresh_training === 'on' ? true : false);
                    var is_direct_certification = (values.is_direct_certification === 'on' ? true : false);
                    var is_npi_direct_certification = (values.is_npi_direct_certification === 'on' ? true : false);

                    trainingRoutesStore.load({
                        params: {
                            is_refresh_training: is_refresh_training,
                            is_direct_certification: is_direct_certification,
                            is_npi_direct_certification: is_npi_direct_certification,
                            skill_code_id: skill.id
                        }
                    });
                    me.getTrainingApproverGrid().skillCodeId = skill.id;
                    me.onCheckRefreshCertification();
                }
            }
        });
    },




    onCheckRefreshCertification: function () {
        var me = this.getCreateSkillTrainingWindow(),
            formPanel = me.down('form'),
            values = formPanel.getValues(),
            employeeId = values.employee_id,
            skillCodeId = values.skill_code_id;
        if (employeeId != '' && skillCodeId != '') {
            DpSkill.CheckRefreshCertification('stc', employeeId, skillCodeId, function (result) {
                formPanel.down('#is_refresh_training').setDisabled(!result.data);
                formPanel.down('#is_refresh_training').setValue(result.data);

            });
        }
    },

    onSubmitClick: function () {
        var me = this.getCreateSkillTrainingWindow(),
            formPanel = me.down('form'),
            values = formPanel.getValues(),
            employeeId = values.employee_id,
            skillCodeId = values.skill_code_id,
            certifyMode = 'normal',
            approverGrid = me.down('tq-skilltrainingapprovergrid'),
            approvers = approverGrid.getProcessApprovers(),
            trainingGrid = this.getTrainingGrid();

        if (values.is_refresh_training === 'on') {
            certifyMode = 'refresh';
        }
        if (values.is_direct_certification === 'on') {
            certifyMode = 'direct';
        }
        if (values.is_npi_direct_certification === 'on') {
            certifyMode = 'npi';
        }

        if (formPanel.isValid() && approvers.length > 0) {
            me.down('#submit').disable();

            DpSkill.CreateTraining(employeeId, skillCodeId, certifyMode, approvers, function (result) {
                if (result.success) {

                    Ext.Msg.alert(Profile.getText('Success'), Profile.getText('txtRecordCreated'));
                    me.close();
                    trainingGrid.store.reload();
                    me.down('#submit').enable();
                } else {
                    me.down('#submit').enable();
                    My.Msg.warning(result.errorMessage);
                }
            });
        }
    }
});