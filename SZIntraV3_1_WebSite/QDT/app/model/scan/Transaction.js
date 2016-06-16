Ext.define('QDT.model.scan.Transaction', {
    extend: 'Ext.data.Model',
    fields: ['id',
    'scan_type',
    'work_date',
    'employee_name',
    'machine_number',
    'job',
    'suffix',
    'oper_num',
    'start_time',
    'end_time',
    'work_time',
    'secs',
    'qty_work_on',
    'employee_id']
});