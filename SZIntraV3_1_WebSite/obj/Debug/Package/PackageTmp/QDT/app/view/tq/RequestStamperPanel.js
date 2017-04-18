Ext.define('QDT.view.tq.RequestStamperPanel', {
    extend: 'Ext.form.Panel',
    alias: 'widget.tq-requeststamperpanel',
    requires: [
        'QDT.ux.attachment.ShowButton'
    ],

    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            autoScroll: false,
            border: false,
            bodyPadding: '15',
            api: { submit: 'DpTq.RequestStamper' },
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            defaults: {
                labelWidth: 60,
                autoScroll: true,
                margin: '0 0 10 0'
            },
            tbar: [{
                iconCls: 'attachment',
                itemId: 'view-attachment',
                xtype: 'attachmentbutton',
                text: Profile.getText('attachment'),
                tooltip: Profile.getText('txtViewAttachment'),
                rootCt: me,
                idFieldName: 'request_id',
                refType: 'process'
            }],
            items: [{
                xtype: 'fieldset',
                flex: 1,
                defaultType: 'displayfield',
                defaults: {
                    labelWidth: 75
                },
                title: 'Request Info',
                items: [{
                    name: 'request_id',
                    xtype: 'hiddenfield'
                }, {
                    name: 'requestor',
                    fieldLabel: Profile.getText('requestor'),
                    renderer: QDT.util.Renderer.username,
                    value: Profile.getUser().user_id
                }, {
                    fieldLabel: Profile.getText('create_date'),
                    value: new Date(),
                    renderer: QDT.util.Renderer.dateTimeRenderer
                }, {
                    xtype: 'employeecombo',
                    itemId: 'request_for',
                    fieldLabel: Profile.getText('request_for'),
                    name: 'request_for',
                    pageSize: 10,
                    forctSelection: true,
                    allowBlank: false,
                    anchor: '50%',
                    minWidth: 200,
                    width: 200
                }, {
                    name: 'sso',
                    fieldLabel: Profile.getText('sso')
                }, {
                    name: 'hire_date',
                    fieldLabel: Profile.getText('hire_date')
                }]
            }, {
                xtype: 'fieldset',
                flex: 1,
                border: '1 1 1 0',
                title: 'Specifics',
                items: [{
                    xtype: 'displayfield',
                    value: me.dummySpecifics
                }]
            }],
            buttons: [{
                iconCls: 'submit',
                itemId: 'submit',
                text: Profile.getText('Submit')
            }]
        });

        me.callParent();
    },

    dummySpecifics: '<span style="line-height: 10px;"><b><b style="color: rgb(0, 0, 0); background-color: rgb(255, 255, 255);">请确认需要上传的附件：</b></font><table border="1">' +
        '<tr><th></th><th>附件描述</th></tr>' +
        '<tr><td>1</td><td><b>检验和校验:</b> 印章申请单(F753B-005); 质量体系考试卷; 量具理论考试卷, 量具实操记录(F753B-001).</td></tr>' +
        '<tr><td>2</td><td><b>驱动/复合材料:</b> 印章申请单(F753B-005); 质量体系考试卷; </td></tr>' +
        '<tr><td>3</td><td><b>机加工:</b> 印章申请单(F753B-005);质量体系考试卷; 量具理论考试卷, 量具实操记录(F753B-001) 工艺考试卷;机床操作考试卷; 记录填写卷; P11TF12 考试卷(当适用时)</td></tr>' +
        '<tr><td>4</td><td><b>机加打磨工：</b>印章申请单(F753B-005);质量体系考试卷; 量具理论考试卷（当适用时）, 量具实操记录(F753B-002)；工艺考试卷; P11TF12 考试卷(当适用时)</td></tr>' +
        '<tr><td>5</td><td><b>机加工培训师:</b> 培训师申请单（753B-006）; 质量体系考试卷; 量具理论考试卷, 量具实操记录. 工艺考试卷; 机床操作考试卷; 记录填写卷; P11TF12 考试卷(当适用时)</td></tr>' +
      
        '</table></span>'
});