Ext.define('QDT.view.ll.LessonDetail', {
    extend: 'Ext.form.Panel',
    alias: 'widget.ll-lessondetail',
    requires: [
        'QDT.util.Renderer',
        'QDT.ux.attachment.Browser'
    ],

    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            autoScroll: true,
            border: false,
            bodyPadding: '15',
            defaultType: 'displayfield',
            defaults: {
                labelWidth: 60,
                margin: '0 0 10 0'
            },
            items: [
                {
                    xtype: 'hiddenfield',
                    name: 'id'
                }, {
                    name: 'detail_title',
                    style: {
                        backgroundColor: '#add566'
                    }
                }, {
                    name: 'business',
                    fieldLabel: Profile.getText('business'),
                    renderer: Ext.String.capitalize
                }, {
                    name: 'category_id',
                    fieldLabel: Profile.getText('category'),
                    renderer: QDT.util.Renderer.lessonCategory
                }, {
                    name: 'owner_id',
                    fieldLabel: Profile.getText('owner'),
                    renderer: QDT.util.Renderer.employeeName
                }, {
                    name: 'create_date',
                    fieldLabel: Profile.getText('create_date'),
                    renderer: Ext.util.Format.dateRenderer('Y-m-d H:i')
                }, {
                    name: 'create_by',
                    fieldLabel: Profile.getText('create_by'),
                    renderer: QDT.util.Renderer.username
                }, {
                    name: 'subject',
                    fieldLabel: Profile.getText('subject')
                }, {
                    name: 'detail',
                    fieldBodyCls: 'white-paper',
                    fieldLabel: Profile.getText('detail')
                }
            ],
            tbar: [
            {
                xtype: 'attachmentbutton',
                iconCls: 'attachment',
                itemId: 'view-attachment',
                text: Profile.getText('attachment'),
                tooltip: Profile.getText('txtViewAttachment'),
                refType: 'lesson',
                generateId: false
            }, '->', {
                xtype: 'button',
                iconCls: 'print',
                name: 'print',
                itemId: 'print',
                text: Profile.getText('Print')
            }]
        });

        me.callParent();
    }
});