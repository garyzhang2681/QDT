Ext.define('QDT.view.ll.LessonPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.ll-lessonpanel',
    requires: [
        'QDT.view.ll.LessonList',
        'QDT.view.ll.LessonDetail'
    ],

    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            title: Profile.getText('Lessons'),
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [{
                xtype: 'll-lessonlist',
                flex: 1
            }, {
                xtype: 'splitter'
            }, {
                xtype: 'll-lessondetail',
                minWidth: 300,
                width: 320,
                header: false,
                collapsible: true,
                collapseDirection: 'right',
                animCollapse: false
            }]
        });

        me.callParent();
    }
});