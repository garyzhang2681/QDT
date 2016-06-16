/// <reference path="../../../extjs/ext-all.js" />
Ext.define('QDT.view.CreateAction', {
    extend: 'Ext.window.Window',
    alias: 'widget.createaction',
    layout: 'fit',
    title: Profile.getText('CreateAction'),
    width: 500,
    modal: true,
    disp_id: null,
    actGrid: {},
    dispGrid: {},
    require: ['QDT.store.ActionOwners'],
    isCreate: true,
    isUpdate: false,
    isME: false,
    isActionOwner: false,
    isComplete: false, //表示是否是action owner完成action，只有在action_owner 点击完成按钮创建的窗口中才会是true
    act_id: '',
    action_status: '',

    initComponent: function () {
        var me = this;

        var createForm = Ext.widget('form', {
            frame: true,
            layout: 'anchor',
            api: (me.isCreate && me.isME) === true ? { submit: QDT.CreateAction} : (me.isUpdate && me.isME) === true ? { submit: QDT.UpdateAction} : (me.isUpdate && me.isActionOwner && me.isComplete) === true ? { submit: QDT.UpdateActionRemark} : '',
            defaultType: 'textfield',
            listeners: {
                afterrender: function (cmp) {
                    //  console.log((me.isCreate && me.isME) === true ? '1' : (me.isUpdate && me.isME) === true ? '2' : (me.isUpdate && me.isActionOwner && me.isComplete) === true ? '3' : '4');


                    if (me.isCreate && me.isME) {
                        QDT.GetDiscrepanciesByDispositionId(me.disp_id, function (result) {
                            var discrepancies = result.data;
                            var index = 0;
                            Ext.Array.each(discrepancies, function (discrepancy) {
                                if (discrepancy.disc_disp) {
                                    createForm.down('[name=discrepancy_list]').insert(++index, Ext.create('Ext.form.field.Checkbox', {
                                        boxLabel: Profile.getText('Normal') + ': ' + discrepancy.NormalDescription + ';  ' + Profile.getText('Discrepancy') + ': ' + discrepancy.description,
                                        name: 'discrepancy_list#' + index,
                                        inputValue: discrepancy.disc_id,
                                        checked: false
                                    }));
                                }
                            });
                        });
                    }
                    //                    else if (me.isUpdate && me.isME) {
                    //                        QDT.GetDiscrepanciesByActionId(me.act_id, function (result) {
                    //                            var discrepancies = result.data;
                    //                            var index = 0;
                    //                            Ext.Array.each(discrepancies, function (discrepancy) {
                    //                                createForm.down('[name=discrepancy_list]').insert(++index, Ext.create('Ext.form.field.Checkbox', {
                    //                                    boxLabel: Profile.getText('Normal') + ': ' + discrepancy.NormalDescription + ';  ' + Profile.getText('Discrepancy') + ': ' + discrepancy.description,
                    //                                    name: 'discrepancy_list#' + index,
                    //                                    inputValue: discrepancy.disc_id,
                    //                                    checked: discrepancy.disc_act,
                    //                                    readOnly: false
                    //                                }));
                    //                            });
                    //                        });
                    //                    } 
                    else {

                        QDT.GetDiscrepanciesByActionId(me.act_id, function (result) {
                            var discrepancies = result.data;
                            var index = 0;
                            Ext.Array.each(discrepancies, function (discrepancy) {
                                if (discrepancy.disc_act) {
                                    createForm.down('[name=discrepancy_list]').insert(++index, Ext.create('Ext.form.field.Checkbox', {
                                        boxLabel: Profile.getText('Normal') + ': ' + discrepancy.NormalDescription + ';  ' + Profile.getText('Discrepancy') + ': ' + discrepancy.description,
                                        name: 'discrepancy_list#' + index,
                                        inputValue: discrepancy.disc_id,
                                        checked: true,
                                        readOnly: true
                                    }));
                                }

                            });
                        });

                        if (!me.isComplete) {
                            QDT.GetAttachments(me.act_id, function (result) {
                                if (result.success) {
                                    var attachments = result.data;
                                    var index = 0;
                                    if (attachments.length != 0) {
                                        createForm.down('[name=attachment_list]').setVisible(true);

                                        Ext.Array.each(attachments, function (attachment) {
                                            createForm.down('[name=attachment_list]').insert(++index, Ext.create('Ext.container.Container', {
                                                layout: 'hbox',
                                                items: [
                                                    {
                                                        xtype: 'box',
                                                        style: "padding: 3px",
                                                        autoEl: {
                                                            //html: '&nbsp;<a href>Link To Prospect</a>'
                                                            tag: 'a',
                                                            href: '#',
                                                            cn: getFullFileName(attachment.attachmentUrl)
                                                        },
                                                        listeners: {
                                                            render: function (component) {
                                                                component.getEl().on('click', function (e) {
                                                                    var url = '../../QDT/DownloadActionAttachment?attachmentFullFileName=' + getFullFileName(attachment.attachmentUrl);
                                                                    window.open(url);
                                                                });
                                                            }
                                                        }
                                                    }
                                                ]
                                            }));
                                        });
                                    } else {
                                        createForm.down('[name=attachment_list]').setVisible(false);
                                    }
                                } else {
                                    My.Msg.warning(result.errorMessage);
                                }
                            });
                        }
                    }
                }
            },
            defaults: {
                labelAlign: 'left',
                margin: '10 0 10 5',
                anchor: '90%',
                labelWidth: 120,
                submitValue: true
            },
            items: [{
                xtype: 'hiddenfield',
                name: 'action.disp_id',
                margin: 0,
                value: me.disp_id
            }, {
                xtype: 'hiddenfield',
                name: 'action.act_id',
                margin: 0,
                value: me.act_id
            }, {
                xtype: 'remotecombo',
                name: 'actionType.qdtComString.' + Profile.getLang() + '_string',
                fieldLabel: Profile.getText('type'),
                store: Ext.create('QDT.store.ActionTypes'),
                displayField: 'common_string',
                valueField: 'id',
                emptyText: Profile.getText('PleaseSelect'),
                readOnly: !((me.isME && me.isUpdate) || me.isCreate) //只有两种情况是可以更改的，一个是ME创建action的时候，一个是ME编辑action的时候
            },
            {
                xtype: 'employeecombo',
                name: 'owner.employee.name_' + Profile.getLang(),
                fieldLabel: Profile.getText('owner'),
                readOnly: !((me.isME && me.isUpdate) || me.isCreate)
            }, {
                name: 'action.st_action',
                fieldLabel: Profile.getText('st_action'),
                readOnly: !((me.isME && me.isUpdate) || me.isCreate)
            }, {
                name: 'action.lt_action',
                fieldLabel: Profile.getText('lt_action'),
                readOnly: !((me.isME && me.isUpdate) || me.isCreate)
            }, {
                name: 'action.ct_action',
                fieldLabel: Profile.getText('ct_action'),
                readOnly: !((me.isME && me.isUpdate) || me.isCreate)
                //   value: Profile.getText('CheckInventoryAndWip')
            }, {
                xtype: 'datefield',
                name: 'action.due_date',
                fieldLabel: Profile.getText('due_date'),
                readOnly: !((me.isME && me.isUpdate) || me.isCreate)
            }, {
                xtype: 'textarea',
                name: 'action.description',
                fieldLabel: Profile.getText('description'),
                readOnly: !((me.isME && me.isUpdate) || me.isCreate),
                height: 100
            }, {
                xtype: 'checkboxgroup',
                fieldLabel: Profile.getText('discrepancy_item'),
                name: 'discrepancy_list',
                columns: 1
            }, {
                xtype: 'textarea',
                fieldLabel: Profile.getText('remark'),
                name: 'action.remark',
                id: 'remark',
                readOnly: !((me.isComplete && me.isActionOwner) || (me.isUpdate && me.isActionOwner)), //在action完成action， 或者编辑action remark的时候 才可以编辑
                hidden: (me.isME && me.isUpdate) || me.isCreate  //在ME创建action， 或者编辑action的时候是不需要显示的。
            }, {
                xtype: 'fieldset',
                anchor: '90%',
                title: Profile.getText('attachment'),
                collapsible: true,
                defaultType: 'textfield',
                layout: 'anchor',
                items: [{
                    xtype: 'multipleattachments',
                    nameBase: "attachment#",
                    anchor: '90%'
                }],
                hidden: !me.isComplete  //在action完成action或者在编辑附件的时候需要
            }, {//查看附件的
                xtype: 'fieldset',
                name: 'attachment_list',
                anchor: '90%',
                title: Profile.getText('attachment'),
                collapsible: true,
                layout: 'anchor',
                hidden: me.isCreate || me.isComplete
            }]
        });

        me.items = [createForm];

        me.buttons = [{
            iconCls: 'add',
            text:Profile.getText('CreateRIG'),
            hidden: !(me.isUpdate && me.isActionOwner && me.isComplete),
            handler: function () {
                //  var win = Ext.create('QDT.view.rig.CreateRIG');
               // var win = Ext.create('widget.createrig');
              //  var win = Ext.widget('createrig');
                var win = Ext.createWidget('createrig');
                win.show();
            }

        },
        {
            iconCls: 'submit',
            text: me.isUpdate ? Profile.getText('Save') : Profile.getText('Close'),
            handler: function () {

                if (me.isCreate || (me.isUpdate && me.isME)) {

                    //  QDT.UpdateDispositionStatus(me.disp_id, 'open');
                    createForm.submit({
                        success: function (form, action) {
                            //me.actGrid.store.add(action.result.data);
                            me.actGrid.store.reload();
                            me.dispGrid.store.reload();
                            me.close();
                        },
                        failure: function (form, action) {
                            Ext.Msg.alert(Profile.getText('Error'), action.result.errorMessage);
                        }
                    });
                } else if (me.isComplete) {
                    if (createForm.down('[id=remark]').value === '') {
                        Ext.Msg.alert(Profile.getText('Error'), "请输入备注！");
                    } else {

                        createForm.submit({
                            success: function (form, action) {
                                QDT.UpdateActionStatus(me.act_id, 'completed', function (result) {
                                    //TODO check if this is the last completed action under the disp_id,
                                    //if it is ,then call server function to send email to QE
                                    if (result.allCompleted) {
                                        me.dispGrid.store.reload();
                                    }
                                    me.actGrid.store.reload();
                                    me.close();
                                });
                            },
                            failure: function (form, action) {
                                Ext.Msg.alert(Profile.getText('Error'), action.result.errorMessage);
                            }
                        });
                    }
                } else {
                    me.close();
                }
            }

        }];

        me.callParent();
    }
});