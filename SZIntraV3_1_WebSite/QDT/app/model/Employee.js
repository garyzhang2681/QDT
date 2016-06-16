Ext.define("QDT.model.Employee", {
    extend: 'Ext.data.Model',
    fields: [
    { name: 'sso', mapping: 'employee.sso' },
    { name: 'name', mapping: 'employee.name_' + Profile.getLang() },
    { name: 'employee_id', mapping: 'employee.employee_id' }
   ]
});