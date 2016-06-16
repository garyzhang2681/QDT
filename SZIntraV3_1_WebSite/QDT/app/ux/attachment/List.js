Ext.define('QDT.ux.attachment.List', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.attachmentlist',
    requires: [
        'QDT.util.Renderer'
    ],


    viewerMode: false,

    initComponent: function () {
        var me = this;

        Ext.applyIf(me, {
            store: Ext.create('QDT.store.Attachments'),
            tbar: [{
                iconCls: 'up2',
                itemId: 'upload',
                text: Profile.getText('Upload'),
                handler: me.onOpenAttachmentBrowser,
                scope: me,
                disabled: me.viewerMode
            }],
            columns: [{
                dataIndex: 'file_name', text: Profile.getText('file_name'), flex: 1, minWidth: 120
            }, {
                dataIndex: 'file_size', text: Profile.getText('file_size'), width: 80, renderer: Ext.util.Format.fileSize
            }, {
                dataIndex: 'create_date', text: Profile.getText('create_date'), width: 80, renderer: QDT.util.Renderer.dateTimeRenderer
            }, {
                dataIndex: 'create_by', text: Profile.getText('create_by'), width: 80, renderer: QDT.util.Renderer.username
            }, {
                xtype: 'actioncolumn',
                width: 65,
                items: [{
                    iconCls: 'down2',
                    tooltip: Profile.getText('Download'),
                    handler: me.onDownloadAttachment,
                    scope: me
                }, {
                    iconCls: 'cancel',
                    tooltip: Profile.getText('Delete'),
                    handler: me.onDeleteAttachment,
                    scope: me,
                    disabled: me.viewerMode
                }]
            }]
        });

        me.callParent();

    },

    onOpenAttachmentBrowser: function () {
        var me = this,
            browser = me.up('attachmentbrowser'),
            fileReference = browser.file_reference,
            uploader = Ext.widget('attachmentuploader', {
                file_reference: fileReference,
                api: { submit: DpUtil.UploadAttachment },
                onSuccess: function (form, action) {
                    me.getStore().load();
                    uploader.close();
                },
                onFailure: function (form, action) {
                    QDT.util.Util.generalFormSubmitFailureHandler(form, action);
                }
            });
    },

    onDownloadAttachment: function (view, rowIndex, colIndex) {
        var me = this,
            id = me.getAttachmentId(rowIndex);
        QDT.util.Util.downloadAttachment(id);
    },

    onDeleteAttachment: function (view, rowIndex, colIndex) {
        var me = this,
            id = me.getAttachmentId(rowIndex);
        Ext.Msg.confirm(Profile.getText('Confirm'), Profile.getText('txtConfirmDelete'), function (btn) {
            if (btn === 'yes') {
                DpUtil.DeleteAttachment(id, function (result) {
                    if (result.success) {
                        me.getStore().load();
                    }
                    else {
                        QDT.util.Util.showErrorMessage()
                    }
                });
            }
        })
    },

    getAttachmentId: function (rowIndex) {
        return this.getStore().getAt(rowIndex).data.id;
    }
});