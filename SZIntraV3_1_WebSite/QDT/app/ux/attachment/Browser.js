Ext.define('QDT.ux.attachment.Browser', {
    extend: 'Ext.window.Window',
    alias: 'widget.attachmentbrowser',
    requires: [
        'QDT.ux.attachment.List',
        'QDT.ux.attachment.Uploader'
    ],
    layout: 'fit',
    autoShow: true,
    width: 450,
    height: 320,
    constrainHeader: true,
    modal: true,
    file_reference: {},
    viewerMode: false,

    initComponent: function () {
        var me = this;

        me.title = Profile.getText('ViewAttachments');

        me.items = [{
            xtype: 'attachmentlist',
            viewerMode: me.viewerMode
        }];

        me.callParent();
    }
});