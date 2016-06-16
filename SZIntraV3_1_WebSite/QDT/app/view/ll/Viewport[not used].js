Ext.define('QDT.view.ll.Viewport', {
    extend: 'Ext.container.Viewport',
    alias: 'widget.ll-viewport',
    layout: 'border',
    renderTo: Ext.getBody(),

    initComponent: function () {
        var me = this,
            menu;

        menu = Ext.widget('panel', {
            minWidth: 200,
            defaults: {
                scope: me
            },
            items: [{
                xtype: 'button',
                text: 'Lesson Category',
                handler: me.openCategoryManagement
            }, {
                xtype: 'button',
                text: 'Lessons',
                handler: function () {
                    me.showTab('ll-lessonpanel');
                }
                //                handler: me.openLessonList
            }, {
                xtype: 'button',
                text: 'My Trainings',
                handler: function () {
                    me.showTab('ll-mytraininglist');
                }
            }]
        });

        Ext.apply(me, {
            items: [{
                region: 'west',
                layout: 'fit',
                items: [menu]
            }, {
                region: 'center',
                xtype: 'tabpanel',
                //            stateful: true,
                //            stateId:'ll-tabpenl',
                items: [
                ]
            }]
        });

        me.callParent();
    },

    showTab: function (xtype, config) {
        var me = this,
            config = config || {},
            tab,
            tabPanel = me.down('tabpanel');
        config.closable = true;
        //singleton will be set as false unless singleton
        config.singleton = Ext.isDefined(config.singleton) ? config.singleton : true;
        tab = tabPanel.down(xtype);
        if (!tab || !config.singleton) {
            tab = tabPanel.add(Ext.widget(xtype, config));
        }
        tabPanel.setActiveTab(tab);
    },

    openCategoryManagement: function () {
        var me = this;
        me.showTab('ll-categorymanagement');
    }

});