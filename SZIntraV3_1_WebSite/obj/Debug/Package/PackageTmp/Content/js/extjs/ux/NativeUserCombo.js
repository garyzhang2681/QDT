Ext.define('Asz.ux.NativeUserCombo', {
    extend: 'Asz.ux.SearchCombo',
    alias: 'widget.nativeusercombo',
    name: 'native_user',
    store: 'Asz.store.system.NativeUsers',
    valueField: 'user_id',
    displayField: 'name',

    initComponent: function () {
        var me = this;

        Ext.applyIf(me, {
            listConfig: {
                width: 220,
                matchFieldWidth: false,
                getInnerTpl: function () {
                    return [
                        '<p>{name}</p>',
                        '<p><i>' + Profile.getText('local_id') + ': {local_id}; ' + Profile.getText('sso') + ': {sso}</i></p>'
                    ].join('');
                }
            }
        });

        me.callParent();
    }
});