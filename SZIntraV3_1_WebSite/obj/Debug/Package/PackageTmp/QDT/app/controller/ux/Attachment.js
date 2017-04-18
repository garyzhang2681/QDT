Ext.define('QDT.controller.ux.Attachment', {
    extend: 'Ext.app.Controller',
    views: [
        'QDT.view.ux.attachment.Browser',
        'QDT.view.ux.attachment.ShowButton'
    ],

    init: function () {
        var me = this;

        me.control();
    }
})