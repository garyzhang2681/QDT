Ext.define('Asz.ux.RemoteCombo', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.remotecombo',
    queryMode: 'remote',
    queryParam: 'query',
    typeAhead: true,
    editable: false,
    //    selectOnFocus: false,
    forceSelection: true,
    triggerClick: null,
    initComponent: function () {
        var me = this;
        if (me.triggerClick !== null) {

            //TODO:原函数的onTriggerClick执行什么内容
            //find out how this works
            me.onTriggerClick = me.triggerClick;
        }
        me.callParent();
    }
});
