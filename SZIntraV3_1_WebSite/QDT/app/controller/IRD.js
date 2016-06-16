
var save_count = 0;
Ext.define('QDT.controller.IRD', {
    extend: 'Ext.app.Controller',
    views: [
         'IRD',
         'IRDBOM',
         'IRDDetail',
         'IRDModifyOperation',
         'IRDCharacteristic',
         'IRDGrid',
         'GenerateIRD',
         'IRDHeaderInformationForm',
         'ird.SPC'
    ],
    stores: [
        'IrdRouteList',
        'ird.OperationInformation'
    ],



    init: function () {
        var me = this;
        me.control({
            'ird': {
                afterrender: function (cmp) {
                    me.getIrdRouteListStore().load();
                },

                itemdblclick: function (cmp, record) {
                    var win = Ext.create('QDT.view.IRDDetail');
                    win.show();
                    var serial_cmp = cq.query('irddetail textfield[name=serial]')[0];
                    serial_cmp.setValue(record.data['serial']);
                    serial_cmp.fireEvent('blur', serial_cmp);

                }
            },


            'irddetail treepanel[name=ird_operation_information]': {
                selectionchange: function (selected, eOpts) {
   //     itemclick: function (record, item, index, e, eOpts) {
                  
                    cq.query('irddetail irdgrid[id=ird_grid]')[0].store.removeAll();

                    var serial = cq.query('irddetail textfield[name=serial]')[0].value;
                    //                    var oper_num = item.data.oper_num;
                    //                    var fml_mark = item.data.fml_mark;
                    //                    var is_cmm_flag = item.data.is_cmm_flag;

                   if (eOpts.length ===0) {
                       return;
                   }

                    var oper_num = eOpts[0].raw.oper_num;
                    var fml_mark = eOpts[0].raw.fml_mark;
                    var is_cmm_flag = eOpts[0].raw.is_cmm_flag;
                    cq.query('irdgrid displayfield[itemId=oper_num]')[0].setValue(oper_num);
                    //获取当前OP的comments
                    DpIrd.GetOperationComments(serial, oper_num, function (result) {
                        cq.query('irdgrid textarea[itemId=comment1]')[0].setValue(result.data.comment1);
                        cq.query('irdgrid textarea[itemId=comment2]')[0].setValue(result.data.comment2);
                    });

                    //获取上一个工序
                    var previousSibling = cq.query('irddetail treepanel[name=ird_operation_information]')[0].getSelectionModel().getSelection()[0].previousSibling;
                    if (previousSibling != null && oper_num == previousSibling.data.oper_num) {
                        previousSibling = cq.query('irddetail treepanel[name=ird_operation_information]')[0].getSelectionModel().getSelection()[0].previousSibling.previousSibling;
                    }

                    if (previousSibling != null) { // 当前选择的项不是第一个op

                        if (previousSibling.data.fml_mark == null) {

                            var msgbox = My.Msg.warning('请确保之前的工序检验工作完成，并且成功设置首中尾件');
                            Ext.Function.defer(function () {
                                msgbox.zIndexManager.bringToFront(msgbox);
                            }, 100);

                        } else {
                            DpIrd.CheckCheckPoint(serial, previousSibling.data.oper_num, oper_num, function (result) {
                                if (result.success) {
                                    if (result.isCheckPoint) {
                                        if (!result.previousInspectionFinished) {
                                            My.Msg.warning('请确认OP' + oper_num + '之前的所有检验是否完成！');
                                        }
                                    } else {
                                        if (previousSibling.data.fml_mark != 'others') {//fml件
                                            if (previousSibling.data.insp_char_count > previousSibling.data.insp_trans_count
                                                || previousSibling.data.oper_char_count > previousSibling.data.oper_trans_count) {
                                                My.Msg.warning('请确保之前的工序检验工作完成');
                                            } else {
                                               
                                                ShowIrdGrid(serial, oper_num, is_cmm_flag, fml_mark);
                                            }
                                        } else {//others件
                                            if (previousSibling.data.oper_char_count > previousSibling.data.oper_trans_count) {
                                                My.Msg.warning('请确保操作员之前的工序检验工作完成');
                                            } else {

                                                ShowIrdGrid(serial, oper_num, is_cmm_flag, fml_mark);
                                            }
                                        }

                                    }
                                } else {
                                    My.Msg.warning(result.errorMessage);
                                }
                            });
                            //首先检查是否是cmm的checkpoint,如果是checkpoint，则获取到对应的cmm检验情况
                            //                            DpIrd.GetCMMCharacteristicsStatisticsBySerialAndOperationNumber(serial, previousSibling.data.oper_num, oper_num, function (result) {
                            //                                if (result.success) {
                            //                                    if (result.isCheckpoint && result.data.cmm_char_count > result.data.cmm_trans_count) {
                            //                                        My.Msg.warning('请确认OP' + oper_num + '之前的所有检验是否完成！');
                            //                                    } else {
                            //                                        if (previousSibling.data.fml_mark != 'others') {
                            //                                            if (previousSibling.data.insp_char_count > previousSibling.data.insp_trans_count) {
                            //                                                My.Msg.warning('请确保之前的工序检验工作完成');
                            //                                            } else {
                            //                                                ShowIrdGrid(serial, oper_num, is_cmm_flag, fml_mark);
                            //                                            }
                            //                                        } else {
                            //                                            //检查除了cmm项，上一个工序是否每一个特征至少有一个检验结果
                            //                                            DpIrd.GetCharacteristicsStatisticsBySerialAndOperationNumber(serial, previousSibling.data.oper_num, function(result) {
                            //                                                if (result.success) {

                            //                                                    if (result.data[0].char_count == result.data[0].trans_count) {
                            //                                                        ShowIrdGrid(serial, oper_num, is_cmm_flag, fml_mark);
                            //                                                    } else {
                            //                                                        My.Msg.warning('请确保之前的工序检验工作完成');
                            //                                                    }
                            //                                                } else {
                            //                                                    My.Msg.warning(result.errorMessage);
                            //                                                }
                            //                                            });
                            //                                        }
                            //                                    }

                            //                                } else {
                            //                                    My.Msg.warning(result.errorMessage);
                            //                                }
                            //                            });
                        }
                    } else {
                        ShowIrdGrid(serial, oper_num, is_cmm_flag, fml_mark);
                    }
                }
            },



            'irddetail radiogroup[id=fmlgroup]': {
                change: function (cmp, newValue, oldValue) {
                  
                    if (newValue.fml === undefined) { // gadiogroup 的disable事件，这个时候newValue为undefine
                        return;
                    }

                    var selectedItem = cq.query('irddetail treepanel[name=ird_operation_information]')[0].getSelectionModel().getSelection()[0];
                    var fml_mark = selectedItem.data.fml_mark;
                    var is_cmm_flag = selectedItem.data.is_cmm_flag;
                    var oper_num = selectedItem.data.oper_num;
                    var id = selectedItem.data.id;


                    if (fml_mark === null || (fml_mark !== newValue.fml)) {
                        My.Msg.question('Message', '你选的是' + newValue.fml + ',请确认', function (btn, text) {
                            if (btn === 'yes') {
                                var serial = cq.query('irddetail textfield[name=serial]')[0].value;

                                DpIrd.UpdateFmlMark(serial, oper_num, newValue.fml, function (result) {
                                    if (result.success) {
                                        My.Msg.warning("你已经成功把该零件设为" + newValue.fml + "件！");

                                        cq.query('irddetail treepanel[name=ird_operation_information]')[0].getStore().load({
                                            params: { serial: cq.query('irddetail textfield[name=serial]')[0].getValue() } ,
                                            callback: function (records, operation, success) {
                                                var node = cq.query('irddetail treepanel[name=ird_operation_information]')[0].getStore().getNodeById(id);
                                                cq.query('irddetail treepanel[name=ird_operation_information]')[0].getSelectionModel().select(node);
                                                // 获取特征是从qdt_ird_route表中获取
                                                ShowIrdGrid(serial, oper_num, is_cmm_flag, newValue.fml);
                                            }

                                        });
                                    } else {
                                        My.Msg.warning(result.errorMessage);
                                    }
                                });
                            } else {
                                cq.query('irddetail radiogroup[id=fmlgroup]')[0].setValue({
                                    fml: fml_mark
                                });
                            }
                        });
                    } else {
                        //fml_mark != null  先确认这个op下面时候已经开始检验[该OP下是否有transaction]，如果没开始检验，那么fml_mark是可以更改的，如果开始检验了，则fml_mark不能更改

                    }

                }
            },

            'irddetail textfield[name=serial]': {
                blur: function (cmp) {
                    var serial = cmp.value;
                    DpIrd.GetIrdHeaderInformationBySerialNumber(serial, function (result) {
                        if (result.success) {
                            cq.query('irddetail textfield[name=forging_num]')[0].setValue(result.data.forging_num);
                            cq.query('irddetail textfield[name=ri_num]')[0].setValue(result.data.ri_num);
                            cq.query('irddetail textfield[name=heat_code]')[0].setValue(result.data.heat_code);
                            cq.query('irddetail textfield[name=part_num]')[0].setValue(result.data.part_num);
                            cq.query('irddetail textfield[name=job]')[0].setValue(result.data.job);
                            cq.query('irddetail textfield[name=suffix]')[0].setValue(result.data.suffix);
                            cq.query('irddetail textfield[name=rev_level]')[0].setValue(result.data.rev_level);
                            cq.query('irddetail textfield[name=ird_revision]')[0].setValue(result.data.ird_revision);
                            cq.query('irdgrid displayfield[itemId=serial]')[0].setValue(serial);

                        } else {
                            My.Msg.warning('获取ird信息失败！ </br>' + result.errorMessage);
                        }
                    });

                    cq.query('irddetail treepanel[name=ird_operation_information]')[0].store.load({
                        params: { serial: serial }
                    });


//                    var treepanel = cq.query('irddetail treepanel[name=ird_operation_information]')[0];
//                    treepanel.store.on("load", function () {
//                        treepanel.getSelectionModel().select(0);
//                    });


                    //                    DpIrd.GetOperationsBySerialNumber(cmp.value, function (result) {
                    //                        if (result.success) {
                    ////                            var operation_information = result.data;
                    ////                            var op_store = Ext.create('QDT.store.ird.OperatorInformation', {
                    ////                                data: operation_information
                    ////                            });
                    ////                            cq.query('treepanel treepanel[name=ird_operation_information]')[0].bindStore(op_store);

                    //                                                        var operations = result.data;

                    //                                                        var root = cq.query('irddetail treepanel[id=ird_operations]')[0].getStore().getNodeById('root');
                    //                                                        if (cq.query('irddetail treepanel[id=ird_operations]')[0].getRootNode() != null) {
                    //                                                            cq.query('irddetail treepanel[id=ird_operations]')[0].getRootNode().removeChild();
                    //                                                        }

                    //                                                        Ext.Array.each(operations, function (operation) {
                    //                                                            root.appendChild({
                    //                                                                id: operation.oper_num,
                    //                                                                item: operation.item,
                    //                                                                //   model: operation,
                    //                                                                qtip: operation.fml_mark,
                    //                                                                text: operation.oper_num,
                    //                                                                leaf: true,
                    //                                                                //                                    tooltip: operation.fml_mark

                    //                                                                tooltips: [{ xtype: 'tooltip',
                    //                                                                    listeners: {
                    //                                                                        beforeshow: function (tip) {
                    //                                                                            tip.body.dom.innerHTML = operation.fml_mark;
                    //                                                                        }
                    //                                                                    }
                    //                                                                }]
                    //                                                            });
                    //                                                        });

                    //                                                        cq.query('irddetail treepanel[id=ird_operations]')[0].setRootNode(root);

                    //                        } else {
                    //                            My.Msg.warning('请检查序列号输入是否有误！Error Code:' + result.errorMessage);
                    //                        }
                    //                    });

                }
            },

            'irddetail [gridName=irdCharacteristicGrid]': {
                cellclick: function (grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {

                    var irdCharacteristicGrid = cq.query('irddetail grid[gridName=irdCharacteristicGrid]')[0];
                    var sso = cq.query('irdgrid textfield[id=SSO]')[0];
                    var operatorSave = e.getTarget('.operator_save');
                    if (operatorSave && !operatorSave.disabled && !irdCharacteristicGrid.save_all) {
                        if (sso.value === undefined) {
                            My.Msg.warning('请输入您的sso号');
                        } else {
                            DpIrd.GetUserInfoBySSO(sso.value, function (result) {
                                if (result.success) {
                                    My.Msg.question('注意', '当前检验员为' + result.data.name_cn + '，是否保存检验结果？', function (btn) {
                                        if (btn === 'yes') {
                                            SaveRecord(record, 'operator', result.data.user_id);
                                        } else {
                                            sso.setValue('');
                                        }
                                    });
                                } else {
                                    My.Msg.warning(result.errorMessage);
                                }
                            });
                        }

                    } else if (operatorSave && !operatorSave.disabled && irdCharacteristicGrid.save_all) {
                        if (irdCharacteristicGrid.sso === '') {
                            My.Msg.warning('检验结果保存失败！');
                        } else {
                            SaveRecord(record, 'operator', irdCharacteristicGrid.sso);
                        }
                    }

                    var inspectorSave = e.getTarget('.inspector_save');
                    if (inspectorSave && !inspectorSave.disabled && !irdCharacteristicGrid.save_all) {
                        if (sso.value === undefined) {
                            My.Msg.warning('请输入您的sso号');
                        } else {
                            DpIrd.GetUserInfoBySSO(sso.value, function (result) {
                                if (result.success) {
                                    My.Msg.question('注意', '当前检验员为' + result.data.name_cn + '，是否保存检验结果？', function (btn) {
                                        if (btn === 'yes') {
                                            SaveRecord(record, 'inspector', result.data.user_id);
                                        } else {
                                            sso.setValue('');
                                        }
                                    });
                                } else {
                                    My.Msg.warning(result.errorMessage);
                                }
                            });
                        }
                    } else if (inspectorSave && !inspectorSave.disabled && irdCharacteristicGrid.save_all) {
                        if (irdCharacteristicGrid.sso === '') {
                            My.Msg.warning('检验结果保存失败！');
                        } else {
                            SaveRecord(record, 'inspector', irdCharacteristicGrid.sso);
                        }
                    }
                }
            },

            'irddetail button[id=save_all]': {
                click: function (cmp) {
                    var sso = cq.query('irdgrid textfield[id=SSO]')[0];
                    var irdCharacteristicGrid = cq.query('irddetail grid[gridName=irdCharacteristicGrid]')[0];
                    if (sso.value === undefined) {
                        My.Msg.warning('请输入您的sso号');
                    } else {
                        DpIrd.GetUserInfoBySSO(sso.value, function (result) {
                            if (result.success) {
                                My.Msg.question('注意', '当前检验员为' + result.data.name_cn + '，是否保存检验结果？', function (btn) {
                                    if (btn === 'yes') {
                                        irdCharacteristicGrid.save_all = true;
                                        irdCharacteristicGrid.sso = result.data.user_id;
                                        var record_count = cq.query('irddetail grid[id=ird_grid]')[0].store.count();
                                        for (var i = 0; i < record_count; i++) {
                                            var ird_route_id = cq.query('irddetail grid[id=ird_grid]')[0].store.getAt(i).data['ird_route_id'];
                                            var operator_save_button = Ext.get('operator_save_' + ird_route_id);
                                            if (operator_save_button != null) {
                                                if (Ext.isIE) {
                                                    Ext.getDom('operator_save_' + ird_route_id).fireEvent('onclick');
                                                } else if (Ext.isChrome) {
                                                    Ext.getDom('operator_save_' + ird_route_id).click();
                                                }
                                            }
                                            var inspector_save_button = Ext.get('inspector_save_' + ird_route_id);
                                            if (inspector_save_button != null) {
                                                if (Ext.isIE) {
                                                    Ext.getDom('inspector_save_' + ird_route_id).fireEvent('onclick');
                                                } else if (Ext.isChrome) {
                                                    Ext.getDom('inspector_save_' + ird_route_id).click();
                                                }
                                            }
                                        }
                                        irdCharacteristicGrid.save_all = false;
                                        irdCharacteristicGrid.sso = '';
                                    } else {
                                        sso.setValue('');
                                    }
                                });
                            } else {
                                My.Msg.warning(result.errorMessage);
                            }
                        });
                    }
                }
            },

            'irddetail button[id=create_dr]': {
                click: function (cmp) {

                    My.Msg.question('Message', '是否以当前登录用户 ' + Profile.getUserName() + ' 创建DR', function (btn, text) {
                        if (btn == 'yes') {
                            Ext.create('QDT.view.CreateDR', {
                                creator: Profile.getUser()
                            }).show();
                        } else {

                            var win = Ext.create('Asz.ux.UserValidation');
                            win.down('form').getForm().api = {
                                submit: SystemAdmin.UserValidation
                            };
                            win.down('button[name=submit]').addListener('click', function () {
                                win.down('form').getForm().submit({
                                    success: function (form, action) {
                                        if (action.result.success) {
                                            My.Msg.warning('请确认DR创建者为' + action.result.data['name_' + Profile.getLang()] + '(' + action.result.data.sso + ')', function (btn, text) {
                                                if (btn == 'ok') {
                                                    win.close();
                                                    Ext.create('QDT.view.CreateDR', {
                                                        creator: action.result.data
                                                    }).show();
                                                }
                                            });

                                        } else {
                                            Ext.Msg.alert('Error', action.result.errorMessage);
                                        }
                                    },
                                    failure: function (form, action) {
                                        Ext.Msg.alert('Error', action.result.errorMessage);
                                    }
                                });


                            });


                            //                            Ext.override(win, {
                            //                                doLogIn: function () {
                            //                                    console.log('sdf');
                            //                                }
                            //                            });
                            //                            win.validate = function () {
                            //                                console.log('xxxx');
                            //                                //                                me.down('form').getForm().submit({
                            //                                //                                    success: function (form, action) {
                            //                                //                                        if (action.result.success) {
                            //                                //                                            My.Msg.warning('请确认DR创建者为' + action.result.data['name_' + Profile.getLang()] + '(' + action.result.data.sso + ')', function (btn, text) {
                            //                                //                                                if (btn == 'ok') {
                            //                                //                                                    me.close();
                            //                                //                                                    Ext.create('QDT.view.CreateDR', {
                            //                                //                                                        creator: action.result.data
                            //                                //                                                    }).show();
                            //                                //                                                }
                            //                                //                                            });

                            //                                //                                        } else {
                            //                                //                                            Ext.Msg.alert('Error', action.result.errorMessage);
                            //                                //                                        }
                            //                                //                                    },
                            //                                //                                    failure: function (form, action) {
                            //                                //                                        Ext.Msg.alert('Error', action.result.errorMessage);
                            //                                //                                    }
                            //                                //                                });

                            //                            };
                            win.show();

                        }
                    });
                }
            },

            'irdbom [id=addoperation]': {
                click: function (b, e, eOpts) {
                    var createOperationForm = Ext.create('QDT.view.IRDCreateOperation');
                    createOperationForm.show();
                }
            },

            'irdbom [id=part_num]': {
                select: function (cmp) {
                    var part_num = cmp.value;
                    DpIrd.GetCurrentRevisionByItem(part_num, function (result) {
                        if (result.success) {

                            var can_edit = false;
                            var ird_id = '';
                            var need_verify = false;
                            var need_approve = false;
                            var prepared = false;
                            var verified = false;
                            var is_upgrade = false;

                            if (result.noOperation) {// item 中获取不到operation
                                My.Msg.warning('There is no operation in this item!');
                            } else if (result.noIrdId) {//item 中可以获取到operation，但是从来没有为这个item创建过ird，所以在sl_item表中，ird_id列为空
                                My.Msg.question("Message", "There is no ird record for this item! Do you want to create  a new version?", function (btn, text) {
                                    if (btn === 'yes') {
                                        // Ext.ComponentQuery.query('irdbom')[0].isUpgrade = true;
                                        DpIrd.CreateIrdRevision(part_num, function (newResult) {
                                            if (newResult.success) {

                                                //  console.log(newResult.maxIrdId);
                                                Ext.ComponentQuery.query('button[id=upgrade_ird]')[0].setDisabled(true);
                                                Ext.ComponentQuery.query('button[id=save]')[0].setDisabled(true);
                                                Ext.ComponentQuery.query('button[id=verify]')[0].setDisabled(true);
                                                Ext.ComponentQuery.query('button[id=approve]')[0].setDisabled(true);

                                                can_edit = true;
                                                ird_id = '';
                                                need_verify = false;
                                                need_approve = false;
                                                prepared = false;
                                                verified = false;
                                                is_upgrade = true;


                                                var operations = result.operations;
                                                var op_store = Ext.create('QDT.store.IrdOperations', {
                                                    data: operations
                                                });
                                                Ext.ComponentQuery.query('grid[gridName=irdBomGrid]')[0].reconfigure(op_store);

                                                Ext.ComponentQuery.query('irdbom')[0].ird_id = newResult.maxIrdId;
                                                Ext.ComponentQuery.query('irdbom')[0].canEdit = can_edit;
                                                Ext.ComponentQuery.query('irdbom')[0].isUpgrade = is_upgrade;
                                                Ext.ComponentQuery.query('irdbom')[0].needVerify = need_verify;
                                                Ext.ComponentQuery.query('irdbom')[0].needApprove = need_approve;
                                                Ext.ComponentQuery.query('irdbom')[0].verified = verified;
                                                Ext.ComponentQuery.query('irdbom')[0].prepared = prepared;

                                                //                                                cmp.setDisabled(true);
                                                //                                                cmp.up().down('button[id=save]').setDisabled(false);
                                                //                                                Ext.ComponentQuery.query('irdbom')[0].isUpgrade = true;
                                            }
                                        });
                                    }
                                    else if (btn === 'no') {
                                        this.close();
                                        // Ext.ComponentQuery.query('irdbom')[0].isUpgrade = false;
                                        // cmp.setDisabled(false);  
                                        Ext.ComponentQuery.query('irdbom')[0].close();
                                    }

                                });

                            } else if (result.noNormalIrdId) {//item 中可以获取到operation，有创建过这个item的ird draft，在sl_item表中，ird_id 为这个draft的id，T
                                //TODO 这个draft如果被deny的话，应该把对应的sl_item中的ird_id清空
                                My.Msg.warning('There is no ird formal record for this item!');
                                //TODO 是否是当前用户编辑过的


                            } else {// 这个item有正在使用的ird_id版本

                                ird_revision_status = result.irdRevision.ird_revision.status;
                                if (result.newIrdRevision != null) {
                                    new_ird_revision_status = result.newIrdRevision.ird_revision.status;
                                }
                                if (result.operations.length > 0) {

                                    //第一次进入编辑
                                    if (ird_revision_status === 'approved' && result.irdRevision.ird_revision.editor === null && result.newIrdRevision === null) {
                                        //                                    console.log('第一次编辑！');
                                        Ext.ComponentQuery.query('button[id=upgrade_ird]')[0].setDisabled(false);
                                        Ext.ComponentQuery.query('button[id=save]')[0].setDisabled(true);
                                        Ext.ComponentQuery.query('button[id=verify]')[0].setDisabled(true);
                                        Ext.ComponentQuery.query('button[id=approve]')[0].setDisabled(true);
                                        can_edit = true;
                                        is_upgrade = false;
                                        ird_id = result.irdRevision.ird_revision.ird_id;

                                    }
                                    //非第一次进入编辑
                                    else if (result.irdRevision.ird_revision.editor === result.user && result.newIrdRevision === null) {
                                        //                                    console.log('非第一次编辑！');
                                        My.Msg.warning('You edited this ird revision before, please continue!');
                                        Ext.ComponentQuery.query('button[id=upgrade_ird]')[0].setDisabled(true);
                                        Ext.ComponentQuery.query('button[id=save]')[0].setDisabled(false);
                                        Ext.ComponentQuery.query('button[id=verify]')[0].setDisabled(true);
                                        Ext.ComponentQuery.query('button[id=approve]')[0].setDisabled(true);
                                        can_edit = true;
                                        is_upgrade = true;
                                        ird_id = result.irdRevision.ird_revision.ird_id;
                                    }

                                    //用户1没有点save，其他用户应该接到提示
                                    else if (result.irdRevision.ird_revision.editor != result.user && result.newIrdRevision === null) {
                                        My.Msg.warning("Someone is Editing this IRD BOM");
                                    }

                                    //verify
                                    else if (result.newIrdRevision != null && new_ird_revision_status === 'prepared' && result.newIrdRevision.ird_revision.prepare_by != result.user) {
                                        Ext.ComponentQuery.query('button[id=upgrade_ird]')[0].setDisabled(true);
                                        Ext.ComponentQuery.query('button[id=save]')[0].setDisabled(true);
                                        Ext.ComponentQuery.query('button[id=verify]')[0].setDisabled(false);
                                        Ext.ComponentQuery.query('button[id=approve]')[0].setDisabled(true);
                                        can_edit = false;
                                        need_verify = true;
                                        is_upgrade = false;
                                        ird_id = result.newIrdRevision.ird_revision.ird_id;
                                    }

                                    //approve
                                    else if (result.newIrdRevision != null && new_ird_revision_status === 'verified' && result.newIrdRevision.ird_revision.prepare_by != result.user
                                && result.newIrdRevision.ird_revision.verify_by != result.user) {
                                        Ext.ComponentQuery.query('button[id=upgrade_ird]')[0].setDisabled(true);
                                        Ext.ComponentQuery.query('button[id=save]')[0].setDisabled(true);
                                        Ext.ComponentQuery.query('button[id=verify]')[0].setDisabled(true);
                                        Ext.ComponentQuery.query('button[id=approve]')[0].setDisabled(false);
                                        can_edit = false;
                                        is_upgrade = false;
                                        need_approve = true;
                                        ird_id = result.newIrdRevision.ird_revision.ird_id;
                                    } else if (result.newIrdRevision.ird_revision.prepare_by == result.user) {
                                        prepared = true;
                                        // is_upgrade = false;
                                        My.Msg.warning('You have upgraded this ird revision');
                                    } else if (result.newIrdRevision.ird_revision.verify_by == result.user) {
                                        verified = true;
                                        //is_upgrade = false;
                                        My.Msg.warning('You have verified this ird revision');
                                    } else {
                                        Ext.ComponentQuery.query('button[id=upgrade_ird]')[0].setDisabled(true);
                                        Ext.ComponentQuery.query('button[id=save]')[0].setDisabled(true);
                                        Ext.ComponentQuery.query('button[id=verify]')[0].setDisabled(true);
                                        Ext.ComponentQuery.query('button[id=approve]')[0].setDisabled(true);
                                        My.Msg.warning(result.irdRevision.ird_revision.editor + ' is Editing!');
                                        can_edit = false;
                                        //is_upgrade = false;
                                        ird_id = result.irdRevision.ird_revision.ird_id;
                                    }


                                    var operations = result.operations;
                                    var op_store = Ext.create('QDT.store.IrdOperations', {
                                        data: operations
                                    });
                                    Ext.ComponentQuery.query('grid[gridName=irdBomGrid]')[0].reconfigure(op_store);

                                    if (result.irdRevision.ird_revision !== null) {
                                        var ird_revision = result.irdRevision;
                                        Ext.ComponentQuery.query('textfield[id=rev_level]')[0].setValue(ird_revision.ird_revision.rev_level);
                                        Ext.ComponentQuery.query('textfield[id=ird_revision]')[0].setValue(ird_revision.ird_revision.revision);
                                        Ext.ComponentQuery.query('textfield[id=job]')[0].setValue(ird_revision.ird_revision.job);
                                        Ext.ComponentQuery.query('textfield[id=suffix]')[0].setValue(ird_revision.ird_revision.suffix);

                                        Ext.ComponentQuery.query('irdbom')[0].ird_id = ird_id;
                                        //                                    Ext.ComponentQuery.query('irdbom')[0].isPrepare = ird_revision.ird_revision.ird_id;
                                        //                                    Ext.ComponentQuery.query('irdbom')[0].isVerify = ird_revision.ird_revision.ird_id;
                                        //                                    Ext.ComponentQuery.query('irdbom')[0].isApprove = ird_revision.ird_revision.ird_id;
                                        Ext.ComponentQuery.query('irdbom')[0].canEdit = can_edit;
                                        Ext.ComponentQuery.query('irdbom')[0].isUpgrade = is_upgrade;
                                        Ext.ComponentQuery.query('irdbom')[0].needVerify = need_verify;
                                        Ext.ComponentQuery.query('irdbom')[0].needApprove = need_approve;
                                        Ext.ComponentQuery.query('irdbom')[0].verified = verified;
                                        Ext.ComponentQuery.query('irdbom')[0].prepared = prepared;
                                        //                                    Ext.ComponentQuery.query('button[id=upgrade_ird]')[0].setDisabled(false);
                                    }
                                    else {
                                        MessageBox.alert("Warning", "there is no operation record or IRD revision information for item " + part_num);
                                    }

                                }
                                else {
                                    MessageBox.alert("Warning", "there is no operation record or IRD revision information for item " + part_num);
                                }
                            }
                        }
                    });
                }
            },

            'irdbom [id=upgrade_ird]': {
                click: function (cmp) {
                    My.Msg.question("Message", "Do you want to upgrade current ird revision to a new version?", function (btn, text) {
                        if (btn === 'yes') {
                            // Ext.ComponentQuery.query('irdbom')[0].isUpgrade = true;
                            DpIrd.CopyIrdDraft(Ext.ComponentQuery.query('irdbom')[0].ird_id, function (result) {
                                if (result.success === false) {
                                    My.Msg.warning(result.errorMessage)
                                }
                                else {
                                    cmp.setDisabled(true);
                                    cmp.up().down('button[id=save]').setDisabled(false);
                                    Ext.ComponentQuery.query('irdbom')[0].isUpgrade = true;
                                }
                            });
                        }
                        else if (btn === 'no') {
                            cmp.close();
                            // Ext.ComponentQuery.query('irdbom')[0].isUpgrade = false;
                            // cmp.setDisabled(false);  
                            Ext.ComponentQuery.query('irdbom')[0].close();
                        }

                    });
                }
            },

            'irdbom [id=save]': {
                click: function (cmp) {
                    My.Msg.question('警告', '确定将修改的内容升版为新的IRD版本吗？<br> 选择YES，确定升版；选择NO,放弃之前的编辑操作', function (btn, text) {
                        if (btn === 'yes') {
                            DpIrd.SubmitNewIrdRevision(Ext.ComponentQuery.query('irdbom')[0].ird_id,
                            Ext.ComponentQuery.query('textfield[id=rev_level]')[0].value,
                            Ext.ComponentQuery.query('textfield[id=part_num]')[0].value, function (result) {
                                if (result.success === true) {
                                    My.Msg.warning('升版IRD成功！');
                                } else if (result.success === false) {
                                    My.Msg.warning(result.errorMessage);
                                }
                                Ext.ComponentQuery.query('irdbom')[0].close();
                            })
                        }
                        else if (btn === 'no') {

                            DpIrd.DropIrdDraft(Ext.ComponentQuery.query('irdbom')[0].ird_id, function (result) {
                                if (result.success === true) {
                                    My.Msg.warning('编辑放弃成功！');
                                } else if (result.success === false) {
                                    My.Msg.warning(result.errorMessage);
                                }
                                Ext.ComponentQuery.query('irdbom')[0].close();
                            });
                        }
                    });
                    cmp.up().down('button[id=save]').setDisabled(true);
                    cmp.up().down('button[id=upgrade_ird]').setDisabled(false);

                }
            },

            //            'irdbom [id=verify]': {
            //                click: function (cmp) {
            //                    My.Msg.question('警告', '通过对此IRD BOM的校验？', function (btn, text) {
            //                        if (btn === 'yes') {
            //                            DpIrd.VerifyIrdRevision(Ext.ComponentQuery.query('irdbom')[0].ird_id, function (result) {
            //                                if (result.success === true) {
            //                                    My.Msg.warning('通过校验！');
            //                                    Ext.ComponentQuery.query('button[id=upgrade_ird]')[0].setDisabled(true);
            //                                    Ext.ComponentQuery.query('button[id=save]')[0].setDisabled(true);
            //                                    Ext.ComponentQuery.query('button[id=verify]')[0].setDisabled(true);
            //                                    Ext.ComponentQuery.query('button[id=approve]')[0].setDisabled(true);
            //                                } else if (result.success === false) {
            //                                    My.Msg.warning(result.errorMessage);
            //                                }
            //                            })
            //                        }
            //                        else if (btn === 'no') {

            //                            DpIrd.VerifyDenyIrdRevision(Ext.ComponentQuery.query('irdbom')[0].ird_id, function (result) {
            //                                if (result.success === true) {
            //                                    My.Msg.warning('未通过校验！');
            //                                } else if (result.success === false) {
            //                                    My.Msg.warning(result.errorMessage);
            //                                }
            //                            })
            //                        }
            //                        Ext.ComponentQuery.query('irdbom')[0].close();
            //                    });
            //                }
            //            },

            //            'irdbom [id=approve]': {
            //                click: function (cmp) {
            //                    My.Msg.question('警告', '批准该IRD BOM？', function (btn, text) {
            //                        if (btn === 'yes') {
            //                            DpIrd.ApproveIrdRevision(Ext.ComponentQuery.query('irdbom')[0].ird_id, function (result) {
            //                                if (result.success === true) {
            //                                    My.Msg.warning('批准！');
            //                                    Ext.ComponentQuery.query('button[id=upgrade_ird]')[0].setDisabled(true);
            //                                    Ext.ComponentQuery.query('button[id=save]')[0].setDisabled(true);
            //                                    Ext.ComponentQuery.query('button[id=verify]')[0].setDisabled(true);
            //                                    Ext.ComponentQuery.query('button[id=approve]')[0].setDisabled(true);
            //                                } else if (result.success === false) {
            //                                    My.Msg.warning(result.errorMessage);
            //                                }
            //                            })
            //                        }
            //                        else if (btn === 'no') {
            //                            DpIrd.ApproveDenyIrdRevision(Ext.ComponentQuery.query('irdbom')[0].ird_id, function (result) {
            //                                if (result.success === true) {
            //                                    My.Msg.warning('不批准！');
            //                                } else if (result.success === false) {
            //                                    My.Msg.warning(result.errorMessage);
            //                                }
            //                            })
            //                        }
            //                        Ext.ComponentQuery.query('irdbom')[0].close();
            //                    });
            //                }
            //            },

            'irdmodifyoperation [id=addcharacteristic]': {
                click: function (b, e, eOpts) {
                    if (cq.query('irdmodifyoperation')[0].canEdit == true) {
                        var irdCreateCharacteristic = Ext.create('QDT.view.IRDCharacteristic', {
                            //  isUpgrade: cq.query('irdmodifyoperation')[0].isUpgrade,
                            isCreate: true,
                            ird_id: cq.query('irdmodifyoperation')[0].ird_id
                        });
                        irdCreateCharacteristic.show();
                    } else {
                        My.Msg.warning('Someone is Editing this IRD BOM, Please contact IT!');
                    }
                }
            },

            'irdcharacteristic combobox[name=basic_rec_type]': {
                select: function (combo, records, eOpts) {
                    if (records[0].data.record_type === 'range' || cq.query('irdcharacteristic combobox[name=fml_rec_type]')[0].value === 'range') {
                        Ext.ComponentQuery.query('textfield[name=ird_characteristic.char_maximum]')[0].enable();
                        Ext.ComponentQuery.query('textfield[name=ird_characteristic.char_minimum]')[0].enable();
                    }
                    else {
                        Ext.ComponentQuery.query('textfield[name=ird_characteristic.char_maximum]')[0].disable();
                        Ext.ComponentQuery.query('textfield[name=ird_characteristic.char_minimum]')[0].disable();
                    }
                }
            },

            'irdcharacteristic combobox[name=fml_rec_type]': {
                select: function (combo, records, eOpts) {
                    if (records[0].data.record_type === 'range' || cq.query('irdcharacteristic combobox[name=basic_rec_type]')[0].value === 'range') {
                        Ext.ComponentQuery.query('textfield[name=ird_characteristic.char_maximum]')[0].enable();
                        Ext.ComponentQuery.query('textfield[name=ird_characteristic.char_minimum]')[0].enable();
                    }
                    else {
                        Ext.ComponentQuery.query('textfield[name=ird_characteristic.char_maximum]')[0].disable();
                        Ext.ComponentQuery.query('textfield[name=ird_characteristic.char_minimum]')[0].disable();
                    }
                }
            },

            //            'irdgrid button[id=collapse_all]': {
            //                click: function (b, e, eOpts) {
            //                    b.up().up().view.getFeature('operationGrouping').collapseAll();
            //                    cq.query('irdgrid button[id=expand_all]')[0].setDisabled(false);
            //                    cq.query('irdgrid button[id=collapse_all]')[0].setDisabled(true);
            //                }
            //            },

            //            'irdgrid button[id=expand_all]': {
            //                click: function (b, e, eOpts) {
            //                    b.up().up().view.getFeature('operationGrouping').expandAll();
            //                    cq.query('irdgrid button[id=expand_all]')[0].setDisabled(true);
            //                    cq.query('irdgrid button[id=collapse_all]')[0].setDisabled(false);
            //                }
            //            },

            'generateird textfield[name=serial]': {
                blur: function (cmp) {

                    var serial = cmp.value;

                    My.Msg.question("Message", "请确认您输入的序列号是否正确?", function (btn, text) {
                        if (btn === 'yes') {
                            DpIrd.GetIrdBomHeaderInformationBySerialNumber(serial, function (result) {

                                if (result.success) {

                                    cq.query('generateird textfield[name=forging_num]')[0].setValue(result.data.forging_num);
                                    cq.query('generateird textfield[name=ri_num]')[0].setValue(result.data.ri_num);
                                    cq.query('generateird textfield[name=heat_code]')[0].setValue(result.data.heat_code);
                                    cq.query('generateird textfield[name=part_num]')[0].setValue(result.data.part_num);
                                    cq.query('generateird textfield[name=job]')[0].setValue(result.data.job);
                                    cq.query('generateird textfield[name=suffix]')[0].setValue(result.data.suffix);
                                    cq.query('generateird textfield[name=rev_level]')[0].setValue(result.data.rev_level);
                                    cq.query('generateird textfield[name=ird_revision]')[0].setValue(result.data.ird_revision);

                                } else {
                                    My.Msg.warning(result.errorMessage);
                                }
                            });
                        } else {

                        }
                    });
                }
            },

            'ird_spc button[name=export]': {
                click: function (smp) {
                    // console.log('123');
                    cq.query('ird_spc form[name=spc_form]')[0].submit({
                        url: 'DpIrd/ExportSpc',
                        success: function (form, action) {
                            My.Msg.warning('导出成功');
                        },
                        failure: function (form, action) {
                            My.Msg.warning(action.result.constructor);
                        }
                    });
                }
            },

            'ird_spc button[name=reset]': {
                click: function (cmp) {
                    cq.query('ird_spc form[name=spc_form]')[0].form.reset();
                }
            },


            'ird_spc button[name=submit]': {
                click: function (cmp) {
                    cmp.up('form').getForm().submit({
                        url: 'DpIrd/GetSpc',
                        waitMsg: '正在获取数据...',
                        success: function (form, action) {
                            //  cq.query('ird_spc chart[name=spc_chart]')[0].getChartStore().loadData(action.result.data);
                            var chart = cq.query('ird_spc chart[name=spc_chart]')[0];
                            chart.axes.get('left').maximum = action.result.line1;
                            chart.axes.get('left').minimum = action.result.line7;

                            chart.series.each(function (aSeries) {

                                if (aSeries.recordType == 'threshold') {
                                    aSeries.showInLegend = false;
                                }
                                else if (aSeries.recordType != action.result.record_type) {
                                    aSeries.hideAll();
                                    aSeries.showInLegend = false;
                                } else {
                                    aSeries.showAll();
                                    aSeries.showMarkers = true;
                                    aSeries.showInLegend = true;
                                }
                            })


                            //  cq.query('ird_spc chart[name=spc_chart]')[0].axes.get('left').minorTickSteps = 0.001;
                            chart.getStore().loadRawData(action.result.data, false);
                        },
                        failure: function (form, action) {
                            My.Msg.warning(action.result.errorMessage);
                        }
                    });
                }
            }


        });
    }
});

function getColumnIndex(grid, column_id) {
    var columns = grid.columns;
    for (var i = 0; i < columns.length; i++) {
        if (columns[i].id === column_id) {
            return i;
        }
    }
    return 10000;
}


function IsNum(s) {
    if (s != null && s != "") {
        return !isNaN(s);
    }
    return false;
}


function SaveRecord(record, type, user_id) {
    var ird_route_id = record.data['ird_route_id'];
    var char_id = record.data['char_id'];
    var inspect_type = 0;
    if (type === 'operator') {
        inspect_type = 0;
    } else if (type === 'inspector') {
        inspect_type = 1;
    }
    var rec_type = (record.data['fml_mark'] === 'others') ? record.data['basic_rec_type'] : record.data['fml_rec_type'];
    var fml_prefix = (record.data['fml_mark'] === 'others') ? '' : 'fml_'
    cq.query('irddetail grid[id=ird_grid]')[0].selModel.select(record.data['char_seq'] - 1);
    //先判断是operator 还是inspector
    if (rec_type === 'range') {
        var min = Ext.get(fml_prefix + type + '_min_' + ird_route_id).dom.value;
        var max = Ext.get(fml_prefix + type + '_max_' + ird_route_id).dom.value;

        if (min === '' || max === '') {
            // My.Msg.warning('请确认特征' + record.data['char_num'] + '的结果是否没有填入！');
        }
        //                             else if (!IsNum(operator_min) || !IsNum(operator_max)) {
        //                                My.Msg.warning('请确认特征' + record.data['char_num'] + '中填写的是数字！');
        //                            }
        //        else if (min >= max) {
        //            var msgbox = My.Msg.warning('请确认特征' + record.data['char_num'] + '的最大值是否大于最小值！');
        //            Ext.Function.defer(function () {
        //                msgbox.zIndexManager.bringToFront(msgbox);
        //            }, 100);
        //        } 
        else {
            save_count++;
            DpIrd.SaveRangeTransaction(ird_route_id, char_id, inspect_type, min, max, user_id, function (result) {
                if (result.success) {
                    save_count--;
                    Ext.get(fml_prefix + type + '_min_' + ird_route_id).dom.disabled = true;
                    Ext.get(fml_prefix + type + '_max_' + ird_route_id).dom.disabled = true;
                    // e.getTarget('.operator_save').disabled = true;
                    //e.getTarget('.operator_save').style.visibility = 'hidden';
                    //Ext.get(type + '_save_' + ird_route_id).remove();

                    ShowStamp(Ext.get(type + '_save_' + ird_route_id), user_id);
                    if (save_count == 0) {
                        ReloadTree();
                    }

                    //                Ext.fly('elId').replaceWith({
                    //                    tag: 'p',
                    //                    cls: 'myCls',
                    //                    html: 'Hi I have replaced elId'
                    //                });

                } else {
                    My.Msg.warning('保存检验结果失败, </br>Error Code: ' + result.errorMessage);
                }
            });
            // ShowStamp(Ext.get(type + '_save_' + ird_route_id));
        }
    } else if (rec_type === 'value') {
        var value = Ext.get(fml_prefix + type + '_value_' + record.data.ird_route_id).dom.value;

        if (value === '') {
            //  My.Msg.warning('请确认特征' + record.data['char_num'] + '的结果是否没有填入！');
        } else {
            save_count++;
            DpIrd.SaveValueTransaction(ird_route_id, char_id, inspect_type, value, user_id, function (result) {
                if (result.success) {
                    save_count--;
                    Ext.get(fml_prefix + type + '_value_' + record.data.ird_route_id).dom.disabled = true;
                    // e.getTarget('.operator_save').style.visibility = 'hidden';
                    //  Ext.get(type + '_save_' + record.data['ird_route_id']).remove();
                    ShowStamp(Ext.get(type + '_save_' + record.data['ird_route_id']), user_id);
                    if (save_count == 0) {
                        ReloadTree();
                    }
                } else {
                    My.Msg.warning('保存检验结果失败, </br>Error Code: ' + result.errorMessage);
                }
            });
        }


    } else if (rec_type === 'pass') {


        if (!Ext.get(fml_prefix + type + '_passed_' + record.data.ird_route_id).dom.checked &&
                            !Ext.get(fml_prefix + type + '_notPassed_' + record.data.ird_route_id).dom.checked) {
            //   My.Msg.warning('请确认特征' + record.data['char_num'] + '的结果是否没有填入！');
        } else {
            var pass = false;
            if (Ext.get(fml_prefix + type + '_passed_' + record.data.ird_route_id).dom.checked) {
                pass = Ext.get(fml_prefix + type + '_passed_' + record.data.ird_route_id).dom.value;
            }
            if (Ext.get(fml_prefix + type + '_notPassed_' + record.data.ird_route_id).dom.checked) {
                pass = Ext.get(fml_prefix + type + '_notPassed_' + record.data.ird_route_id).dom.value;
            }
            save_count++;
            DpIrd.SavePassTransaction(ird_route_id, char_id, inspect_type, pass, user_id, function (result) {
                if (result.success) {
                    save_count--;
                    Ext.get(fml_prefix + type + '_passed_' + record.data.ird_route_id).dom.disabled = true;
                    Ext.get(fml_prefix + type + '_notPassed_' + record.data.ird_route_id).dom.disabled = true;
                    // e.getTarget('.operator_save').style.visibility = 'hidden';
                    //Ext.get(type + '_save_' + record.data['ird_route_id']).remove();
                    ShowStamp(Ext.get(type + '_save_' + record.data['ird_route_id']), user_id);
                    if (save_count == 0) {
                        ReloadTree();
                    }
                } else {
                    My.Msg.warning('保存检验结果失败, </br>Error Code: ' + result.errorMessage);
                }
            });
        }
    }
}


function ReloadTree() {
    var serial = cq.query('irddetail textfield[name=serial]')[0].getValue();
    //  cq.query('irddetail treepanel[name=ird_operation_information]')[0].removeAll();
    cq.query('irddetail treepanel[name=ird_operation_information]')[0].store.reload({
        params: { serial: serial }
    });
}
function ShowStamp(el, user_id) {

    SystemAdmin.GetUserById(user_id, function (result) {

        if (result.success) {
            var name = '';
            if (Profile.getLang() === 'en') {
                name = result.data['name_en'];
            } else if (Profile.getLang() === 'cn') {
                name = result.data['name_cn'];
            }
            el.replaceWith({
                html: name
            });
            cq.query('irddetail radiogroup[id=fmlgroup]')[0].setDisabled(true);
        } else {
            My.Msg.warning(result.errorMessage);
        }
    });
}


function ShowIrdGrid(serial, oper_num, is_cmm_flag, fml_mark) {

    var ird_grid = cq.query('irddetail irdgrid[id=ird_grid]')[0];
    ird_grid.store.removeAll();


    var fml_group = cq.query('irddetail radiogroup[id=fmlgroup]')[0];
    //清空fmlgroup
     fml_group.reset();


    if (fml_mark === null) {
        cq.query('irddetail radiogroup[id=fmlgroup]')[0].setDisabled(false);
        My.Msg.warning('请先选择首件，中间件，尾件还是其他件！');
    } else {
        // 获取特征是从qdt_ird_route表中获取
        DpIrd.GetRoutesAndTransactionsBySerialNumberAndOperationNumber(serial, oper_num, is_cmm_flag, function (result) {
            if (result.success === true) {
                fml_group.setValue({
                    fml: result.data[0].fml_mark
                });

                var records = result.data;
                //                            var routes_store = Ext.create('QDT.store.IrdRoutes');
                //                            routes_store.loadRawData(routes);
                //与上面的效果一样，但是在QDT.store.IrdCharacteristics 需要设置proxy memory即可
                var records_store = Ext.create('QDT.store.IrdRecords', {
                    data: records
                });
                if (fml_mark === 'others') {
                    ird_grid.columns[getColumnIndex(ird_grid, 'operator_fml_rec_type')].hide();
                    ird_grid.columns[getColumnIndex(ird_grid, 'inspector_fml_rec_type')].hide();
                    ird_grid.columns[getColumnIndex(ird_grid, 'operator_basic_rec_type')].show();
                    ird_grid.columns[getColumnIndex(ird_grid, 'inspector_basic_rec_type')].show();

                    ird_grid.columns[getColumnIndex(ird_grid, 'basic_gage')].show();
                    ird_grid.columns[getColumnIndex(ird_grid, 'fml_gage')].hide();

                    ird_grid.columns[getColumnIndex(ird_grid, 'char_others')].show();
                    ird_grid.columns[getColumnIndex(ird_grid, 'char_fml')].hide();
                } else {
                    ird_grid.columns[getColumnIndex(ird_grid, 'operator_fml_rec_type')].show();
                    ird_grid.columns[getColumnIndex(ird_grid, 'inspector_fml_rec_type')].show();
                    ird_grid.columns[getColumnIndex(ird_grid, 'operator_basic_rec_type')].hide();
                    ird_grid.columns[getColumnIndex(ird_grid, 'inspector_basic_rec_type')].hide();

                    ird_grid.columns[getColumnIndex(ird_grid, 'basic_gage')].hide();
                    ird_grid.columns[getColumnIndex(ird_grid, 'fml_gage')].show();

                    ird_grid.columns[getColumnIndex(ird_grid, 'char_others')].hide();
                    ird_grid.columns[getColumnIndex(ird_grid, 'char_fml')].show();
                }

                ird_grid.reconfigure(records_store);

                //将transaction中的值放到对应的cell中，在save之后，也需要重新加载一下整个grid

                if (result.hasTransaction) {
                    fml_group.setDisabled(true);
                } else {
                    fml_group.setDisabled(false);
                }

                cq.query('irddetail button[id=save_all]')[0].setDisabled(false);
            } else {
                My.Msg.warning(result.errorMessage);
            }
        });
    }
}