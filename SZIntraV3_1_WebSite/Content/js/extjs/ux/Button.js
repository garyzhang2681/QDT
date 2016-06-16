//All buttons which may need a permission check should specified as xtype: aszbutton instead of xtype: button
Ext.define('Asz.ux.Button', {
    extend: 'Ext.button.Button',
    alias: 'widget.aszbutton',

    //if this value is true, this button require a permission check; otherwise not.
    //default: true
    checkPermission: true,

    //the owner widget name/xtype of this button
    ownerWidget: '',

    //should align with database record
    actionName: '',

    initComponent: function () {
        var me = this;
        me.hidden = me.checkPermission;
        if (me.ownerWidget !== '' && me.actionName !== '') {
            //if user don't have privilege of this button, do hide
            me.hidden = !Profile.checkWidgetActionPermission(me.ownerWidget, me.actionName);
        }

        me.callParent();
    }
});