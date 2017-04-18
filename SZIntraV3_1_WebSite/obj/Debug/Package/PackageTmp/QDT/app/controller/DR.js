Ext.define('QDT.controller.DR', {
    extend: 'Ext.app.Controller',
    views: ['DR'
        , 'CreateDR'
        , 'DRDetail'
        , 'CreateDisposition'
        , 'CreateAction'
        , 'SearchDR'
        , 'dr.DiscrepancyGrid'

    ],
    stores: ['RelatedDRs'
    ],

    init: function () {
        var me = this;
        me.control({
            'dr': {
                afterrender: function (cmp) {
                    cmp.store.load();
                },
                itemdblclick: function (cmp, record) {

                    QDT.GetUserTypeByDrNumber(record.data['dr.dr_num'], function (result) {

                        if (result.success === true) {

                            var dRDetail = Ext.widget('drdetail', {
                                dr_num: record.data['dr.dr_num'],
                                isQE: result['isQeOwner'],
                                isME: result['isMeOwner'],
                                isClosed: record.data['dr.status'] === 'closed' ? true : false
                            });
                            //dRdetail.down('form').load(record);
                            dRDetail.down('form').loadRecord(record);
                            dRDetail.show();
                        } else if (result.timeout === true) {

                            MessageBox.warning('由于长时间没有操作，请重新刷新页面!');

                        } else {

                            MessageBox.warning('获取信息错误！');

                        }
                    });
                }

            },

            'createdr [name=job]': {
                blur: function (cmp) {
                    var suffix = cmp.up().down('[name=suffix]').value; //up-> form   down->suffix
                    var job = cmp.value;
                    //                    if (suffix !== null && job !== null) {
                    QDT.GetJobCardByJobSuffix(job, suffix, function (result) {
                        if (result.success === true) {
                            var serialLotTextField = cmp.up().down('[name=serial_lot]');
                            var serialOrLotTextField = cmp.up().down('[name=serialOrLot]');
                            var discrepancyItemSearchCombo = cmp.up().down('[name=discrepancy_item]');

                            if (result.serialOrLot === 'serial') {
                                setTextFieldValue(serialLotTextField, result.serial);
                                cmp.up().down('[name=serialOrLot]').setValue('serial');
                            } else if (result.serialOrLot === 'lot') {
                                setTextFieldValue(serialLotTextField, result.lot);
                                cmp.up().down('[name=serialOrLot]').setValue('lot');
                            }
                            setTextFieldValue(serialOrLotTextField, result.serialOrLot);

                            var items = new Ext.data.Store({
                                data: [{
                                    item: result.item, FGorRW: '', serialOrLot: ''
                                }],
                                model: 'QDT.model.Item'

                            });
                            discrepancyItemSearchCombo.bindStore(items);

                            discrepancyItemSearchCombo.displayField = 'item';
                            discrepancyItemSearchCombo.valueField = 'item';
                            discrepancyItemSearchCombo.select(result.item);

                            discrepancyItemSearchCombo.bindStore(Ext.create('QDT.store.Items', {
                                pageSize: 10
                            }));


                            QDT.SearchItemOwnersByItem(result.item, function (ownerResult) {
                                var n = 'name_' + Profile.getLang();
                                var qe = ownerResult.data.qe_owner;
                                var me = ownerResult.data.me_owner;
                                var qe_owner = Ext.create('QDT.model.Employee', {
                                    name: qe === null ? '' : ownerResult.data.qe_owner.employee[n],
                                    employee_id: qe === null ? '' : ownerResult.data.qe_owner.employee.employee_id
                                });
                                var me_owner = Ext.create('QDT.model.Employee', {
                                    name: me === null ? '' : ownerResult.data.me_owner.employee[n],
                                    employee_id: me === null ? '' : ownerResult.data.me_owner.employee.employee_id
                                });
                                cmp.up().down('searchcombo[name=dr_qe_owner]').store.removeAll();
                                cmp.up().down('searchcombo[name=dr_qe_owner]').store.add(qe_owner);
                                cmp.up().down('searchcombo[name=dr_qe_owner]').select(qe_owner);

                                cmp.up().down('searchcombo[name=dr_me_owner]').store.removeAll();
                                cmp.up().down('searchcombo[name=dr_me_owner]').store.add(me_owner);
                                cmp.up().down('searchcombo[name=dr_me_owner]').select(me_owner);
                            });
                        }
                    });
                }
            },

            'createdr [name=suffix]': {
                blur: function (cmp) {
                    var suffix = cmp.value; //up-> form   down->suffix
                    var job = cmp.up().down('[name=job]').value;
                    QDT.GetJobCardByJobSuffix(job, suffix, function (result) {
                        if (result.success === true) {
                            var serialLotTextField = cmp.up().down('[name=serial_lot]');
                            var serialOrLotTextField = cmp.up().down('[name=serialOrLot]');
                            var discrepancyItemSearchCombo = cmp.up().down('[name=discrepancy_item]');

                            if (result.serialOrLot === 'serial') {
                                setTextFieldValue(serialLotTextField, result.serial);
                                cmp.up().down('[name=serialOrLot]').setValue('serial');
                            } else if (result.serialOrLot === 'lot') {
                                setTextFieldValue(serialLotTextField, result.lot);
                                cmp.up().down('[name=serialOrLot]').setValue('lot');
                            }
                            setTextFieldValue(serialOrLotTextField, result.serialOrLot);

                            var items = new Ext.data.Store({
                                data: [{
                                    item: result.item, FGorRW: '', serialOrLot: ''
                                }],
                                model: 'QDT.model.Item'

                            });
                            discrepancyItemSearchCombo.bindStore(items);

                            discrepancyItemSearchCombo.displayField = 'item';
                            discrepancyItemSearchCombo.valueField = 'item';
                            discrepancyItemSearchCombo.select(result.item);

                            discrepancyItemSearchCombo.bindStore(Ext.create('QDT.store.Items', {
                                pageSize: 10
                            }));


                            QDT.SearchItemOwnersByItem(result.item, function (ownerResult) {
                                var n = 'name_' + Profile.getLang();
                                var qe = ownerResult.data.qe_owner;
                                var me = ownerResult.data.me_owner;
                                var qe_owner = Ext.create('QDT.model.Employee', {
                                    name: qe === null ? '' : ownerResult.data.qe_owner.employee[n],
                                    employee_id: qe === null ? '' : ownerResult.data.qe_owner.employee.employee_id
                                });
                                var me_owner = Ext.create('QDT.model.Employee', {
                                    name: me === null ? '' : ownerResult.data.me_owner.employee[n],
                                    employee_id: me === null ? '' : ownerResult.data.me_owner.employee.employee_id
                                });
                                cmp.up().down('searchcombo[name=dr_qe_owner]').store.removeAll();
                                cmp.up().down('searchcombo[name=dr_qe_owner]').store.add(qe_owner);
                                cmp.up().down('searchcombo[name=dr_qe_owner]').select(qe_owner);

                                cmp.up().down('searchcombo[name=dr_me_owner]').store.removeAll();
                                cmp.up().down('searchcombo[name=dr_me_owner]').store.add(me_owner);
                                cmp.up().down('searchcombo[name=dr_me_owner]').select(me_owner);
                            });
                        }
                    });
                }
            },

            'createdr [name=oper_num]': {
                select: function (cmp, records) {
                    var operationNum = cmp.getValue();
                    var item = cmp.up().down('[name=discrepancy_item]').getValue();

                    QDT.SearchItemOwnersByItemAndOp(item, operationNum, function (ownerResult) {


                        var n = 'name_' + Profile.getLang();
                        var qeOwner = ownerResult.data.qe_owner;
                        var meOwner = ownerResult.data.me_owner;
                        if (qeOwner != null && meOwner != null) {
                            var qe_owner = Ext.create('QDT.model.Employee', {
                                name: ownerResult.data.qe_owner.employee[n],
                                employee_id: ownerResult.data.qe_owner.employee.employee_id
                            });
                            var me_owner = Ext.create('QDT.model.Employee', {
                                name: ownerResult.data.me_owner.employee[n],
                                employee_id: ownerResult.data.me_owner.employee.employee_id
                            });
                            cmp.up().down('searchcombo[name=dr_qe_owner]').store.removeAll();
                            cmp.up().down('searchcombo[name=dr_qe_owner]').store.add(qe_owner);
                            cmp.up().down('searchcombo[name=dr_qe_owner]').select(qe_owner);

                            cmp.up().down('searchcombo[name=dr_me_owner]').store.removeAll();
                            cmp.up().down('searchcombo[name=dr_me_owner]').store.add(me_owner);
                            cmp.up().down('searchcombo[name=dr_me_owner]').select(me_owner);
                        }

                    });
                }
            },

            'drdetail': {
                afterrender: function (cmp) {
                    cmp.down('grid').store.load({
                        params: { dr_num: cmp.dr_num }
                    });
                }
            },

            'drdetail [gridName=dispGrid]': {
                itemdblclick: function (cmp, record) {

                    var is_update = false;
                    var dr_detail = cq.query('drdetail')[0];
                    if (dr_detail.isME && (record.data['disposition.status'] == 'create' || record.data['disposition.status'] == 'open')) {
                        is_update = true;
                    }

                    var dispDetail = Ext.widget('createdisposition', {
                        dr_num: record.data['disposition.dr_num'],
                        isCreate: false,
                        isUpdate: is_update,
                        disp_id: record.data['disposition.disp_id'],
                        dispGrid: dr_detail.down('#disp_grid')
                    });

                    dispDetail.down('form').loadRecord(record);

                    var reason_cmp = dispDetail.down('form').down('searchcombo[name=' + 'reasonType.qdtComString.' + Profile.getLang() + '_string' + ']');
                    var responsible_department_cmp = dispDetail.down('form').down('remotecombo[name=' + 'responsibleDepartment.qdtComString.' + Profile.getLang() + '_string' + ']');
                    var disp_type_cmp = dispDetail.down('form').down('remotecombo[name=' + 'dispType.qdtComString.' + Profile.getLang() + '_string' + ']');
                    if (is_update) {

                        var reason = Ext.create('QDT.model.CommonString', {
                            id: record.data['disposition.reason'],
                            common_string: record.data['reasonType.qdtComString.' + Profile.getLang() + '_string']
                        });
                        reason_cmp.setValue(reason);

                        var responsible_department = Ext.create('QDT.model.CommonString', {
                            id: record.data['responsibleDepartment'],
                            common_string: record.data['responsibleDepartment.qdtComString.' + Profile.getLang() + '_string']
                        });
                        responsible_department_cmp.setValue(responsible_department);


                        var disp_type = Ext.create('QDT.model.CommonString', {
                            id: record.data['disposition.disp_type'],
                            common_string: record.data['dispType.qdtComString.' + Profile.getLang() + '_string']
                        });
                        disp_type_cmp.setValue(disp_type);

                    } else {
                        reason_cmp.emptyText = record.data['reasonType.qdtComString.' + Profile.getLang() + '_string'];
                        responsible_department_cmp.emptyText = record.data['responsibleDepartment.qdtComString.' + Profile.getLang() + '_string'];
                        disp_type_cmp.emptyText = record.data['dispType.qdtComString.' + Profile.getLang() + '_string'];
                    }

                    dispDetail.show();

                }
            },


            'drdetail [gridName=actionGrid]': {
                itemdblclick: function (cmp, record) {

                    var is_update = false;
                    var is_complete = false;
                    var is_action_owner = false;
                    var dr_detail = cq.query('drdetail')[0];
                    if (dr_detail.isME && record.data['action.status'] === 'open') {
                        is_update = true;
                    }

                    if (record.data['action.status'] === 'completed') {
                        is_complete = true;
                    }

                    if (record.data['action.act_owner'] === Profile.getUser()['emp_id']) {
                        is_action_owner = true;
                    }

                    if (is_complete && is_action_owner) {
                        is_update = true;
                    }

                    var actionDetail = Ext.widget('createaction', {

                        act_id: record.get('action.act_id'),
                        isCreate: false,
                        isUpdate: is_update,
                        isComplete: is_complete, //表示是否是action owner完成action，只有在action_owner 点击完成按钮创建的窗口中才会是true
                        isME: dr_detail.isME,
                        isActionOwner: is_action_owner,
                        action_status: record.data['action.status'],
                        actGrid:cq.query('drdetail')[0].down('#action_grid'),
                        dispGrid: cq.query('drdetail')[0].down('#disp_grid')

                    });
                    actionDetail.down('form').loadRecord(record);

//                    console.log('isCreate', false);

//                    console.log('is_update', is_update);
//                    console.log('isComplete', false);
//                    console.log('isMe', dr_detail.isME);
//                    console.log('is_action_owner', is_action_owner);

                    var action_type_cmp = actionDetail.down('form').down('remotecombo[name=' + 'actionType.qdtComString.' + Profile.getLang() + '_string' + ']');
                    var action_owner_cmp = actionDetail.down('form').down('searchcombo[name=' + 'owner.employee.name_' + Profile.getLang() + ']');

                    action_owner_cmp.setValue(record.get('action.act_owner'));

                    var action_type = Ext.create('QDT.model.CommonString', {
                        id: record.data['action.act_type'],
                        common_string: record.data['actionType.qdtComString.' + Profile.getLang() + '_string']
                    });
                    action_type_cmp.setValue(action_type);   //一定要放在loadRecord之后

    

                    actionDetail.show();
                }
            }

        });
    }
});

function setTextFieldValue(cmp, value) {
    cmp.setValue(value);
};

