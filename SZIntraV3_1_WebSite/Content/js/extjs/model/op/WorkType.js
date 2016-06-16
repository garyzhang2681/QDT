Ext.define('Asz.model.op.WorkType', {
    extend: 'Ext.data.Model',
    fields: [
        'work_type',
        { name: 'work_type_string', convert: function (v, record) {
            return Profile.getText(record.data.work_type);
        }
        }
    ]
});