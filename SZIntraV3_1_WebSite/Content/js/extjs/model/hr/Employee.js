Ext.define('Asz.model.hr.Employee', {
    extend: 'Ext.data.Model',
    fields: [
        'employee_id',
        'local_id',
        'sso',
        'aviation_uid',
        'name_cn',
        'name_en',
        'email',
        {
            name: 'name', convert: function (v, rec) {
                return rec.data['name_' + Profile.getLang()];
            }
        }
    ],
    idProperty: 'employee_id'

    //    associations: [{
    //        type: 'hasOne', model: 'QDT.model.repository.User', primaryKey: 'sso', foreignKey: 'sso',getterName:'getUser'
    //    }]



});