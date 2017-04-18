Ext.define('QDT.controller.tq.SkillTrainingApprover', {
    extend: 'Ext.app.Controller',
    views: [
        'QDT.view.tq.SkillTrainingApproverGrid',
        'QDT.view.tq.ProcessApproverPicker'
    ],

    refs: [{
        ref: 'trainingApproverGrid',
        selector: 'tq-skilltrainingapprovergrid'
    }, {
        ref: 'processApproverPicker',
        selector: 'tq-skilltrainingapprovergrid'
    }],

    init: function () {
        var me = this;
        me.control({


            'tq-skilltrainingapprovergrid #add-approvers': {
                click: function (btn) {
                    var grid = me.getTrainingApproverGrid();
                    var skillCodeId = grid.skillCodeId;
                    var step = grid.getSelectionModel().getSelection()[0].get('step');
                    var existTraineers = grid.getSelectionModel().getSelection()[0].get('approvers').split(',');

                    var certify_mode = 'normal';
                    if (btn.up('form') != null) {
                        var values = btn.up('form').getForm().getValues();

                        var is_refresh_training = (values.is_refresh_training === 'on' ? true : false);
                        var is_direct_certification = (values.is_direct_certification === 'on' ? true : false);
                        var is_npi_direct_certification = (values.is_npi_direct_certification === 'on' ? true : false);

                        if (is_refresh_training) {
                            certify_mode = 'refresh';
                        } else if (is_direct_certification) {
                            certify_mode = 'direct';
                        } else if (is_npi_direct_certification) {
                            certify_mode = 'npi';
                        }
                    } else {
                        certify_mode = btn.up('window').certifyMode;
                    }


                    var sourceStore = Ext.create('QDT.store.skill.SkillTrainers');
                    sourceStore.getProxy().extraParams.skill_code_id = skillCodeId;
                    sourceStore.getProxy().extraParams.step = step;
                    sourceStore.getProxy().extraParams.certify_mode = certify_mode;

                    var targetStore = Ext.create('QDT.store.skill.SkillTrainers');

                    sourceStore.load({
                        callback: function (records, operation, success) {
                            Ext.Array.each(existTraineers, function (traineer) {
                                var index = sourceStore.findExact('user_id', parseInt(traineer));
                                sourceStore.removeAt(index);
                                //     targetStore.add(Ext.StoreManager.getByKey('Asz.store.system.NativeUsers').findRecord('user_id', traineer));
                            });
                        }
                    });

                    var picker = Ext.widget('tq-processapproverpicker', {
                        existTraineers: existTraineers,
                        sourceStore: sourceStore,
                        targetStore: targetStore,
                        columnConfig: [{
                            dataIndex: 'local_id', width: 80
                        }, {
                            dataIndex: 'sso', width: 80
                        }, {
                            dataIndex: 'user_id', flex: 1, renderer: QDT.util.Renderer.username
                        }],
                        callback: function (userIds) {
                            var fnFilter = QDT.util.Util.nonEmptyString;
                            Ext.Array.each(grid.activeRecords, function (record) {
                                record.data.approvers = userIds.join(',').split(',').filter(fnFilter).join(',');
                                record.commit();
                            });
                            picker.close();
                        }
                    });
                    //                    sourceStore.mon(sourceStore, {

                    //                        beforeload: function () {
                    //                            Ext.apply(sourceStore.proxy.extraParams, {
                    //                                skill_code_id: skillCodeId,
                    //                                step: step
                    //                            });
                    //                        }
                    //                        //                                            load: function () {

                    //                        //                                                Ext.Array.each(existTraineers, function (traineer) {
                    //                        //                                                    var index = sourceStore.findExact('user_id', traineer);
                    //                        //                                                    sourceStore.removeAt(index);
                    //                        //                                                    targetStore.add(Ext.StoreManager.getByKey('Asz.store.system.NativeUsers').findRecord('user_id', traineer));
                    //                        //                                                });

                    //                        //                                            }
                    //                    });



                }
            },


            'tq-skilltrainingapprovergrid #delete-approvers': {
                click: function () {
                    var grid = me.getTrainingApproverGrid();
                    Ext.Array.each(grid.activeRecords, function (record) {
                        record.set('approvers', '');
                        record.commit();
                    });
                }
            },

            'tq-skilltrainingapprovergrid': {
                afterrender: function (cmp) {
                    var selModel = cmp.getSelectionModel();
                    selModel.mon(selModel, {
                        destroyable: true,
                        beforeselect: function (rowModel, record) {
                            return record.data.allow_custom_approver;
                        }
                    });
                },
                selectionchange: function (selModel, selected) {
                    var grid = me.getTrainingApproverGrid();
                    grid.activeRecords = selected;
                    grid.down('#add-approvers').setDisabled(selected.length === 0);
                    grid.down('#delete-approvers').setDisabled(selected.length === 0);
                }
            }


        });
    }
});