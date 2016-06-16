Ext.define('QDT.controller.tq.ProcessScan', {
    extend: 'Ext.app.Controller',
    views: [
        'QDT.view.tq.ProcessScanWindow'
    ],

    refs: [{
        ref: 'scanner',
        selector: 'tq-processscanwindow'
    }],

    init: function () {
        var me = this;

        me.control({
            'tq-processscanwindow [name=job]': {
                blur: function (cmp) {
                    var job = cmp.getValue(),
                        scanner = me.getScanner();
                    if (job.length === 10) {
                        DpScan.GetJobOrder(job, 0, function (result) {
                            if (result.success) {
                                scanner.down('[name=item]').setValue(result.data.item);
                                scanner.down('[name=oper_num]').store.load({
                                    params: {
                                        job: job,
                                        suffix: 0
                                    }
                                });
                            }

                        });
                    }
                }
            },

            'tq-processscanwindow #cancel': {
                click: function (btn) {
                    btn.up('window').close();
                }
            },

            'tq-processscanwindow #submit': {
                click: function (btn) {
                    var scanner = me.getScanner(),
                        inputForm = scanner.down('#job-operation'),
                        processId = scanner.down('[name=current_process_id]').getValue(),
                        employeeId = scanner.down('[name=employee_id]').getValue(),
                        job = scanner.down('[name=job]').getValue(),
                        operNum = scanner.down('[name=oper_num]').getValue(),
                        skillCode = scanner.down('[name=skill_code]').getValue(),
                        item = scanner.down('[name=item]').getValue();

                    if (inputForm.isValid()) {
                        btn.setDisabled(true);



                        //                        DpTq.StartProcessScan(employeeId, processId, job, operNum, function (result) {
                        //                            if (result.success) {
                        //                                scanner.close();
                        //                            } else {
                        //                                btn.setDisabled(false);
                        //                            }
                        //                        });

                        DpTq.JobRestrictCheck(item, operNum, 'stc', skillCode, function (result) {

                            if (result.success == true && result.data == 1) {
                                DpTq.StartProcessScan(employeeId, processId, job, operNum, function (result) {
                                    if (result.success) {
                                        scanner.close();
                                    } else {
                                        btn.setDisabled(false);
                                    }
                                });

                            } else {
                                Ext.Msg.alert('错误', '技能绑定信息错误,请确认！');
                            }
                        });
                    }
                }
            }
        });
    }
});