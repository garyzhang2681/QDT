Ext.define('QDT.view.tq.SkillTrainingGrid', {
    alias: 'widget.tq-skilltraininggrid',
    extend: 'Ext.grid.Panel',
    activeRecord: {},
    requires: [
        'QDT.util.Renderer',
        'QDT.ux.Skirtle.Component'
    ],

    requires: ['QDT.ux.Skirtle.Component', 'QDT.ux.Skirtle.CTemplate'],
    initComponent: function () {
        var me = this;

        Ext.applyIf(me, {
            columns: [
                {
                    xtype: 'rownumberer',
                    width: 32
                }, {
                    dataIndex: 'request_id',
                    text: Profile.getText('id'),
                    width: 45
                }, {
                    dataIndex: 'local_id',
                    text: Profile.getText('local_id'),
                    width: 60,
                    minWidth: 60
                }, {
                    dataIndex: 'employee_id',
                    text: Profile.getText('employee_name'),
                    width: 100,
                    minWidth: 90,
                    renderer: QDT.util.Renderer.employeeName
                }, {
                    dataIndex: 'skill_code',
                    text: Profile.getText('skill_code'),
                    flex: 1 //width: 165, minWidth: 120
                }, {
                    dataIndex: 'start_time',
                    text: Profile.getText('create_date'),
                    width: 80,
                    renderer: QDT.util.Renderer.dateRenderer
                }, {
                    dataIndex: 'due_date',
                    text: Profile.getText('due_date'),
                    width: 80,
                    renderer: QDT.util.Renderer.trainingDueDate
                }, {
                    dataIndex: 'current_step_name',
                    text: Profile.getText('status'),
                    width: 50,
                    renderer: me.statusRenderer
                }, {
                    dataIndex: 'current_step_name',
                    text: Profile.getText('current_step'),
                    width: 130
                }, {
                    dataIndex: 'certify_mode',
                    text: 'certify_mode',
                    width: 130,
                    hidden:true
            },{
                    text: Profile.getText('attachment'),
                    xtype: 'componentcolumn',
                    renderer: function (record) {
                        return {
                            iconCls: 'attachment',
                            itemId: 'view-attachment',
                            xtype: 'attachmentbutton',
                            text: Profile.getText('attachment'),
                            tooltip: Profile.getText('txtViewAttachment'),
                            refType: 'process',
                            rootCt: me,
                            generateId: false,
                            viewerMode: true
                        }
                    }
                }

            //            ,{
            //                dataIndex: 'step0', text: Profile.getText('BasicTraining'), tooltip: Profile.getText('BasicTraining'), flex: 1, minWidth: 60, renderer: QDT.util.Renderer.skillStatusRenderer
            //            }, {
            //                dataIndex: 'step1', text: Ext.String.format(Profile.getText('PracticeStage'), 1), tooltip: Ext.String.format(Profile.getText('PracticeStage'), 1), flex: 1, minWidth: 60, renderer: QDT.util.Renderer.skillStatusRenderer
            //            }, {
            //                dataIndex: 'step2', text: Ext.String.format(Profile.getText('PracticeStage'), 2), tooltip: Ext.String.format(Profile.getText('PracticeStage'), 2), flex: 1, minWidth: 60, renderer: QDT.util.Renderer.skillStatusRenderer
            //            }, {
            //                dataIndex: 'step3', text: Ext.String.format(Profile.getText('PracticeStage'), 3), tooltip: Ext.String.format(Profile.getText('PracticeStage'), 3), flex: 1, minWidth: 60, renderer: QDT.util.Renderer.skillStatusRenderer
            //            }, {
            //                dataIndex: 'step4', text: Profile.getText('SupervisorApproval'), tooltip: Profile.getText('SupervisorApproval'), flex: 1, minWidth: 60, renderer: QDT.util.Renderer.skillStatusRenderer
            //            }, {
            //                dataIndex: 'step5', text: Profile.getText('QualityApproval'), tooltip: Profile.getText('QualityApproval'), flex: 1, minWidth: 60, renderer: QDT.util.Renderer.skillStatusRenderer
            //            }
            ]
        });


        me.callParent();
    },
    statusRenderer: function (v, meta, rec) {
        // var currentStepName = rec.data.current_step_name;
        if (v == '培训完成') {
            meta.tdCls = 'circle_green cell-image-single';
            meta.tdAttr = Ext.String.format('title="{0}"', Profile.getText('stepStatus_Approved'));
        }
        else {
            meta.tdCls = 'circle_yellow cell-image-single';
            meta.tdAttr = Ext.String.format('title="{0}"', Profile.getText('stepStatus_Approved'));
        }
        return '';
    }

});