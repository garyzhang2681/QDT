Ext.define('QDT.controller.Inspection', {
    extend: 'Ext.app.Controller',
    views: [
        'inspection.MainGrid',
        'inspection.SendInspection',
        'inspection.DefaultInspection',
        'inspection.CustomInspection',
        'inspection.ChangeLocation',
        'inspection.Comment',
        'QDT.view.scan.InspectorScan'
    ],
    stores: [
        'inspection.InspectionLocations',
        'inspection.InspectionRecords'
    ],

    refs: [{
        ref: 'mainGrid',
        selector: 'inspection-maingrid'
    }, {
        ref: 'inspectorScan',
        selector: 'scan-inspectorscan'
    }],

    init: function () {
        var me = this;
        me.control({
            'scan-inspectorscan #is_training': {
                change: function (cmp, newValue, oldValue) {
                    var employee_id = cq.query('scan-inspectorscan #employee_id')[0].value;
                    if (employee_id != '' && employee_id != null && employee_id != 'undefine') {
                        if (newValue == true) {



                            DpScan.GetInProcessOperationInformation(employee_id, function (result) {
                                if (result.success) {

                                    if (result.data.length === 0) {
                                        My.Msg.warning('您还没有技能培训进入实操阶段！');
                                        cq.query('scan-inspectorscan #is_training')[0].reset();
                                        cq.query('scan-inspectorscan #training_skill_code')[0].clearValue();
                                        cq.query('scan-inspectorscan #training_process')[0].setValue('');
                                        cq.query('scan-inspectorscan #training_trainer')[0].clearValue();
                                        cq.query('scan-inspectorscan #training_trainer_password')[0].setValue('');

                                        cq.query('scan-inspectorscan #training_skill_code')[0].hide();
                                        cq.query('scan-inspectorscan #training_process')[0].hide();
                                        cq.query('scan-inspectorscan #training_trainer')[0].hide();
                                        cq.query('scan-inspectorscan #training_trainer_password')[0].hide();
                                    } else {
                                        cq.query('scan-inspectorscan #training_skill_code')[0].show();
                                        cq.query('scan-inspectorscan #training_trainer')[0].show();
                                        cq.query('scan-inspectorscan #training_trainer_password')[0].show();
                                        cq.query('scan-inspectorscan #training_process')[0].show();
                                        cq.query('scan-inspectorscan #training_skill_code')[0].bindStore(Ext.create('Ext.data.Store', {
                                            fields: [
                                           'skill_code_id',
                                           'skill_code'
                                       ],
                                            data: result.data
                                        }));
                                    }
                                }
                            });


                        } else if (newValue == false) {
                            cq.query('scan-inspectorscan #training_skill_code')[0].store.removeAll();
                            cq.query('scan-inspectorscan #training_skill_code')[0].clearValue();
                            cq.query('scan-inspectorscan #training_process')[0].setValue('');
                            cq.query('scan-inspectorscan #training_trainer')[0].store.removeAll();
                            cq.query('scan-inspectorscan #training_trainer')[0].clearValue();
                            cq.query('scan-inspectorscan #training_trainer_password')[0].setValue('');

                            cq.query('scan-inspectorscan #training_skill_code')[0].hide();
                            cq.query('scan-inspectorscan #training_process')[0].hide();
                            cq.query('scan-inspectorscan #training_trainer')[0].hide();
                            cq.query('scan-inspectorscan #training_trainer_password')[0].hide();
                        }
                    } else {
                        My.Msg.warning(Profile.getText('PleaseEnterLocalId'));
                        cq.query('scan-inspectorscan #is_training')[0].reset();
                    }
                }
            },

            'scan-inspectorscan #training_skill_code': {
                select: function () {
                    cq.query('scan-inspectorscan #training_process')[0].setValue('');
                    cq.query('scan-inspectorscan #training_trainer')[0].clearValue();

                    var employee_id = cq.query('scan-inspectorscan #employee_id')[0].value;
                    var skill_code = cq.query('scan-inspectorscan #training_skill_code')[0].rawValue;
                    DpScan.GetCurrentProcess(employee_id, skill_code, function (result) {
                        if (result.success) {
                            console.log(result.data[0]);
                            cq.query('scan-inspectorscan #training_process_id')[0].setValue(result.data[0].process_id);
                            cq.query('scan-inspectorscan #training_process')[0].setValue(result.data[0].process_name);
                        }
                    });

                    //设置培训师
                    DpScan.GetCurrentProcessApprover(employee_id, skill_code, function (result) {
                        if (result.success) {
                            //      console.log(result.data);
                            cq.query('scan-inspectorscan #training_trainer')[0].bindStore(Ext.create('Ext.data.Store', {
                                fields: [
                                           'approver_id',
                                           'approver_name'
                                       ],
                                data: result.data
                            }));
                        }
                    });



                }
            }
        });
    }

    //    updateInspectionResult: function (passed) {

    //        var selected_data = cq.query('inspection-maingrid')[0].getSelectionModel().getSelection();
    //        var inspection_ids = this.getInspectionIds(selected_data);
    //        var win = this.buildUserValidationWindow({
    //            submit: SystemAdmin.UserValidation
    //        }, function (form, action) {
    //            win.close();
    //            var records = '';
    //            var user_id = action.result.data['user_id'];
    //            for (var i = 0; i < selected_data.length; i++) {
    //                var record = selected_data[i];
    //                records += record.data['type'] + ':' + record.data['item'] + '</br>';
    //            }

    //            My.Msg.question('attention', records + '是否已经完成？', function (btn, text) {
    //                if (btn == 'yes') {
    //                    DpInspection.UpdataInspectionResult(inspection_ids, passed, user_id, function (result) {
    //                        if (result.success) {
    //                            My.Msg.warning('结果保存成功！');
    //                        } else {
    //                            My.Msg.warning('结果保存失败！');
    //                        }
    //                        cq.query('inspection-maingrid')[0].store.reload();
    //                    });
    //                } else {

    //                }
    //            });
    //        }, function (form, action) {
    //            Ext.Msg.alert('Error', action.result.errorMessage);
    //        });

    //    }




});




