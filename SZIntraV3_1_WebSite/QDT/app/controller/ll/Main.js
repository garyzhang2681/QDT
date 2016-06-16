Ext.define('QDT.controller.ll.Main', {
    extend: 'Ext.app.Controller',
    views: [
        'QDT.view.ll.Viewport'
    ],
    refs: [{
        ref: 'llViewport',
        selector: 'll-viewport'
    }],

    init: function () {
        var me = this;

        me.application.on({
            scope: me,
            showtab: me.onShowTab
        });
    },

    onShowTab: function (xtype, config) {
        var me = this,
            viewport = me.getLlViewport();
        viewport.showTab(xtype, config);
    }
});