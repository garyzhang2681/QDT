Ext.define('Asz.ux.MessageBox', {
    extend: 'Ext.window.MessageBox',
    alias: 'widget.warningmessagebox',
    alternateClassName: ['My.Msg'],  

    initComponent: function () {
        var me = this;
        Ext.applyIf(me, {
            alert: function (cfg, msg, fn, scope) {
                if (Ext.isString(cfg)) {
                    cfg = {
                        title: cfg,
                        msg: msg,
                        buttons: Ext.MessageBox.OK,
                        fn: fn,
                        scope: scope,
                        minWidth: Ext.MessageBox.minWidth
                    };
                    return Ext.MessageBox.show(cfg);
                }
            },

            info: function (cfg, msg, fn, scope) {
                if (Ext.isString(cfg)) {
                    cfg = {
                        title: cfg,
                        msg: msg,
                        buttons: Ext.MessageBox.OK,
                        fn: fn,
                        scope: scope,
                        minWidth: Ext.MessageBox.minWidth,
                        icon: Ext.MessageBox.INFO
                    };
                    return Ext.MessageBox.show(cfg);
                }
            },

            question: function (cfg, msg, fn, scope) {
                if (Ext.isString(cfg)) {
                    cfg = {
                        title: cfg,
                        msg: msg,
                        buttons: Ext.MessageBox.YESNO,
                        fn: fn,
                        scope: scope,
                        minWidth: Ext.MessageBox.minWidth,
                        icon: Ext.MessageBox.QUESTION
                    };
                    return Ext.MessageBox.show(cfg);
                }
            },

            warning: function (msg, fn, scope) {
                    cfg = {
                        title: '警告',
                        msg: msg,
                        buttons: Ext.MessageBox.OK,
                        fn: fn,
                        scope: scope,
                        minWidth: Ext.MessageBox.minWidth,
                        icon: Ext.MessageBox.WARNING
                    };
                    return Ext.MessageBox.show(cfg);
               
            },

            error: function (cfg, msg, fn, scope) {
                if (Ext.isString(cfg)) {
                    cfg = {
                        title: cfg,
                        msg: msg,
                        buttons: Ext.MessageBox.OK,
                        fn: fn,
                        scope: scope,
                        minWidth: Ext.MessageBox.minWidth,
                        icon: Ext.MessageBox.ERROR
                    };
                    return Ext.MessageBox.show(cfg);
                }
            }
        });  

        me.callParent();
    }
}, function () {
    MessageBox = My.Msg = new this();
});
