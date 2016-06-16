Ext.define('QDT.ux.attachment.Uploader', {
    extend: 'Ext.window.Window',
    alias: 'widget.attachmentuploader',
    iconCls: 'up2',
    width: 450,
    height: 120,
    layout: 'fit',
    autoShow: true,
    modal: true,
    api: {},
    file_reference: {},
    onSuccess: null,
    onFailure: null,


    initComponent: function () {
        var me = this;
        Ext.apply(me, {
            title: Profile.getText('UploadAttachment'),
            items: [{
                xtype: 'form',
                frame: true,
                layout: 'anchor',
                bodyPadding: '10 0',
                api: me.api,
                items: [{
                    xtype: 'filefield',
                    name: 'file',
                    allowEmpty: false,
                    emptyText: Profile.getText('txtSelectFile') + '...',
                    buttonConfig: {
                        iconCls: 'add_file'
                    },
                    anchor: '100%'
                }, {
                    xtype: 'hiddenfield',
                    name: 'ref_type',
                    value: me.file_reference.ref_type
                }, {
                    xtype: 'hiddenfield',
                    name: 'ref_num',
                    value: me.file_reference.ref_num
                }]
            }],
            buttons: [{
                iconCls: 'forward',
                text: Profile.getText('Submit'),
                scope: me,
                handler: me.onSubmit
            }, {
                iconCls: 'cancel',
                text: Profile.getText('Cancel'),
                handler: function () {
                    me.close();
                }
            }]
        });

        me.callParent();
    },

    onSubmit: function () {
        var me = this;
        me.down('form').getForm().submit({
            waitMsg: Profile.getText('txtWaitUploading'),
            success: me.onSuccess,
            failure: me.onFailure
        });
    }
});