Ext.define('Asz.model.system.User', {
    extend: 'Ext.data.Model',
    fields: [
        'user_id',
        'sso',
        'name_cn',
        'name_en',
        {
            name: 'name', convert: function (v, rec) {
                return rec.data['name_' + Profile.getLang()];
            }
        }
    ],
    idProperty:'user_id'

});