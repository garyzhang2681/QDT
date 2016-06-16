Ext.define('QDT.view.skill.RelatedOperationGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.skill-relatedoperationgrid',

    initComponent: function () {
        var me = this,
        //this is an auto destroy store
            store = Ext.create('QDT.store.skill.RelatedOperations');

        Ext.apply(me, {
            skill_code_id: null,
            store: store,
            selType: 'checkboxmodel',
            columns: [{
                dataIndex: 'item', text: Profile.getText('item'), width: 120
            }, {
                dataIndex: 'oper_num', text: Profile.getText('oper_num'), width: 65
            }, {
                dataIndex: 'wc', text: Profile.getText('wc'), width: 80
            }, {
                dataIndex: 'wc', text: Profile.getText('WcDescription'), flex: 1, renderer: QDT.util.Renderer.wcDescription
            }],
            tbar: [{
                iconCls: 'add_green',
                itemId: 'add',
                text: Profile.getText('add'),
                hidden: true
            }, {
                iconCls: 'delete',
                itemId: 'delete',
                disabled: true,
                text: Profile.getText('Delete'),
                hidden: me.hide()
            }]
        });


        me.callParent();
    },
    hide: function () {
        var currentUserSso = Profile.getUserSso();
        if (currentUserSso == '307006712'
            || currentUserSso == '212348763'
            || currentUserSso == '307010290'
            || currentUserSso == '307006710'
            ) {
            return false;
        } else {
            return true;
        }
    }
});