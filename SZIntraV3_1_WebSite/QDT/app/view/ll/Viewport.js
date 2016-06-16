Ext.define('QDT.view.ll.Viewport', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.ll-viewport',
    layout: 'border',
    renderTo: Ext.getBody(),

    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            items: [
             { xtype: 'll-lessonpanel' }
            //            {
            //                region: 'center',
            //                xtype: 'tabpanel',
            //                //            stateful: true,
            //                //            stateId:'ll-tabpenl',
            //                items: [{
            //                    xtype: 'll-lessonpanel'
            //                }]
            //            }
            ]
        });

        me.callParent();
    },

    showTab: function (xtype, config) {
        var me = this,
            config = config || {},
            tab,
            tabPanel = me; //.down('tabpanel');
        config.closable = true;
        //singleton will be set as false unless singleton
        config.singleton = Ext.isDefined(config.singleton) ? config.singleton : true;
//        config.listeners = { close: function () {
//            tabPanel.setActiveTab(tabPanel.child().items.items[1]);
//        }
//        };
        tab = tabPanel.down(xtype);
        //如果不存在tab，就直接新建，如果存在tab，就看是否是单例，是的话，就不创建，不是的话就创建一个
        if (!tab || !config.singleton) {
            tab = tabPanel.add(Ext.widget(xtype, config));
        }
        tabPanel.setActiveTab(tab);
    }
});