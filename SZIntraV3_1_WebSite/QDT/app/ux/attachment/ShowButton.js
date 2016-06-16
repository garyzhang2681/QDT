Ext.define('QDT.ux.attachment.ShowButton', {
    extend: 'Ext.button.Button',
    alias: 'widget.attachmentbutton',
    requires: [
        'QDT.ux.attachment.Browser'
    ],

    //the owner component that this button and other components is placed in, thw ownerCt property usually returns the toolbar in many senarios which is not enough to reference other components.
    rootCt: null,

    //the field name to store registered dummy id.
    idFieldName: null,

    //the attachment browser object created after this button is clicked.
    browser: null,

    //ref_type value, e.g. 'lesson', 'stamperrequest'
    refType: null,

    //ref_num value, if not set(as the record that those attachments refer to are not created yet), this button will request a dummy GUID from server
    refNum: null,

    viewerMode: false,

    //if set to true, a dummy id will be genereated and attach to this button.
    generateId: true,

    initComponent: function () {
        var me = this;

        me.callParent();

        me.mon(me, {
            destroyable: true,
            click: me.onClick,
            afterrender: me.onButtonRender,
            beforedestroy: me.onBeforeDestroy
        });
    },

    onClick: function () {
        var me = this,
            store,
            browser,
            quantity,
            fileReference = {
                ref_type: me.refType,
                ref_num: me.refNum
            };
        if (me.refNum && me.refNum !== '') {
            browser = Ext.widget('attachmentbrowser', {
                file_reference: fileReference,
                viewerMode: me.viewerMode
            });
            me.browser = browser;
            store = browser.down('attachmentlist').store;
            store.mon(store, {
                destroyable: true,
                datachanged: function () {
                    me.refreshText(store.count());
                },
                beforeload: function () {
                    Ext.apply(store.proxy.extraParams, fileReference);
                }
            });
            store.load();
        }
    },

    //refresh button text by attachment quantity.
    refreshText: function (quantity) {
        this.setText(Profile.getText('attachment') + ((quantity > 0) ? Ext.String.format('({0})', quantity) : ''));
    },

    onButtonRender: function () {
        var me = this;
        if (me.generateId) {
            me.registerDummyId();
        }
    },

    registerDummyId: function () {
        var me = this,
            id;
        DpUtil.RegisterDummyId(function (result) {
            if (result.success) {
                id = result.data;
                me.setRefNum(id);
            } else {
                QDT.util.Util.showErrorMessage(result.errorMessage);
            }
        });
    },

    deregisterDummyId: function () {
        var me = this;
        if (me.generateId) {
            DpUtil.DeregisterDummyId(me.refNum, QDT.util.Util.generalDirectCallBack);
        }
    },

    onBeforeDestroy: function () {
        this.deregisterDummyId();
    },

    setRefNum: function (id) {
        var me = this,
            query = me.idFieldName ? ('[name=' + me.idFieldName + ']') : null;
        me.refNum = id;
        if (me.rootCt && query) {
            me.rootCt.down(query).setValue(id);
        }
    }
});