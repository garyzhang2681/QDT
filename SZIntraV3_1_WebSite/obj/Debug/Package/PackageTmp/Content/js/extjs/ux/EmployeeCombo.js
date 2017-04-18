Ext.define('Asz.ux.EmployeeCombo', {
    extend: 'Asz.ux.SearchCombo',
    alias: 'widget.employeecombo',
    name: 'employee',
    //store:'Asz.store.hr.Employees',
    // Mike Jin 2015/1/7
    store:Ext.create('Asz.store.hr.Employees'),
    valueField: 'employee_id',
    displayField: 'name',
   
    initComponent: function () {
        var me = this;

        Ext.applyIf(me, {
            fieldLabel: Profile.getText('Employee'),
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